const { expect, util } = require('chai');
const hardhat = require('hardhat');
const { provider, utils } = hardhat.ethers;

describe('Pool', function () {
  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    owner = accounts[0];
	wallet = accounts[1];
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
    owner,
    `5${'0'.repeat(27)}`
    );
    await deployedIcoToken.deployed();
    icoToken = deployedIcoToken;

    // Deploy Tier Contract
    const SotaTier = await hardhat.ethers.getContractFactory(
      'SotaTier',
    );
    const deployedTierContract = await SotaTier.deploy(tierToken);
    await deployedTierContract.deployed();
    tierContract = deployedTierContract.address;

    // Deploy Pool Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PoolFactory',
    );
    const deployedPoolFactory = await upgrades.deployProxy(PoolFactory, [tierContract]);
    poolFactory = deployedPoolFactory;

	duration = 86400;
	openTime = (Date.now() / 1000).toFixed();
	offeredCurrency = USDTToken;
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
    await poolFactory.registerPool(icoToken.address, duration, openTime, offeredCurrency, offeredCurrencyRate, offeredCurrencyDecimals, tierLimitBuy, wallet);

    const poolAddress = await poolFactory.allPools(0);

	const Pool = await hardhat.ethers.getContractFactory(
		'Pool',
	  );
	pool = await Pool.attach(poolAddress);

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

  // Get getEtherConversionRate
  it('Should return correct etherConversionRate', async function() {
    const contractConversionRate = await pool.getEtherConversionRate();

    expect(contractConversionRate).to.equal(ethRate);
  })

  // Get getEtherConversionRateDecimals
  it('Should return correct etherConversionRateDecimals', async function() {
    const contractConversionRateDecimals = await pool.getEtherConversionRateDecimals();

    expect(contractConversionRateDecimals).to.equal(1);
  })

  // Set ETH Rate
  it('Should set ETH Conversion rate', async function () {
    const newRate = 5;
    await pool.setEtherConversionRate(newRate);

    const newContractRate = await pool.getEtherConversionRate();
    expect(newContractRate).to.equal(newContractRate);
  });

  // Set ERC20 Rate
  it('Should set ERC Conversion rate', async function () {
    const tokenRate = 5;
    await pool.setErc20TokenConversionRate(tradeToken.address, tokenRate);

    const contractTokenRate = await pool.getErc20TokenConversionRate(tradeToken.address);
    expect(contractTokenRate).to.equal(tokenRate);
  });

  // Set ERC20 Rate Decimals
  it('Should set ERC Conversion rate decimals', async function () {
    const tokenRateDecimals = 5;
    await pool.setEtherConversionRateDecimals(tokenRateDecimals);

    const contractTokenRateDecimals = await pool.getEtherConversionRateDecimals();
    expect(contractTokenRateDecimals).to.equal(tokenRateDecimals);
  });

  // Set ERC20 Rate Decimals
  it('Should set ERC Conversion rate decimals FAILED', async function () {
    const tokenRateDecimals = -1;

    await expect(pool.setEtherConversionRateDecimals(tokenRateDecimals)).to.be.reverted;

    const contractTokenRateDecimals = await pool.getEtherConversionRateDecimals();
    expect(contractTokenRateDecimals).to.equal(1);
  });

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

  // BUY TOKENS
  it('Should decrease balance when buy token by ethers', async function () {
    const balanceBeforeBuy = await provider.getBalance(accounts[0]);
    await pool.buyTokenByEtherWithPermission(accounts[0], {
      value: utils.parseEther('5')
    });
    const balanceAfterBuy = await provider.getBalance(accounts[0]);
    expect(ethers.BigNumber.from(balanceAfterBuy).lt(ethers.BigNumber.from(balanceBeforeBuy).sub(utils.parseEther('4.9')))).to.equal(true);
  });

  it('Should receiver token when buy token by ethers', async function () {
    await pool.buyTokenByEther(accounts[0], {
      value: utils.parseEther('5')
    });
    const tokenBalance = await token.balanceOf(accounts[0]);
    expect(ethers.BigNumber.from(tokenBalance).gte(ethers.BigNumber.from(utils.parseEther('5')).mul(ethRate))).to.equal(true);
  });

   // BUY TOKENS BY TOKENS
  it('Should decrease token balance when buy token by token', async function () {
    // Set ERC20 Conversion Rate
    // to enable trade by token
    await pool.setErc20TokenConversionRate(tradeToken.address, 1);
    // Save user token balance before buy
    const balanceBeforeBuy = await tradeToken.balanceOf(accounts[0]);
    // Approve for pool to transfer token
    await tradeToken.approve(pool.address, utils.parseEther('1000'));
    // Buy tokens
    await pool.buyTokenByToken(accounts[0], tradeToken.address, utils.parseEther('1'));
    // Get balance after buy
    const balanceAfterBuy = await tradeToken.balanceOf(accounts[0]);

    expect(ethers.BigNumber.from(balanceAfterBuy).lt(ethers.BigNumber.from(balanceBeforeBuy).sub(utils.parseEther('0.9')))).to.equal(true);
  });

  it('Should receiver token when buy token by tokens', async function () {
    // Set ERC20 Conversion Rate
    // to enable trade by token
    await pool.setErc20TokenConversionRate(tradeToken.address, 1);
    // Approve for pool to transfer token
    await tradeToken.approve(pool.address, utils.parseEther('1000'));
    // Buy tokens
    await pool.buyTokenByEther(accounts[0], {
      value: utils.parseEther('5')
    });
    const tokenBalance = await token.balanceOf(accounts[0]);
    expect(ethers.BigNumber.from(tokenBalance).gte(ethers.BigNumber.from(utils.parseEther('5')).mul(ethRate))).to.equal(true);
  });
});
