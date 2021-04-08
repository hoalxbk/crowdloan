// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.1;

interface IPool {
    function initialize(address _token, uint256 _duration, uint256 _openTime, address _offeredCurrency, uint256 _offeredCurrencyDecimals, uint256 _offeredRate, uint256[10] memory _tierLimitBuy, address _walletAddress) external;
}