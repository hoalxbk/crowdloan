// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

interface ISotaTier {
  function deposit(uint _amount) external;
  function withdraw(uint _amount) external;
  function updateEmergencyWithdrawStatus(bool _status) external;
  function emergencyWithdraw() external;
  function updateTier(uint8 _tierId, uint _amount) external;
  function updateWithdrawFee(uint _key, uint _percent) external;
  function getUserTier(address _userAddress) external view returns (uint8 res);
  function calculateWithdrawFee(address _userAddress, uint _amount) external view returns (uint);
}