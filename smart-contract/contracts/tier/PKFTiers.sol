// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../libraries/Ownable.sol";
import "../libraries/ReentrancyGuard.sol";
import "../token/ERC20/ERC20.sol";
import "../token/ERC721/IERC721.sol";
import "../token/ERC721/IERC721Receiver.sol";

contract PKFTiers is IERC721Receiver, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct UserInfo {
        uint256 staked;
        uint256 stakedTime;
    }

    struct ExternalToken {
        address contractAddress;
        uint256 decimals;
        uint256 rate;
        bool isERC721;
        bool isERC1155;
    }

    uint256 constant MAX_NUM_TIERS = 10;
    uint8 currentMaxTier = 4;

    address public penaltyWallet;

    address public PKF;

    mapping(address => mapping(address => UserInfo)) public userInfo;
    mapping(address => uint256) public userExternalStaked;
    uint256[MAX_NUM_TIERS] tierPrice;

    uint256[] public withdrawFeePercent;
    mapping(address => ExternalToken) public externalToken;

    bool public canEmergencyWithdraw;

    event StakedERC20(address indexed user, address token, uint256 amount);
    event StakedSingleERC721(address indexed user, address token, uint128 tokenId);
    event StakedBatchERC721(address indexed user, address token, uint128[] tokenIds);
    // event StakedERC1155(address indexed user, address token, uint256 amount);
    event WithdrawnERC20(address indexed user, address token, uint256 indexed amount, uint256 fee);
    event WithdrawnSingleERC721(address indexed user, address token, uint128 tokenId);
    event WithdrawnBatchERC721(address indexed user, address token, uint128[] tokenIds);
    // event WithdrawnERC1155(address indexed user, address token, uint256 indexed amount);
    event EmergencyWithdrawnERC20(address indexed user, address token, uint256 amount);
    event EmergencyWithdrawnERC721(address indexed user, address token, uint128[] tokenIds);
    // event EmergencyWithdrawnERC1155(address indexed user, address token, uint256 amount);
    event AddExternalToken(address indexed token, uint256 decimals, uint256 rate, bool isERC721, bool isERC1155);
    event ExternalTokenStatsChange(address indexed token, uint256 decimals, uint256 rate);
    event ChangePenaltyWallet(address indexed penaltyWallet);

    constructor(address _pkf, address _penaltyWallet) {
        owner = msg.sender;
        penaltyWallet = _penaltyWallet;

        PKF = _pkf;

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

    function depositERC20(address _token, uint256 _amount) external nonReentrant() {
        if (_token == PKF) {
            IERC20(PKF).transferFrom(msg.sender, address(this), _amount);
        } else {
            require(_token == externalToken[_token].contractAddress, "TIER::INVALID_TOKEN_DEPOSIT");
            IERC20(_token).transferFrom(msg.sender, address(this), _amount);

            ExternalToken storage token = externalToken[_token];
            userExternalStaked[msg.sender] = userExternalStaked[msg.sender].add(_amount.mul(token.rate).div(10**token.decimals));
        }

        userInfo[msg.sender][_token].staked = userInfo[msg.sender][_token].staked.add(_amount);
        userInfo[msg.sender][_token].stakedTime = block.timestamp;

        emit StakedERC20(msg.sender, _token, _amount);
    }

    function depositSingleERC721(address _token, uint128 _tokenId) external nonReentrant() {
        require(_token == externalToken[_token].contractAddress, "TIER::INVALID_TOKEN_DEPOSIT");
        IERC721(_token).safeTransferFrom(msg.sender, address(this), _tokenId);

        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].add(token.rate);

        userInfo[msg.sender][_token].staked = userInfo[msg.sender][_token].staked.add(1);
        userInfo[msg.sender][_token].stakedTime = block.timestamp;

        emit StakedSingleERC721(msg.sender, _token, _tokenId);
    }

    function depositBatchERC721(address _token, uint128[] memory _tokenIds) external nonReentrant() {
        require(_token == externalToken[_token].contractAddress, "TIER::INVALID_TOKEN_DEPOSIT");
        _batchSafeTransferFrom(_token, msg.sender, address(this), _tokenIds);

        uint256 amount = _tokenIds.length;
        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].add(amount.mul(token.rate));

        userInfo[msg.sender][_token].staked = userInfo[msg.sender][_token].staked.add(amount);
        userInfo[msg.sender][_token].stakedTime = block.timestamp;

        emit StakedBatchERC721(msg.sender, _token, _tokenIds);
    }

    // function depositERC1155(address _token, uint256 _ids, uint256 _amount, bytes calldata data) external nonReentrant() {
    //     require(_token == externalToken[_token].contractAddress, "TIER::INVALID_TOKEN_DEPOSIT");
    //     IERC1155(_token).safeTransferFrom(msg.sender, address(this), _amount, data);

    //     ExternalToken storage token = externalToken[_token];
    //     userExternalStaked[msg.sender] = userExternalStaked[msg.sender].add(_amount.mul(token.rate).div(10**token.decimals));

    //     userInfo[msg.sender][_token].staked = userInfo[msg.sender][_token].staked.add(_amount);
    //     userInfo[msg.sender][_token].stakedTime = block.timestamp;

    //     emit StakedERC1155(msg.sender, _token, _amount);
    // }

    function withdrawERC20(address, address _token, uint256 _amount) external nonReentrant() {
        UserInfo storage user = userInfo[msg.sender][_token];
        require(user.staked >= _amount, "not enough amount to withdraw");

        uint256 toPunish = calculateWithdrawFee(msg.sender, _token, _amount);
        user.staked = user.staked.sub(_amount);

        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].sub(_amount.mul(10**token.decimals).div(token.rate));

        if (toPunish > 0) {
            IERC20(_token).transfer(penaltyWallet, toPunish);
        }

        IERC20(_token).transfer(msg.sender, _amount.sub(toPunish));
        emit WithdrawnERC20(msg.sender, _token, _amount, toPunish);
    }

    function withdrawSingleERC721(address _token, uint128 _tokenId) external nonReentrant() {
        UserInfo storage user = userInfo[msg.sender][_token];
        require(user.staked >= 1, "not enough amount to withdraw");

        user.staked = user.staked.sub(1);

        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].sub(token.rate);

        IERC721(_token).safeTransferFrom(address(this), msg.sender, _tokenId);
        emit WithdrawnSingleERC721(msg.sender, _token, _tokenId);
    }

    function withdrawBatchERC721(address _token, uint128[] memory _tokenIds) external nonReentrant() {
        UserInfo storage user = userInfo[msg.sender][_token];
        uint256 amount = _tokenIds.length;
        require(user.staked >= amount, "not enough amount to withdraw");

        user.staked = user.staked.sub(amount);

        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].sub(amount.mul(token.rate));

        _batchSafeTransferFrom(_token, address(this), msg.sender, _tokenIds);
        emit WithdrawnBatchERC721(msg.sender, _token, _tokenIds);
    }

    // function withdrawERC1155(address _token, uint256 _amount) external nonReentrant() {
    //     UserInfo storage user = userInfo[msg.sender][_token];
    //     require(user.staked >= _amount, "not enough amount to withdraw");

    //     user.staked = user.staked.sub(_amount);

    //     ExternalToken storage token = externalToken[_token];
    //     userExternalStaked[msg.sender] = userExternalStaked[msg.sender].sub(_amount.mul(10**token.decimals).div(token.rate));

    //     IERC1155(_token).transfer(msg.sender, _amount);
    //     emit WithdrawnERC1155(msg.sender, _token, _amount);
    // }

    function setPenaltyWallet(address _penaltyWallet) external onlyOwner {
        require(penaltyWallet != _penaltyWallet, "TIER::ALREADY_PENALTY_WALLET");
        penaltyWallet = _penaltyWallet;

        emit ChangePenaltyWallet(_penaltyWallet);
    }

    function updateEmergencyWithdrawStatus(bool _status) external onlyOwner {
        canEmergencyWithdraw = _status;
    }

    function emergencyWithdrawERC20(address _token) external {
        require(canEmergencyWithdraw, "function disabled");
        UserInfo storage user = userInfo[msg.sender][_token];
        require(user.staked > 0, "nothing to withdraw");

        uint256 _amount = user.staked;
        user.staked = 0;

        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].sub(_amount.mul(10**token.decimals).div(token.rate));

        IERC20(_token).transfer(msg.sender, _amount);
        emit EmergencyWithdrawnERC20(msg.sender, _token, _amount);
    }

    function emergencyWithdrawERC721(address _token, uint128[] memory _tokenIds) external {
        require(canEmergencyWithdraw, "function disabled");
        UserInfo storage user = userInfo[msg.sender][_token];
        require(user.staked > 0, "nothing to withdraw");

        uint256 _amount = user.staked;
        user.staked = 0;

        ExternalToken storage token = externalToken[_token];
        userExternalStaked[msg.sender] = userExternalStaked[msg.sender].sub(_amount.mul(10**token.decimals).div(token.rate));

        if (_amount == 1) {
            IERC721(_token).safeTransferFrom(address(this), msg.sender, _tokenIds[0]);
        } else {
            _batchSafeTransferFrom(_token, address(this), msg.sender, _tokenIds);
        }
        emit EmergencyWithdrawnERC721(msg.sender, _token, _tokenIds);
    }

    // function emergencyWithdrawERC1155(address _token) external {
    //     require(canEmergencyWithdraw, "function disabled");
    //     UserInfo storage user = userInfo[msg.sender][_token];
    //     require(user.staked > 0, "nothing to withdraw");

    //     uint256 _amount = user.staked;
    //     user.staked = 0;

    //     IERC1155(_token).transfer(msg.sender, _amount);
    //     emit EmergencyWithdrawnERC1155(msg.sender, _token, _amount);
    // }

    function addExternalToken(
        address _token,
        uint256 _decimals,
        uint256 _rate,
        bool _isERC721,
        bool _isERC1155
    ) external onlyOwner {
        ExternalToken storage token = externalToken[_token];

        token.contractAddress = _token;
        token.decimals = _decimals;
        token.rate = _rate;
        token.isERC721 = _isERC721;
        token.isERC1155 = _isERC1155;

        emit AddExternalToken(_token, _decimals, _rate, _isERC721, _isERC1155);
    }

    function setExternalToken(
        address _token,
        uint256 _decimals,
        uint256 _rate
    ) external onlyOwner {
        ExternalToken storage token = externalToken[_token];

        require(token.contractAddress == _token, "TIER::TOKEN_NOT_EXISTS");

        token.decimals = _decimals;
        token.rate = _rate;

        emit ExternalTokenStatsChange(_token, _decimals, _rate);
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
        uint256 totalStaked = userInfo[_userAddress][PKF].staked.add(userExternalStaked[_userAddress]);

        for (uint8 i = 1; i <= MAX_NUM_TIERS; i++) {
            if (tierPrice[i] == 0 || totalStaked < tierPrice[i]) {
                return res;
            }

            res = i;
        }
    }

    function calculateWithdrawFee(address _userAddress, address _token, uint256 _amount)
        public
        view
        returns (uint256)
    {
        UserInfo storage user = userInfo[_userAddress][_token];
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

    function _batchSafeTransferFrom(
        address _token,
        address _from,
        address _recepient,
        uint128[] memory _tokenIds
    ) internal {
        for (uint256 i = 0; i != _tokenIds.length; i++) {
            IERC721(_token).safeTransferFrom(_from, _recepient, _tokenIds[i]);
        }
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}