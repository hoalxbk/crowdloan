const { expect } = require('chai');
const hardhat = require('hardhat');
const { upgrades } = hardhat;
describe('Pool Factory', function () {
  // Scope variable
  let erc20, tierContract, poolFactory, accounts;

  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    owner = accounts[0];
    // Deploy ERC20
    const ERC20Token = await hardhat.ethers.getContractFactory(
      'ERC20Token',
    );
    const deployedERC20 = await ERC20Token.deploy(
      "SotaToken",
      "SOTA",
      18,
      owner,
      `5${'0'.repeat(27)}`
    );
    await deployedERC20.deployed();
    erc20 = deployedERC20;
    // Deploy Tier Contract
    const SotaTier = await hardhat.ethers.getContractFactory(
      'SotaTier',
    );
    const deployedTierContract = await SotaTier.deploy(erc20.address);
    await deployedTierContract.deployed();
    tierContract = deployedTierContract;
    // Deploy Pool Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PoolFactory',
    );
    const deployedPoolFactory = await upgrades.deployProxy(PoolFactory, [tierContract.address]);
    poolFactory = deployedPoolFactory;
  });

  // Initialize properties
  it('Should return the Owner Address', async function () {
    expect(await poolFactory.owner()).to.equal(accounts[0]);
  });

  it('Should return false for initialize suspending status', async function () {
    expect(await poolFactory.paused()).to.equal(false);
  });

  it('Should return the Tier Address', async function () {
    expect(await poolFactory.getTier()).to.equal(tierContract.address);
  });

  // Test Functions

  // Pools Length
  it('Should return zero pool length', async function () {
    const poolLength = await poolFactory.allPoolsLength();
    expect(poolLength).to.equal(0);
  });

  // REGISTER POOL
  it('Should register success pool', async function () {
    const name = "My Pool";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
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
    await poolFactory.registerPool(name, token, duration, openTime, ethRate, ethRateDecimals, tierLimitBuy, wallet);

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
    const name = "My Pool";
    const token = '0x0000000000000000000000000000000000000000';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
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

    await expect(poolFactory.registerPool(name, token, duration, openTime, ethRate, ethRateDecimals, tierLimitBuy, wallet)).to.be.reverted;
  });

  // DURATION == 0
  it('Should REVERT register pool when duration == 0', async function () {
    const name = "My Pool";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 0;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
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

    await expect(poolFactory.registerPool(name, token, duration, openTime, ethRate, ethRateDecimals, tierLimitBuy, wallet)).to.be.reverted;
  });

  // WALLET == address(0)
  it('Should REVERT register pool when wallet == address(0)', async function () {
    const name = "My Pool";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
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

    await expect(poolFactory.registerPool(name, token, duration, openTime, ethRate, ethRateDecimals, tierLimitBuy, wallet)).to.be.reverted;
  });
  // SUSPENDING STATUS

  // REGISTER CAMPAIGN
  it('Should revert register pool when paused is true', async function () {
    const name = "My Pool";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
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
        name,
        token,
        duration,
        openTime,
        ethRate,
        ethRateDecimals,
        tierLimitBuy,
        wallet,
      ),
    ).to.be.reverted;
  });
});
