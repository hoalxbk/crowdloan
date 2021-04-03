// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../libraries/Ownable.sol";
import "../libraries/ReentrancyGuard.sol";
import "../token/ERC20Burnable.sol";

contract SotaTier is Ownable, ReentrancyGuard {

	using SafeMath for uint;

	struct UserInfo {
		uint staked;
		uint stakedTime;
	}

	uint constant MAX_NUM_TIERS = 10;
	uint8 currentMaxTier = 4;

	mapping(address => UserInfo) public userInfo;
	uint[MAX_NUM_TIERS] tierPrice;

	uint[] public withdrawFeePercent;
	ERC20Burnable public SOTA;

	bool public canEmergencyWithdraw;

	event Staked(address indexed user, uint amount);
	event Withdrawn(address indexed user, uint indexed amount, uint fee);
	event EmergencyWithdrawn(address indexed user, uint amount);

	constructor(address _sotaTokenAddress) public {
		SOTA = ERC20Burnable(_sotaTokenAddress);

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

	function deposit(uint _amount) external nonReentrant() {
		SOTA.transferFrom(msg.sender, address(this), _amount);

		userInfo[msg.sender].staked = userInfo[msg.sender].staked.add(_amount);
		userInfo[msg.sender].stakedTime = block.timestamp;

		emit Staked(msg.sender, _amount);
	}

	function withdraw(uint _amount) external nonReentrant() {
		UserInfo storage user = userInfo[msg.sender];
		require(user.staked >= _amount, "not enough amount to withdraw");

		uint toBurn = calculateWithdrawFee(msg.sender, _amount);
		user.staked = user.staked.sub(_amount);

		if(toBurn > 0) {
			SOTA.burn(toBurn);
		}

		SOTA.transfer(msg.sender, _amount.sub(toBurn));
		emit Withdrawn(msg.sender, _amount, toBurn);
	}

	function updateEmergencyWithdrawStatus(bool _status) external onlyOwner {
		canEmergencyWithdraw = _status;
	}

	function emergencyWithdraw() external {
		require(canEmergencyWithdraw, "function disabled");
		UserInfo storage user = userInfo[msg.sender];
		require(user.staked > 0, "nothing to withdraw");

		uint _amount = user.staked;
		user.staked = 0;

		SOTA.transfer(msg.sender, _amount);
		emit EmergencyWithdrawn(msg.sender, _amount);
	}

	function updateTier(uint8 _tierId, uint _amount) external onlyOwner {
		require(_tierId > 0 && _tierId <= MAX_NUM_TIERS, "invalid _tierId");
		tierPrice[_tierId] = _amount;
		if (_tierId > currentMaxTier) {
			currentMaxTier = _tierId;
		}
	}

	function updateWithdrawFee(uint _key, uint _percent) external onlyOwner {
		require(_percent < 100, "too high percent");
		withdrawFeePercent[_key] = _percent;
	}

	function getUserTier(address _userAddress) external view returns(uint8 res) {
		for(uint8 i = 1; i <= MAX_NUM_TIERS; i++) {
			if(tierPrice[i] == 0 || userInfo[_userAddress].staked < tierPrice[i]) {
				return res;
			}

			res = i;
		}
	}

	function calculateWithdrawFee(address _userAddress, uint _amount) public view returns(uint) {
		UserInfo storage user = userInfo[_userAddress];
		require(user.staked >= _amount, "not enough amount to withdraw");

		if(block.timestamp < user.stakedTime.add(10 days)) {
			return _amount.mul(withdrawFeePercent[0]).div(100); //30%
		}

		if(block.timestamp < user.stakedTime.add(20 days)) {
			return _amount.mul(withdrawFeePercent[1]).div(100); //25%
		}

		if(block.timestamp < user.stakedTime.add(30 days)) {
			return _amount.mul(withdrawFeePercent[2]).div(100); //20%
		}

		if(block.timestamp < user.stakedTime.add(60 days)) {
			return _amount.mul(withdrawFeePercent[3]).div(100); //10%
		}

		if(block.timestamp < user.stakedTime.add(90 days)) {
			return _amount.mul(withdrawFeePercent[4]).div(100); //5%
		}

		return _amount.mul(withdrawFeePercent[5]).div(100);
	}

	//frontend func
	function getTiers() external view returns(uint[MAX_NUM_TIERS] memory buf) {
		for(uint8 i = 1; i < MAX_NUM_TIERS; i++) {
			if(tierPrice[i] == 0) {
				return buf;
			}
			buf[i-1] = tierPrice[i];
		}

		return buf;
	}
}