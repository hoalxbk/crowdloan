# RedKite smart contract
Smart constracts for RedKite platform

## Deploy Factory smart contract

Project currently use hardhat for deployment. The variable should import from process.env or similar datasource:

## Plugins

RedKite is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.
Plugin should import from hardhat.config.js

| Plugin | npm |
| ------ | ------ |
| hardhat-waffle |  https://www.npmjs.com/package/@nomiclabs/hardhat-waffle|
| hardhat-ethers | https://www.npmjs.com/package/@nomiclabs/hardhat-ethers|
| hardhat-etherscan | https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan |
| hardhat-upgrades | https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades |


## Deploy RedKite Factory contract
1. Import hardhat library, embed ethers, upgrades modules
```javascript
const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;
```
2. Configure your revenue address, fee rate before deploy
```javascript
  const revenueAddress = process.env.RENEVUE_ADDRESS || '0xba535ade958703Ffb99B9325ca8db04A00937029';
  const feeRate = process.env.PLATFORM_FEE_RATE || 1;
```
3. Get contract factory prototype
```javascript
  const PoolFactory = await ethers.getContractFactory(
    'PoolFactory',
  );
```
5. Log the address and wait for deploy success
```javascript
  // Log the address
  console.log('poolFactory deployed at', poolFactory.address);
  // Wait for pool factory deploy success
  await poolFactory.deployed();
```
6.  Full example code blocks - don't reuse immediately
```javascript
const main = async () => {
  // Config for platform
  const revenueAddress = process.env.RENEVUE_ADDRESS || '0xba535ade958703Ffb99B9325ca8db04A00937029';
  const feeRate = process.env.PLATFORM_FEE_RATE || 1;
  // Get contract factory
  const PoolFactory = await ethers.getContractFactory(
    'PoolFactory',
  );
  // Deploy contract proxy
  const poolFactory = await upgrades.deployProxy(PoolFactory, [feeRate, revenueAddress]);
  // Log the address
  console.log('poolFactory deployed at', poolFactory.address);
  // Wait for pool factory deploy success
  await poolFactory.deployed();
};
```

## Script / Config

RedKite is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.
Plugin should import from hardhat.config.js

| Scripts | github |
| ------ | ------ |
| Deploy Factory |  ./scripts/deploy-pool-factory.script.js|
| Upgrade Factory | ./scripts/upgrade-pool-factory.script.js|
| Config file | .//hardhat.config.js|


## Components

- IPool is an interface for Pool smart contract.

- IPoolFactory is an interface for PoolFactory smart contract.

- IEthLink is an interface for interactions with ETHLink smart contract.

- IERC20 is an interface for interactions with ERC20 tokens.

- Ownable is a standard OpenZeppelin contract for access control with an owner role.

- ReentrancyGuard is a standard OpenZeppelin contract that prevents reentrancy calls.

- SafeMath is a standard OpenZeppelin library for math operations that prevents integer
overflows.

- PoolFactory is a smart contract for creating pools and managing fee
parameters. PoolFactory is Ownable and has following parameters and structs:

    - int256 public platformFeeRate;

    - address public platformRevenueAddress;

    - address[] public allPools;

    - mapping(address => mapping(address => address[_])) public getPools;
- PoolFactory contract has following functions:

    - constructor - public functions that sets  platformFeeRate and
    platformRevenueAddress

    - getPlatformFeeRate - public view function that returns platform fee rate

    - getplatformRevenueAddress - public view function that returns platform revenue
    address

    - allPoolsLength - public view function that returns total pools count

    - getCreatedPoolsByToken - public view function that returns pools for
    token and creator

    - getCreatedPoolsLengthByToken - public view function that returns
    pool total amount for token and creator

    - setPlatformFeeRate - external function for setting new platform fee rate. Has
    onlyOwner modifier

    - setPlatformRevenueAddress - external function for setting a new revenue
    address. Has onlyOwner modifier

    - registerPool - external function for new pool registering

- Pool is a smart contract for pool management. Pool is Ownable, ReentrancyGuard and has following parameters and structs:

    - IERC20 public token;

    - address public factory;

    - address public fundingWallet;

    - IEthLink public ethLink;

    - uint256 public openTime = now;

    - uint256 public closeTime;

    - uint256 public weiRaised = O;

    - uint256 public tokenSold = 0;

    - string public name;

    - uint256 private etherConversionRate;

    - mapping(address => uint256) private erc2O0TokenConversionRate;

- Pool contract has following functions and modifiers:

    - tokenRateSetted - modifier that checks whether token conversion rate is set

    - constructor - public functions that sets deployer as pool factory

    - fallback - external function that always reverts

    - receive - external payable function that calls buyTokenByEther

    - initialize - external function that initializes contract variables

    - getEtherConversionRate - public view function that returns ether conversion rate

    - getErc20TokenConversionRate - public view function that returns ERC20 tokenconversion rate

    - setEtherConversionRate - public function that sets new ether conversion rate. Has onlyOwner modifier

    - setErc20TokenConversionRate - public function that sets a new ERC20 token conversion rate. Has onlyOwner modifier

    - setEthLinkAddress - public function that sets a new ETHLink address

    - setCloseTime - public function that sets anew close time. Has onlyOwner modifier

    - setOpenTime - public function that sets a new open time. Has onlyOwner modifier

    - buyTokenByEther - public payable function that performs token purchase by ether. Has nonReentrant modifier

    - buyTokenByToken - public function that performs token purchase by ERC20 token. Has nonReentrant modifier

    - buyTokenByEtherWithEthLink - public function that performs token purchase by ether using ETHLink. Has nonReentrant modifier

    - buyTokenByTokenWithEthLink - public function that performs token purchase by ERC20 token using ETHLink. Has nonReentrant modifier

    - isFinalized - public view function that returns true if ICO ended

    - refundTokenForIcoOwner - external function that returns unsold tokens to specified address. Has onlyOwner modifier

    - _preValidatePurchase - internal pure function that validates parameters for token purchase
    - _getEtherToTokenAmount - internal view function that returns amount of tokens that can be purchased with specified amount of ether
    - _getEtherToTokenAmount - internal view function that returns amount of tokens that can be purchased with specified amount of ERC20 token
    - _processPurchase - internal function that calls _deliverTokens function
    - _deliverTokens - internal function that performs ICO token transfer
    - _forwardFunds - internal function that sends ether to funding wallet
    - _forwardTokenFunds - internal function that sends ERC20 token to funding wallet
    - _validPurchase - internal view function that returns true if started and not ended
    - _payPlatformEtherFee - private function that transfer platform fee in ether to fee wallet
    - _payPlatformTokenFee - private function that transfer platform fee in ERC20 token to fee wallet
    - _getPlatformFeeRate - private view function that returns platform fee rate
    - _getPlatformRevenueAddress - private view function that returns platform revenue wallet
    - _processAffiliatePurchase - internal function that performs purchase by ether if it was done via ETHLink affiliate
    - _processTokenAffiliatePurchase - internal function that performs purchase by ERC20 token if it was done via ETHLink affiliate
    - _transfer - private function that transfers ether
    - _transferT oken - private function that transfers ERC20 token
## License
MIT