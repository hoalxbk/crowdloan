const { expect } = require('chai');
const hardhat = require('hardhat');
const { upgrades } = hardhat;
describe('Campaign Factory', function () {
  // Scope variable
  let poolFactory, accounts;
  let revenueAddress;
  // Config Address
  const feeRate = 1;

  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    revenueAddress = accounts[0]
    // Deploy Campaign Factory
    const PoolFactory = await hardhat.ethers.getContractFactory(
      'PoolFactory',
    );
    const deployedCampaignFactory = await upgrades.deployProxy(PoolFactory, [feeRate, revenueAddress]);
    poolFactory = deployedCampaignFactory;
  });
  
  // Ininitalize properties
  it('Should return the Owner Address', async function () {
    expect(await poolFactory.owner()).to.equal(accounts[0]);
  });

  it('Should return false for innitialize suspending status', async function () {
    expect(await poolFactory.paused()).to.equal(false);
  });

  it('Should return 0 for innitialize revenue address', async function () {
    expect(await poolFactory.platformRevenueAddress()).to.equal(
      revenueAddress,
    );
  });

  // Test Functions

  // Fee Rate
  it('Should return platform fee rate', async function () {
    const bigNumberFeeRate = await poolFactory.getPlatformFeeRate();
    const currentFeeRate = parseInt(bigNumberFeeRate);
    expect(currentFeeRate).to.equal(feeRate);
  });

  // Revenue Address
  it('Should return platform revenue address', async function () {
    const revenueAddress = await poolFactory.getplatformRevenueAddress();
    expect(revenueAddress).to.equal(revenueAddress);
  });

  // Campaigns Length
  it('Should return zero campaign length', async function () {
    const campaignLength = await poolFactory.allCampaignsLength();
    expect(campaignLength).to.equal(0);
  });

  // Set new fee rate
  it('Should return new fee rate', async function () {
    const newFee = 2;
    // Set new Fee rate
    await poolFactory.setPlatformFeeRate(newFee);
    // Query Contract Fee rate
    const bigNumberFeeRate = await poolFactory.getPlatformFeeRate();
    const currentFeeRate = parseInt(bigNumberFeeRate);
    // Expected
    expect(currentFeeRate).to.equal(newFee);
  });

  // Set new INVALID fee rate
  it('Should throw error on invalid fee rate', async function () {
    const newFee = 200;
    // Set new Fee rate. Will reverted
    await expect(poolFactory.setPlatformFeeRate(newFee)).to.be.revertedWith("ICOFactory::OVERFLOW_FEE");
  });

  // Set new revenue address
  it('Should return new revenue address', async function () {
    const newAddress = accounts[1];
    // Set new Fee rate
    await poolFactory.setPlatformRevenueAddress(newAddress);
    // Query Contract Fee rate
    const contractRevenueAddress = await poolFactory.getplatformRevenueAddress();
    // Expected
    expect(contractRevenueAddress).to.equal(newAddress);
  });

  // Set new INVALID revenue address
  it('Should revert new revenue address', async function () {
    const newAddress = '0x0000000000000000000000000000000000000000';
    // Set new Fee rate
    await expect(poolFactory.setPlatformRevenueAddress(newAddress)).to.be.revertedWith("ICOFactory::ZERO_ADDRESS");
  });
  
  // Set isSuspending
  it('Should change isSuspending status', async function () {
    
    await poolFactory.pause();
    const pause = await poolFactory.paused();

    expect(pause).to.equal(true);
  });

  // Set INVALID isSuspending
  it('Should revert isSuspending status', async function () {
    await expect(poolFactory.unpause()).to.be.reverted;
  });

  // REGISTER CAMPAIGN
  it('Should register success campaign', async function () {
    const name = "My Campaign";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
    const wallet = accounts[1];
    await poolFactory.registerCampaign(name, token, duration, openTime, ethRate, ethRateDecimals, wallet);
    
    // Get campaign length
    const campaignLength = await poolFactory.allCampaignsLength();
    expect(campaignLength).to.equal(1);

    // Get created campaign
    const createdCampaign = await poolFactory.allCampaigns(0);

    // Get campaign
    const campaign = await poolFactory.getCampaigns(accounts[0], token, 0);

    expect(campaign).to.equal(createdCampaign);
  });

  //Revert condition
  // TOKEN == address(0)
  it('Should REVERT register campaign when token == address(0)', async function () {
    const name = "My Campaign";
    const token = '0x0000000000000000000000000000000000000000';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
    const wallet = accounts[1];

    await expect(poolFactory.registerCampaign(name, token, duration, openTime, ethRate, ethRateDecimals, wallet)).to.be.reverted;
  });
  
  // DURATION == 0
  it('Should REVERT register campaign when duration == 0', async function () {
    const name = "My Campaign";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 0;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
    const wallet = accounts[1];

    await expect(poolFactory.registerCampaign(name, token, duration, openTime, ethRate, ethRateDecimals, wallet)).to.be.reverted;
  });
  
  // WALLET == address(0)
  it('Should REVERT register campaign when wallet == address(0)', async function () {
    const name = "My Campaign";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
    const wallet = '0x0000000000000000000000000000000000000000';

    await expect(poolFactory.registerCampaign(name, token, duration, openTime, ethRate, ethRateDecimals, wallet)).to.be.reverted;
  });
  // SUSPENDING STATUS

  // REGISTER CAMPAIGN
  it('Should revert register campaign when paused is true', async function () {
    const name = "My Campaign";
    const token = '0xafbb6330d6fd9e11234cbedfbcc6cc9971135703';
    const duration = 86400;
    const openTime = (Date.now() / 1000).toFixed();
    const ethRate = 100;
    const ethRateDecimals = 1;
    const wallet = accounts[1];

    // set suspending to true
    await poolFactory.pause();

    await expect(
      poolFactory.registerCampaign(
        name,
        token,
        duration,
        openTime,
        ethRate,
        ethRateDecimals,
        wallet,
      ),
    ).to.be.reverted;
  });
});
