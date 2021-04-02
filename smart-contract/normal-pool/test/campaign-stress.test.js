const { expect, util } = require('chai');
const hardhat = require('hardhat');
const { provider, utils } = hardhat.ethers;

describe('Campaign Stress Test', function () {
  // Scope variable
  let poolFactory, campaign;
  let token, tradeToken;
  let accounts;
  let revenueAddress;
  // Config Address
  const feeRate = 1;
  // Campaign Factory
  // Configurations
  const name = 'My Test Campaign';
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
    const deployedCampaignFactory = await upgrades.deployProxy(
      PoolFactory,
      [feeRate, revenueAddress],
    );
    poolFactory = deployedCampaignFactory;

    // Deploy token
    const Token = await hardhat.ethers.getContractFactory('JST');
    const token1 = await Token.deploy();
    await token1.deployed();
    token = token1;

    // Deploy trade token
    const token2 = await Token.deploy();
    await token2.deployed();
    tradeToken = token2;

    // Register new campaign
    await poolFactory.registerCampaign(
      name,
      token.address,
      duration,
      openTime,
      ethRate,
      1,
      wallet,
    );
    const campaignAddress = await poolFactory.allCampaigns(0);

    // Assign Campaign Contract
    const Campaign = await hardhat.ethers.getContractFactory('Campaign');
    campaign = await Campaign.attach(campaignAddress);

    // Transfer token to campaign
    await token.transfer(campaign.address, utils.parseEther('50000'));
  });

  // Ininitalize properties
  it('can handle 2 buyer at same time', async function () {
    await testBuyTokenWithParticipants(2, accounts);
  });

  it('can handle 20 buyer at same time', async function () {
    await testBuyTokenWithParticipants(20, accounts);
  });

  it('can handle 50 buyer at same time', async function () {
    await testBuyTokenWithParticipants(50, accounts);
  });

  it('can handle 100 buyer at same time', async function () {
    await testBuyTokenWithParticipants(100, accounts);
  });
});

const testBuyTokenWithParticipants = async (participants, accounts) => {
  // Config the campaign detail
  // Campaign Configurations
  const name = 'My Test Campaign';
  const duration = 86400;
  const openTime = (Date.now() / 1000).toFixed();
  const ethRate = 100;
  const ethRateDecimals = 1;
  // Get campaign factory
  const poolFactory = await deployCampaignFactory(accounts[0]);
  // Deploy Campaign
  const tokenContract = await deployTokenContract();
  await poolFactory.registerCampaign(
    name,
    tokenContract.address,
    duration,
    openTime,
    ethRate,
    ethRateDecimals,
    accounts[0],
  );
  // Get the campaign address
  const campaignAddress = await poolFactory.allCampaigns(0);
  // Assign Campaign Contract by address
  const Campaign = await hardhat.ethers.getContractFactory('Campaign');
  const campaign = await Campaign.attach(campaignAddress);
  // Send token to contract
  await tokenContract.transfer(campaign.address, utils.parseUnits('1000000', 18))
  // Stress testing
  const promises = [];

  for (let i = 0; i < participants; i++) {
    // For local environtments, limited at 20 accounts
    // Loop from accounts[0] if index out of account list
    const accountIndex = i >= 20 ? i % 20 : i;
    // Get the account
    const account = accounts[accountIndex];
    // Get provider of accounts
    const signer = provider.getSigner(accountIndex);
    const contractSinger = campaign.connect(signer);
    // Create Campaign with registerCampaign
    promises.push(contractSinger.buyTokenByEther(account, {
      value: utils.parseEther('0.1')
    }))
  }

  await Promise.all(promises);
};

const deployTokenContract = async () => {
  // Deploy token
  const Token = await hardhat.ethers.getContractFactory('JST');
  const token = await Token.deploy();
  await token.deployed();
  return token;
};

const deployCampaignFactory = async (wallet) => {
  // Deploy Campaign Factory
  const PoolFactory = await hardhat.ethers.getContractFactory(
    'PoolFactory',
  );
  const deployedCampaignFactory = await upgrades.deployProxy(PoolFactory, [
    1,
    wallet,
  ]);
  return deployedCampaignFactory;
};
