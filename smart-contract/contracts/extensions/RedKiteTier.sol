// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../libraries/Ownable.sol";
import "../libraries/ReentrancyGuard.sol";
import "../token/ERC20.sol";

contract RedKiteTier is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct UserInfo {
        uint256 staked;
        uint256 stakedTime;
    }

    struct ExternalToken {
        address contractAddress;
        uint256 decimals;
        uint256 rate;
    }

    uint256 constant MAX_NUM_TIERS = 10;
    uint8 currentMaxTier = 4;

    address public penaltyWallet;

    ERC20 public PKF;

    mapping(address => UserInfo) public userInfo;
    uint256[MAX_NUM_TIERS] tierPrice;

    uint256[] public withdrawFeePercent;
    ExternalToken[] public externalToken;

    bool public canEmergencyWithdraw;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 indexed amount, uint256 fee);
    event EmergencyWithdrawn(address indexed user, uint256 amount);
    event AddExternalToken(address indexed token, uint256 decimals, uint256 rate);
    event ExternalTokenStatsChange(address indexed token, uint256 decimals, uint256 rate);
    event ChangePenaltyWallet(address indexed penaltyWallet);

    constructor(address _pkf, address _penaltyWallet) {
        owner = msg.sender;
        penaltyWallet = _penaltyWallet;

        PKF = ERC20(_pkf);

        tierPrice[1] = 2000e18;
        tierPrice[2] = 5000e18;
        tierPrice[3] = 10000e18;
        tierPrice[4] = 20000e18;

        withdrawFeePercent.push(30);
        withdrawFeePercent.push(25);
        withdrawFeePercent.push(20);
        withdrawFeePercent.push(10);
        withdrawFeePercent.push(5);
        withdrawFeePercent.push(0);
    }

    function deposit(uint256 _amount) external nonReentrant() {
        PKF.transferFrom(msg.sender, address(this), _amount);

        userInfo[msg.sender].staked = userInfo[msg.sender].staked.add(_amount);
        userInfo[msg.sender].stakedTime = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external nonReentrant() {
        UserInfo storage user = userInfo[msg.sender];
        require(user.staked >= _amount, "not enough amount to withdraw");

        uint256 toPunish = calculateWithdrawFee(msg.sender, _amount);
        user.staked = user.staked.sub(_amount);

        if (toPunish > 0) {
            PKF.transfer(penaltyWallet, toPunish);
        }

        PKF.transfer(msg.sender, _amount.sub(toPunish));
        emit Withdrawn(msg.sender, _amount, toPunish);
    }

    function setPenaltyWallet(address _penaltyWallet) external onlyOwner {
		    require(penaltyWallet != _penaltyWallet, "TIER::ALREADY_PENALTY_WALLET");
        penaltyWallet = _penaltyWallet;

        emit ChangePenaltyWallet(_penaltyWallet);
    }

    function updateEmergencyWithdrawStatus(bool _status) external onlyOwner {
        canEmergencyWithdraw = _status;
    }

    function emergencyWithdraw() external {
        require(canEmergencyWithdraw, "function disabled");
        UserInfo storage user = userInfo[msg.sender];
        require(user.staked > 0, "nothing to withdraw");

        uint256 _amount = user.staked;
        user.staked = 0;

        PKF.transfer(msg.sender, _amount);
        emit EmergencyWithdrawn(msg.sender, _amount);
    }

    function addExternalToken(
        address _token,
        uint256 _decimals,
        uint256 _rate
    ) external onlyOwner {
        externalToken.push(
            ExternalToken({contractAddress: _token, decimals: _decimals, rate: _rate})
        );

        emit AddExternalToken(_token, _decimals, _rate);
    }

    function setExternalToken(
        uint256 _id,
        uint256 _decimals,
        uint256 _rate
    ) external onlyOwner {
        ExternalToken storage token = externalToken[_id];
        require(token.decimals != 0, "TIER::EXTERNAL_TOKEN_NOT_FOUND");

        token.decimals = _decimals;
        token.rate = _rate;

        emit ExternalTokenStatsChange(token.contractAddress, _decimals, _rate);
    }

    function updateTier(uint8 _tierId, uint256 _amount) external onlyOwner {
        require(_tierId > 0 && _tierId <= MAX_NUM_TIERS, "invalid _tierId");
        tierPrice[_tierId] = _amount;
        if (_tierId > currentMaxTier) {
            currentMaxTier = _tierId;
        }
    }

    function updateWithdrawFee(uint256 _key, uint256 _percent)
        external
        onlyOwner
    {
        require(_percent < 100, "too high percent");
        withdrawFeePercent[_key] = _percent;
    }

    function getUserTier(address _userAddress)
        external
        view
        returns (uint8 res)
    {
        uint256 totalStaked = userInfo[_userAddress].staked;
        uint256 length = externalToken.length;
        for (uint8 i = 0; i < length; i++) {
            ExternalToken storage token = externalToken[i];
            totalStaked = totalStaked.add(
                IERC20(token.contractAddress).balanceOf(_userAddress).mul(token.rate).div(10**token.decimals)
            );
        }
        for (uint8 i = 1; i <= MAX_NUM_TIERS; i++) {
            if (tierPrice[i] == 0 || totalStaked < tierPrice[i]) {
                return res;
            }

            res = i;
        }
    }

    function calculateWithdrawFee(address _userAddress, uint256 _amount)
        public
        view
        returns (uint256)
    {
        UserInfo storage user = userInfo[_userAddress];
        require(user.staked >= _amount, "not enough amount to withdraw");

        if (block.timestamp < user.stakedTime.add(10 days)) {
            return _amount.mul(withdrawFeePercent[0]).div(100); //30%
        }

        if (block.timestamp < user.stakedTime.add(20 days)) {
            return _amount.mul(withdrawFeePercent[1]).div(100); //25%
        }

        if (block.timestamp < user.stakedTime.add(30 days)) {
            return _amount.mul(withdrawFeePercent[2]).div(100); //20%
        }

        if (block.timestamp < user.stakedTime.add(60 days)) {
            return _amount.mul(withdrawFeePercent[3]).div(100); //10%
        }

        if (block.timestamp < user.stakedTime.add(90 days)) {
            return _amount.mul(withdrawFeePercent[4]).div(100); //5%
        }

        return _amount.mul(withdrawFeePercent[5]).div(100);
    }

    //frontend func
    function getTiers()
        external
        view
        returns (uint256[MAX_NUM_TIERS] memory buf)
    {
        for (uint8 i = 1; i < MAX_NUM_TIERS; i++) {
            if (tierPrice[i] == 0) {
                return buf;
            }
            buf[i - 1] = tierPrice[i];
        }

        return buf;
    }
}