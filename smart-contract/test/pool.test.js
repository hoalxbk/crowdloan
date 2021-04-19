const {
  expect,
  util
} = require('chai');
const hardhat = require('hardhat');
const {
  provider,
  utils
} = hardhat.ethers;

describe('Pool', function () {
  let USDTToken, USDCToken, pool;
  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    owner = accounts[0];
    wallet = accounts[1];

    const StableTokenFactory = await hardhat.ethers.getContractFactory('StableToken');
    USDTToken = await StableTokenFactory.deploy("Tether", "USDT", 6);
    USDCToken = await StableTokenFactory.deploy("USD Coin", "USDC", 6);

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

    // await deployedTierToken.deployed();
    // tierToken = deployedTierToken.address;

    // // Deploy ICO Token
    const deployedIcoToken = await ERC20Token.deploy(
      "IcoToken",
      "ICO",
      owner,
      `5${'0'.repeat(27)}`
    );
    await deployedIcoToken.deployed();
    icoToken = deployedIcoToken;

    // // Deploy Tier Contract
    // const SotaTier = await hardhat.ethers.getContractFactory(
    //   'PKFTiers'
    // );
    // const deployedTierContract = await SotaTier.deploy(tierToken, owner);
    // await deployedTierContract.deployed();
    // tierContract = deployedTierContract.address;

    // Deploy Pool Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PoolFactory',
    );
    const deployedPoolFactory = await upgrades.deployProxy(PoolFactory, []);
    poolFactory = deployedPoolFactory;

    duration = 86400;
    openTime = (Date.now() / 1000).toFixed();
    offeredCurrency = USDTToken.address;
    offeredCurrencyRate = 2;
    offeredCurrencyDecimals = 6;
    tierLimitBuy = [
      (10 * 10 ** 18).toString(), // 10
      (30 * 10 ** 18).toString(), // 20
      (20 * 10 ** 18).toString(), // 30
      (40 * 10 ** 18).toString(), // 40
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    // Register new pool
    await poolFactory.registerPool(icoToken.address, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, wallet, wallet);

    const poolAddress = await poolFactory.allPools(0);

    const Pool = await hardhat.ethers.getContractFactory(
      'Pool',
    );
    pool = Pool.attach(poolAddress);

    // Transfer token to pool
    await icoToken.transfer(poolAddress, utils.parseEther('100'));
  });

  // Initialize properties
  it('Should return the Owner Address', async function () {
    expect(await pool.owner()).to.equal(accounts[0]);
  });

  // Token Address
  it('Should return token address', async function () {
    const tokenAddress = await pool.token();
    expect(tokenAddress).to.equal(icoToken.address);
  });

  // Factory Address
  it('Should return factory address', async function () {
    const factoryAddress = await pool.factory();
    expect(factoryAddress).to.equal(poolFactory.address);
  });

  // fundingWallet Address
  it('Should return fundingWallet address equal wallet', async function () {
    const fundingWallet = await pool.fundingWallet();
    expect(fundingWallet).to.equal(wallet);
  });

  // Open time
  it('Should return correct open time', async function () {
    const openTime = await pool.openTime();
    expect(openTime).to.equal(openTime);
  });

  // Close time
  it('Should return correct close time', async function () {
    const closeTime = await pool.closeTime();
    expect(closeTime).to.equal(parseInt(openTime) + duration);
  });

  // Test Functions

  // Set Close time
  it('Should set Close time', async function () {
    const newCloseTime = (Date.now() / 1000 + 86400).toFixed();
    await pool.setCloseTime(newCloseTime);

    const contractCloseTime = await pool.closeTime();
    expect(contractCloseTime).to.equal(newCloseTime);
  });

  // Set Close time
  it('Should set Open time', async function () {
    const newOpenTime = (Date.now() / 1000 + 86400).toFixed();
    await pool.setOpenTime(newOpenTime);

    const contractOpenTime = await pool.openTime();
    expect(contractOpenTime).to.equal(newOpenTime);
  });

  // Get getEtherConversionRate
  // 0x0000000000000000000000000000000000000000
  it('Should return correct etherConversionRate', async function () {
    const address0 = "0x0000000000000000000000000000000000000000";
    await pool.setOfferedCurrencyRateAndDecimals(address0, 100, 1);

    const contractConversionRate = await pool.getOfferedCurrencyRate(address0);
    const contractConversionDecimal = await pool.getOfferedCurrencyDecimals(address0);

    expect(contractConversionRate).to.equal(100);
    expect(contractConversionDecimal).to.equal(1);
  })

  // Set token conversion rate
  // 0x0000000000000000000000000000000000000000
  it('Should return correct USDT token conversion rate', async function () {
    await pool.setOfferedCurrencyRateAndDecimals(USDTToken.address, 100, 1);

    const contractConversionRate = await pool.getOfferedCurrencyRate(USDTToken.address);
    const contractConversionDecimal = await pool.getOfferedCurrencyDecimals(USDTToken.address);

    expect(contractConversionRate).to.equal(100);
    expect(contractConversionDecimal).to.equal(1);
  })

  it('Should return correct USDC token conversion rate', async function () {
    await pool.setOfferedCurrencyRateAndDecimals(USDCToken.address, 100, 1);

    const contractConversionRate = await pool.getOfferedCurrencyRate(USDCToken.address);
    const contractConversionDecimal = await pool.getOfferedCurrencyDecimals(USDCToken.address);

    expect(contractConversionRate).to.equal(100);
    expect(contractConversionDecimal).to.equal(1);
  })

  it('Should return correct USDC & USDT token conversion rate', async function () {
    await pool.setOfferedCurrencyRateAndDecimals(USDCToken.address, 200, 1);
    await pool.setOfferedCurrencyRateAndDecimals(USDTToken.address, 500, 2);

    const contractConversionRate = await pool.getOfferedCurrencyRate(USDCToken.address);
    const contractConversionDecimal = await pool.getOfferedCurrencyDecimals(USDCToken.address);

    const contractConversionRate2 = await pool.getOfferedCurrencyRate(USDTToken.address);
    const contractConversionDecimal2 = await pool.getOfferedCurrencyDecimals(USDTToken.address);

    expect(contractConversionRate).to.equal(200);
    expect(contractConversionDecimal).to.equal(1);

    expect(contractConversionRate2).to.equal(500);
    expect(contractConversionDecimal2).to.equal(2);
  })

  // Get getEtherConversionRateDecimals
  it('Should return correct etherConversionRateDecimals', async function () {
    const address0 = "0x0000000000000000000000000000000000000000";
    await pool.setOfferedCurrencyDecimals(address0, 8);

    const contractConversionDecimal = await pool.getOfferedCurrencyDecimals(address0);
    expect(contractConversionDecimal).to.equal(8);
  })

  // Should return correct factory
  it('Should return correct factory address', async function () {
    const factoryAddress = await pool.factory();

    expect(factoryAddress).to.equal(poolFactory.address);
  });


});