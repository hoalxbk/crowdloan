// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./ERC1155.sol";
import "../../libraries/SafeMath.sol";

contract ERC1155Token is ERC1155 {
    using SafeMath for uint256;

    mapping (uint256 => uint256) public tokenSupply;

    constructor(string memory uri_) ERC1155(uri_) {}

    /**
     * @dev Mints some amount of tokens to an address
     * @param _to          Address of the future owner of the token
     * @param _id          Token ID to mint
     * @param _quantity    Amount of tokens to mint
     * @param _data        Data to pass if receiver is contract
     */
    function mint(
        address _to,
        uint256 _id,
        uint256 _quantity,
        bytes memory _data
    ) public {
        _mint(_to, _id, _quantity, _data);
        tokenSupply[_id] = tokenSupply[_id].add(_quantity);
    }
}
