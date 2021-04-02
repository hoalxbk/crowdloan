const { expect, util } = require('chai');
const hardhat = require('hardhat');
const { provider, utils } = hardhat.ethers;

describe('Campaign', function () {
  // Scope variable
  let poolFactory, campaign;
  let token, tradeToken;
  let accounts;
  let revenueAddress;
  // Config Address
  const feeRate = 1;
  // Campaign Factory
  // Configurations
  const name = "My Test Campaign";
  const duration = 86400;
  const openTime = (Date.now() / 1000).toFixed();
  const ethRate = 100;
  let wallet;
  //
  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    revenueAddress = accounts[0];
    wallet = accounts[1];

    // Deploy Campaign Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PoolFactory',
    );
    const deployedCampaignFactory = await upgrades.deployProxy(PoolFactory, [feeRate, revenueAddress]);
    poolFactory = deployedCampaignFactory;

    // Deploy token
    const Token = await hardhat.ethers.getContractFactory(
      'JST',
    );
    const token1 = await Token.deploy();
    await token1.deployed();
    token = token1;

    // Deploy trade token
    const token2 = await Token.deploy();
    await token2.deployed();
    tradeToken = token2;

    // Register new campaign
    await poolFactory.registerCampaign(name, token.address, duration, openTime, ethRate, 1, wallet);
    const campaignAddress = await poolFactory.allCampaigns(0);
    
    // Assign Campaign Contract
    const Campaign = await hardhat.ethers.getContractFactory('Campaign');
    campaign = await Campaign.attach(campaignAddress);

    // Transfer token to campaign
    await token.transfer(campaign.address, utils.parseEther('50000'));
  });
  
  // Ininitalize properties
  it('Should return the Owner Address', async function () {
    expect(await campaign.owner()).to.equal(accounts[0]);
  });

  // Token Address
  it('Should return token address', async function () {
    const tokenAddress = await campaign.token();
    expect(tokenAddress).to.equal(token.address);
  });

  // Factory Address
  it('Should return factory address', async function () {
    const factoryAddress = await campaign.factory();
    expect(factoryAddress).to.equal(poolFactory.address);
  });

  // fundingWallet Address
  it('Should return fundingWallet address equal wallet', async function () {
    const fundingWallet = await campaign.fundingWallet();
    expect(fundingWallet).to.equal(wallet);
  });

  // Open time
  it('Should return correct open time', async function () {
    const openTime = await campaign.openTime();
    expect(openTime).to.equal(openTime);
  });

  // Close time
  it('Should return correct close time', async function () {
    const closeTime = await campaign.closeTime();
    expect(closeTime).to.equal(parseInt(openTime) + duration);
  });

  // Test Functions

  // Get getEtherConversionRate
  it('Should return correct etherConversionRate', async function() {
    const contractConversionRate = await campaign.getEtherConversionRate();

    expect(contractConversionRate).to.equal(ethRate);
  })

  // Get getEtherConversionRateDecimals
  it('Should return correct etherConversionRateDecimals', async function() {
    const contractConversionRateDecimals = await campaign.getEtherConversionRateDecimals();

    expect(contractConversionRateDecimals).to.equal(1);
  })

  // Set ETH Rate
  it('Should set ETH Conversion rate', async function () {
    const newRate = 5;
    await campaign.setEtherConversionRate(newRate);

    const newContractRate = await campaign.getEtherConversionRate();
    expect(newContractRate).to.equal(newContractRate);
  });

  // Set ERC20 Rate
  it('Should set ERC Conversion rate', async function () {
    const tokenRate = 5;
    await campaign.setErc20TokenConversionRate(tradeToken.address, tokenRate);

    const contractTokenRate = await campaign.getErc20TokenConversionRate(tradeToken.address);
    expect(contractTokenRate).to.equal(tokenRate);
  });

  // Set ERC20 Rate Decimals
  it('Should set ERC Conversion rate decimals', async function () {
    const tokenRateDecimals = 5;
    await campaign.setEtherConversionRateDecimals(tokenRateDecimals);

    const contractTokenRateDecimals = await campaign.getEtherConversionRateDecimals();
    expect(contractTokenRateDecimals).to.equal(tokenRateDecimals);
  });

  // Set ERC20 Rate Decimals
  it('Should set ERC Conversion rate decimals FAILED', async function () {
    const tokenRateDecimals = -1;
   
    await expect(campaign.setEtherConversionRateDecimals(tokenRateDecimals)).to.be.reverted;

    const contractTokenRateDecimals = await campaign.getEtherConversionRateDecimals();
    expect(contractTokenRateDecimals).to.equal(1);
  });

  // Set ETH Link Address
  it('Should set ETH Link address', async function () {
    const ethLink = '0x5C05eEaa6A0d064F0848a7dbDE9aC59092D75775';
    await campaign.setEthLinkAddress(ethLink);

    const contractEthLink = await campaign.ethLink();
    expect(contractEthLink).to.equal(ethLink);
  });

  // Set Close time
  it('Should set Close time', async function () {
    const newCloseTime = (Date.now() / 1000 + 86400).toFixed();
    await campaign.setCloseTime(newCloseTime);

    const contractCloseTime = await campaign.closeTime();
    expect(contractCloseTime).to.equal(newCloseTime);
  });

  // Set Close time
  it('Should set Open time', async function () {
    const newOpenTime = (Date.now() / 1000 + 86400).toFixed();
    await campaign.setOpenTime(newOpenTime);

    const contractOpenTime = await campaign.openTime();
    expect(contractOpenTime).to.equal(newOpenTime);
  });

  // BUY TOKENS
  it('Should decrease balance when buy token by ethers', async function () {
    const balanceBeforeBuy = await provider.getBalance(accounts[0]);
    await campaign.buyTokenByEther(accounts[0], {
      value: utils.parseEther('5')
    });
    const balanceAfterBuy = await provider.getBalance(accounts[0]);
    expect(ethers.BigNumber.from(balanceAfterBuy).lt(ethers.BigNumber.from(balanceBeforeBuy).sub(utils.parseEther('4.9')))).to.equal(true);
  });

  it('Should receiver token when buy token by ethers', async function () {
    await campaign.buyTokenByEther(accounts[0], {
      value: utils.parseEther('5')
    });
    const tokenBalance = await token.balanceOf(accounts[0]);
    expect(ethers.BigNumber.from(tokenBalance).gte(ethers.BigNumber.from(utils.parseEther('5')).mul(ethRate))).to.equal(true);
  }); 

   // BUY TOKENS BY TOKENS
  it('Should decrease token balance when buy token by token', async function () {
    // Set ERC20 Conversion Rate
    // to enable trade by token
    await campaign.setErc20TokenConversionRate(tradeToken.address, 1);
    // Save user token balance before buy
    const balanceBeforeBuy = await tradeToken.balanceOf(accounts[0]);
    // Approve for campaign to transfer token
    await tradeToken.approve(campaign.address, utils.parseEther('1000'));
    // Buy tokens
    await campaign.buyTokenByToken(accounts[0], tradeToken.address, utils.parseEther('1'));
    // Get balance after buy
    const balanceAfterBuy = await tradeToken.balanceOf(accounts[0]);

    expect(ethers.BigNumber.from(balanceAfterBuy).lt(ethers.BigNumber.from(balanceBeforeBuy).sub(utils.parseEther('0.9')))).to.equal(true);
  });

  it('Should receiver token when buy token by tokens', async function () {
    // Set ERC20 Conversion Rate
    // to enable trade by token
    await campaign.setErc20TokenConversionRate(tradeToken.address, 1);
    // Approve for campaign to transfer token
    await tradeToken.approve(campaign.address, utils.parseEther('1000'));
    // Buy tokens
    await campaign.buyTokenByEther(accounts[0], {
      value: utils.parseEther('5')
    });
    const tokenBalance = await token.balanceOf(accounts[0]);
    expect(ethers.BigNumber.from(tokenBalance).gte(ethers.BigNumber.from(utils.parseEther('5')).mul(ethRate))).to.equal(true);
  });
});
