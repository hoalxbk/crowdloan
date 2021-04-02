// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./ERC20.sol";

contract SotaToken is ERC20 {

    constructor () ERC20("Sota Token", "SOTA") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}