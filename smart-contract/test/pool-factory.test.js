const { expect } = require('chai');
const hardhat = require('hardhat');
const { upgrades } = hardhat;
describe('Pool Factory', function () {
  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    owner = accounts[0];
    icoOwner = accounts[1];
    USDTToken = "0x7648563Ef8FFDb8863fF7aDB5A860e3b14D28946";

    // Deploy Tier Token
    const ERC20Token = await hardhat.ethers.getContractFactory(
      'ERC20Token',
    );
    const deployedTierToken = await ERC20Token.deploy(
      "SotaToken",
      "SOTA",
      owner,
      `5${'0'.repeat(27)}`
    );
    await deployedTierToken.deployed();
    tierToken = deployedTierToken.address;

    // Deploy ICO Token
    const deployedIcoToken = await ERC20Token.deploy(
    "IcoToken",
    "ICO",
    icoOwner,
    `5${'0'.repeat(27)}`
    );
    await deployedIcoToken.deployed();
    icoToken = deployedIcoToken.address;

    // Deploy Tier Contract
    const SotaTier = await hardhat.ethers.getContractFactory(
      'PKFTiers'
    );

    const deployedTierContract = await SotaTier.deploy(tierToken, owner);
    await deployedTierContract.deployed();
    tierContract = deployedTierContract.address;

    // Deploy Pool Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PoolFactory',
    );
    const deployedPoolFactory = await upgrades.deployProxy(PoolFactory);
    poolFactory = deployedPoolFactory;
  });

  // Initialize properties
  it('Should return the Owner Address', async function () {
    expect(await poolFactory.owner()).to.equal(owner);
  });

  it('Should return false for initialize suspending status', async function () {
    expect(await poolFactory.paused()).to.equal(false);
  });

  it('Should return the Tier Address', async function () {
    expect(await poolFactory.getTier()).to.equal(tierContract);
  });

  // Test Functions

  // Pools Length
  it('Should return zero pool length', async function () {
    const poolLength = await poolFactory.allPoolsLength();
    expect(poolLength).to.equal(0);
  });

  // REGISTER POOL
  it('Should register success pool', async function () {
    const token = icoToken;
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const offeredCurrency = USDTToken;
    const offeredCurrencyRate = 2;
    const offeredCurrencyDecimals = 6;
    const wallet = accounts[1];
    await poolFactory.registerPool(token, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, wallet, wallet);

    // Get pool length
    const poolLength = await poolFactory.allPoolsLength();
    expect(poolLength).to.equal(1);

    // Get created pool
    const createdPool = await poolFactory.allPools(0);

    // Get pool
    const pool = await poolFactory.getPools(accounts[0], token, 0);

    expect(pool).to.equal(createdPool);
  });

  // Revert condition
  // TOKEN == address(0)
  it('Should REVERT register pool when token == address(0)', async function () {
    const token = '0x0000000000000000000000000000000000000000';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const offeredCurrency = USDTToken;
    const offeredCurrencyRate = 0.5;
    const offeredCurrencyDecimals = 6;
    const tierLimitBuy = [
      (10 * 10 ** 18).toString(),
      (30 * 10 ** 18).toString(),
      (20 * 10 ** 18).toString(),
      (40 * 10 ** 18).toString(),
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    const wallet = accounts[1];

    await expect(poolFactory.registerPool(token, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, tierLimitBuy, wallet, wallet)).to.be.reverted;
  });

  // DURATION == 0
  it('Should REVERT register pool when duration == 0', async function () {
    const token = icoToken;
    const duration = 0;
    const openTime = (Date.now() / 1000).toFixed();
    const offeredCurrency = USDTToken;
    const offeredCurrencyRate = 0.5;
    const offeredCurrencyDecimals = 6;
    const tierLimitBuy = [
      (10 * 10 ** 18).toString(),
      (30 * 10 ** 18).toString(),
      (20 * 10 ** 18).toString(),
      (40 * 10 ** 18).toString(),
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    const wallet = accounts[1];

    await expect(poolFactory.registerPool(token, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, tierLimitBuy, wallet, wallet)).to.be.reverted;
  });

  // WALLET == address(0)
  it('Should REVERT register pool when wallet == address(0)', async function () {
    const token = icoToken;
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const offeredCurrency = USDTToken;
    const offeredCurrencyRate = 0.5;
    const offeredCurrencyDecimals = 6;
    const tierLimitBuy = [
      (10 * 10 ** 18).toString(),
      (30 * 10 ** 18).toString(),
      (20 * 10 ** 18).toString(),
      (40 * 10 ** 18).toString(),
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    const wallet = '0x0000000000000000000000000000000000000000';

    await expect(poolFactory.registerPool(token, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, tierLimitBuy, wallet, wallet)).to.be.reverted;
  });
  // SUSPENDING STATUS

  // REGISTER CAMPAIGN
  it('Should revert register pool when paused is true', async function () {
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const offeredCurrency = USDTToken;
    const offeredCurrencyRate = 0.5;
    const offeredCurrencyDecimals = 6;
    const tierLimitBuy = [
      (10 * 10 ** 18).toString(),
      (30 * 10 ** 18).toString(),
      (20 * 10 ** 18).toString(),
      (40 * 10 ** 18).toString(),
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    const wallet = accounts[1];

    // set suspending to true
    await poolFactory.pause();

    await expect(
      poolFactory.registerPool(
        token,
        duration,
        openTime,
        offeredCurrency,
        offeredCurrencyRate,
        offeredCurrencyDecimals,
        tierLimitBuy,
        wallet,
        wallet,
      ),
    ).to.be.reverted;
  });
});
