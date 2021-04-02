// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

import "../interfaces/IPool.sol";
import "./Pool.sol";
import "../libraries/Ownable.sol";
import "../libraries/Pausable.sol";
import "../libraries/Initializable.sol";

contract PoolFactory is Ownable, Pausable, Initializable {
    // Array of created Pools Address
    address[] public allPools;
    // Mapping from User token. From tokens to array of created Pools for token
    mapping(address => mapping(address => address[])) public getPools;

    event PoolCreated(address registedBy, address indexed token, address indexed pool, uint256 poolId);

    function initialize() initializer external {
        paused = false;
        owner = msg.sender;
    }

    /**
    * @notice Get the number of all created pools
    * @return Return number of created pools
    */
    function allPoolsLength() public view returns (uint256) {
        return allPools.length;
    }

    /**
    * @notice Get the created pools by token address
    * @dev User can retrieve their created pool by address of tokens
    * @param _creator Address of created pool user
    * @param _token Address of token want to query
    * @return Created Pool Address
    */
    function getCreatedPoolsByToken(address _creator, address _token) public view returns(address[] memory) {
      return getPools[_creator][_token];
    }

    /**
    * @notice Retrieve number of pools created for specific token
    * @param _creator Address of created pool user
    * @param _token Address of token want to query
    * @return Return number of created pool
    */
    function getCreatedPoolsLengthByToken(address _creator, address _token) public view returns(uint) {
      return getPools[_creator][_token].length;
    }

    /**
    * @notice Register ICO Pool for tokens
    * @dev To register, you MUST have an ERC20 token
    * @param _name String name of new pool
    * @param _token address of ERC20 token
    * @param _duration Number of ICO time in seconds
    * @param _openTime Number of start ICO time in seconds
    * @param _ethRate Conversion rate for buy token. tokens = value * rate
    * @param _wallet Address of funding ICO wallets. Sold tokens in eth will transfer to this address
    */
    function registerPool(
        string memory _name,
        address _token,
        uint256 _duration,
        uint256 _openTime,
        uint256 _ethRate,
        uint256 _ethRateDecimals,
        address _wallet
    ) external whenNotPaused returns (address pool) {
        require(_token != address(0), "ICOFactory::ZERO_ADDRESS");
        require(_duration != 0, "ICOFactory::ZERO_DURATION");
        require(_wallet != address(0), "ICOFactory::ZERO_ADDRESS");
        require(_ethRate != 0, "ICOFactory::ZERO_ETH_RATE");
        bytes memory bytecode = type(Pool).creationCode;
        uint256 tokenIndex = getCreatedPoolsLengthByToken(msg.sender, _token);
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _token, tokenIndex));
        assembly {
            pool := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IPool(pool).initialize(_name, _token, _duration, _openTime, _ethRate, _ethRateDecimals, _wallet);
        getPools[msg.sender][_token].push(pool);
        allPools.push(pool);

        emit PoolCreated(msg.sender, _token, pool, allPools.length - 1);
    }
}
