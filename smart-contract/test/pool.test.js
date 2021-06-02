const {
  expect,
  util
} = require('chai');
const {
  time
} = require('@openzeppelin/test-helpers');
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

    const ERC20Token = await hardhat.ethers.getContractFactory(
      'ERC20Token',
    );

    // Deploy IDO Token
    const deployedIdoToken = await ERC20Token.deploy(
      "IdoToken",
      "IDO",
      18,
      owner,
      `5${'0'.repeat(27)}`
    );
    await deployedIdoToken.deployed();
    idoToken = deployedIdoToken;

    // Deploy Pool Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PreSaleFactory',
    );
    const deployedPoolFactory = await upgrades.deployProxy(PoolFactory, []);
    poolFactory = deployedPoolFactory;

    duration = 86400;
    openTime = (Date.now() / 1000).toFixed();
    offeredCurrency = USDTToken.address;
    offeredCurrencyRate = 2;
    offeredCurrencyDecimals = 6;
    // Register new pool
    await poolFactory.registerPool(idoToken.address, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, owner, owner);

    const poolAddress = await poolFactory.allPools(0);

    const Pool = await hardhat.ethers.getContractFactory(
      'PreSalePool',
    );
    pool = Pool.attach(poolAddress);

    // Transfer token to pool
    await idoToken.transfer(poolAddress, utils.parseEther('1000000'));
  });

  // Initialize properties
  it('Should return the Owner Address', async function () {
    expect(await pool.owner()).to.equal(accounts[0]);
  });

  // Token Address
  it('Should return token address', async function () {
    const tokenAddress = await pool.token();
    expect(tokenAddress).to.equal(idoToken.address);
  });

  // Factory Address
  it('Should return factory address', async function () {
    const factoryAddress = await pool.factory();
    expect(factoryAddress).to.equal(poolFactory.address);
  });

  // fundingWallet Address
  it('Should return fundingWallet address equal wallet', async function () {
    const fundingWallet = await pool.fundingWallet();
    expect(fundingWallet).to.equal(owner);
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

  // Should claim correctly
  it('Buy by ETH and Claim correct value for Claim functions', async function () {
    const address0 = "0x0000000000000000000000000000000000000000";
    const tokenBalance = await idoToken.balanceOf(owner);

    await pool.setOfferedCurrencyRateAndDecimals(address0, 10000, 0);

    const maxAmount = utils.parseEther("10000000", 18);
    const signature = await getBuySignature(owner, maxAmount);

    const buyAmount = utils.parseEther("1", 18);
    await pool.buyTokenByEtherWithPermission(owner, owner, maxAmount, 0, signature, {
      value: buyAmount
    });

    let block = await getCurrentBlock();
    let blockTimestamp = await getBlockTimestamp(block)
    await pool.setCloseTime(Math.floor(blockTimestamp + 10));
    await time.advanceBlockTo(await getCurrentBlock() + 10);

    const claimAmount200 = utils.parseUnits("200", 18);
    const claimAmount400 = utils.parseUnits("400", 18);
    const claimAmount600 = utils.parseUnits("600", 18);
    const claimAmount800 = utils.parseUnits("800", 18);
    const claimAmount1000 = utils.parseUnits("1000", 18);
    const claimAmount10000 = utils.parseUnits("10000", 18);
    const claimAmount100000 = utils.parseUnits("100000", 18);

    const claimSignature200 = await getClaimSignature(owner, claimAmount200);
    const claimSignature400 = await getClaimSignature(owner, claimAmount400);
    const claimSignature600 = await getClaimSignature(owner, claimAmount600);
    const claimSignature800 = await getClaimSignature(owner, claimAmount800);
    const claimSignature1000 = await getClaimSignature(owner, claimAmount1000);
    const claimSignature10000 = await getClaimSignature(owner, claimAmount10000);
    const claimSignature100000 = await getClaimSignature(owner, claimAmount100000);

    await pool.claimTokens(owner, claimAmount200, claimSignature200);
    let newTokenBalance = await idoToken.balanceOf(owner);
    let different = utils.formatEther(newTokenBalance.sub(tokenBalance));

    expect(parseInt(different)).to.equal(200);

    await pool.claimTokens(owner, claimAmount200, claimSignature200);
    await pool.claimTokens(owner, claimAmount200, claimSignature200);

    expect(await idoToken.balanceOf(owner)).to.be.equal(newTokenBalance);

    await pool.claimTokens(owner, claimAmount400, claimSignature400);
    await pool.claimTokens(owner, claimAmount400, claimSignature400);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("400", 18));

    await expect(pool.claimTokens(owner, claimAmount200, claimSignature200)).to.be.reverted;

    await pool.claimTokens(owner, claimAmount600, claimSignature600);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("600", 18));

    await pool.claimTokens(owner, claimAmount800, claimSignature800);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("800", 18));

    await pool.claimTokens(owner, claimAmount1000, claimSignature1000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("1000", 18));

    await pool.claimTokens(owner, claimAmount10000, claimSignature10000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("10000", 18));
  });

  it('Buy by Token and Claim correct value for Claim functions', async function () {
    const tokenBalance = await idoToken.balanceOf(owner);

    await pool.setOfferedCurrencyRateAndDecimals(USDCToken.address, utils.parseUnits("20", 18), 6);
    await pool.setOfferedCurrencyRateAndDecimals(USDTToken.address, utils.parseUnits("5", 18), 6);

    const maxAmount = utils.parseEther("10000000", 18);
    const signature = await getBuySignature(owner, maxAmount);

    await USDCToken.approve(pool.address, utils.parseUnits("999999999", 6));
    await USDTToken.approve(pool.address, utils.parseUnits("999999999", 6));

    const buyAmount = utils.parseUnits("10000", 6);
    // 200,000
    await pool.buyTokenByTokenWithPermission(owner, USDCToken.address, buyAmount, owner, maxAmount, 0, signature);
    // 50,000
    await pool.buyTokenByTokenWithPermission(owner, USDTToken.address, buyAmount, owner, maxAmount, 0, signature);

    let block = await getCurrentBlock();
    let blockTimestamp = await getBlockTimestamp(block)
    await pool.setCloseTime(Math.floor(blockTimestamp + 10));
    await time.advanceBlockTo(await getCurrentBlock() + 10);

    const claimAmount200 = utils.parseUnits("200", 18);
    const claimAmount400 = utils.parseUnits("400", 18);
    const claimAmount600 = utils.parseUnits("600", 18);
    const claimAmount800 = utils.parseUnits("800", 18);
    const claimAmount1000 = utils.parseUnits("1000", 18);
    const claimAmount10000 = utils.parseUnits("10000", 18);
    const claimAmount50000 = utils.parseUnits("50000", 18);
    const claimAmount100000 = utils.parseUnits("100000", 18);
    const claimAmount250000 = utils.parseUnits("250000", 18);

    const claimSignature200 = await getClaimSignature(owner, claimAmount200);
    const claimSignature400 = await getClaimSignature(owner, claimAmount400);
    const claimSignature600 = await getClaimSignature(owner, claimAmount600);
    const claimSignature800 = await getClaimSignature(owner, claimAmount800);
    const claimSignature1000 = await getClaimSignature(owner, claimAmount1000);
    const claimSignature10000 = await getClaimSignature(owner, claimAmount10000);
    const claimSignature50000 = await getClaimSignature(owner, claimAmount50000);
    const claimSignature100000 = await getClaimSignature(owner, claimAmount100000);
    const claimSignature250000 = await getClaimSignature(owner, claimAmount250000);

    await pool.claimTokens(owner, claimAmount200, claimSignature200);
    let newTokenBalance = await idoToken.balanceOf(owner);
    let different = utils.formatEther(newTokenBalance.sub(tokenBalance));

    expect(parseInt(different)).to.equal(200);

    await pool.claimTokens(owner, claimAmount200, claimSignature200);
    await pool.claimTokens(owner, claimAmount200, claimSignature200);

    expect(await idoToken.balanceOf(owner)).to.be.equal(newTokenBalance);

    await pool.claimTokens(owner, claimAmount400, claimSignature400);
    await pool.claimTokens(owner, claimAmount400, claimSignature400);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("400", 18));

    await expect(pool.claimTokens(owner, claimAmount200, claimSignature200)).to.be.reverted;

    await pool.claimTokens(owner, claimAmount600, claimSignature600);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("600", 18));

    await pool.claimTokens(owner, claimAmount800, claimSignature800);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("800", 18));

    await pool.claimTokens(owner, claimAmount1000, claimSignature1000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("1000", 18));

    await pool.claimTokens(owner, claimAmount10000, claimSignature10000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("10000", 18));

    await pool.claimTokens(owner, claimAmount50000, claimSignature50000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("50000", 18));

    await pool.claimTokens(owner, claimAmount100000, claimSignature100000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("100000", 18));

    await pool.claimTokens(owner, claimAmount250000, claimSignature250000);

    expect((await getTokenBalanceOf(owner)).sub(tokenBalance)).to.be.equal(utils.parseUnits("250000", 18));
  });

  // Should refund remain token correctly
  it('Refund remaining token', async function () {
    const tokenBalance = await idoToken.balanceOf(owner);

    await pool.setOfferedCurrencyRateAndDecimals(USDCToken.address, utils.parseUnits("20", 18), 6);

    const maxAmount = utils.parseEther("800000", 18);
    const signature = await getBuySignature(owner, maxAmount);

    await USDCToken.approve(pool.address, utils.parseUnits("999999999", 6));

    const buyAmount = utils.parseUnits("40000", 6);
    // 800,000
    await pool.buyTokenByTokenWithPermission(owner, USDCToken.address, buyAmount, owner, maxAmount, 0, signature);

    let block = await getCurrentBlock();
    let blockTimestamp = await getBlockTimestamp(block)
    await pool.setCloseTime(Math.floor(blockTimestamp + 10));
    await time.advanceBlockTo(await getCurrentBlock() + 10);

    const claimAmount800000 = utils.parseUnits("800000", 18);
    const claimSignature8000000 = await getClaimSignature(owner, claimAmount800000);

    await pool.claimTokens(owner, claimAmount800000, claimSignature8000000);

    await pool.refundRemainingTokens(owner);

    let newTokenBalance = await idoToken.balanceOf(owner);
    let different = utils.formatEther(newTokenBalance.sub(tokenBalance));

    expect(parseInt(different)).to.equal(1000000);
  })


  async function getBuySignature(address, maxAmount) {
    // call to contract with parameters
    const hash = await pool.getMessageHash(address, maxAmount, 0);
    // Sign this message hash with private key and account address
    const signature = await web3.eth.sign(hash, address);
    return signature;
  }

  async function getClaimSignature(address, amount) {
    // call to contract with parameters
    const hash = await pool.getClaimMessageHash(address, amount);
    // Sign this message hash with private key and account address
    const signature = await web3.eth.sign(hash, address);
    return signature;
  }

  async function getCurrentBlock() {
    return await ethers.provider.getBlockNumber();
  }

  async function getBlockTimestamp(number) {
    let block = await ethers.provider.getBlock(number);
    return block.timestamp;
  }

  async function getTokenBalanceOf(address) {
    return await idoToken.balanceOf(address);
  }
});