// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.1;

interface IPool {
    function initialize(string memory _name, address _token, uint256 _duration, uint256 _openTime, uint256 _ethRate, uint256 _ethRateDecimals, uint256[10] memory _tierLimitBuy, address _walletAddress) external;
}