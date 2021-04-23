// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./ERC721.sol";
import "../utils/Counters.sol";

contract ERC721Token is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor (
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function addNFT(
        address _to
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 newNftId = _tokenIds.current();
        _mint(_to, newNftId);

        return newNftId;
    }
}