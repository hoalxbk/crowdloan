const {
  expect,
  util
} = require('chai');
const hardhat = require('hardhat');
const {
  provider,
  utils
} = hardhat.ethers;

describe('Tier', function () {
  let owner, penaltyWallet, wallet, PKF, uniLP, sPKF, tier;
  let oneMillion = "1000000000000000000000000";
  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    owner = accounts[0];
    penaltyWallet = owner;
    wallet = accounts[1];
    address0 = "0x0000000000000000000000000000000000000000";


    const ERC20TokenFactory = await hardhat.ethers.getContractFactory('ERC20Token');
    PKF = await ERC20TokenFactory.deploy("PolkaFoundry", "PKF", owner, oneMillion);
    uniLP = await ERC20TokenFactory.deploy("Uniswap V2", "UNI-V2", owner, oneMillion);
    sPKF = await ERC20TokenFactory.deploy("Staked PKF", "sPKF", owner, oneMillion);

    // Deploy Tier Contract
    const RedKiteTiers = await hardhat.ethers.getContractFactory(
      'RedKiteTiers',
    );
    tier = await RedKiteTiers.deploy(PKF.address, sPKF.address, uniLP.address, penaltyWallet);
    await tier.deployed();
  });

  // Initialize properties
  it('Should return the Owner Address', async function () {
    expect(await tier.owner()).to.equal(accounts[0]);
  });

  // Penalty address
  it('Should return the Penalty Address', async function () {
    expect(await tier.penaltyWallet()).to.equal(penaltyWallet);
  });

  // Change Penalty address
  it('Change the Penalty Address to address 0', async function () {
    await tier.setPenaltyWallet(address0);
    expect(await tier.penaltyWallet()).to.equal(address0);
  });

  it('Should REVERT tier when no change with penaltyWallet', async function () {
    expect(tier.setPenaltyWallet(penaltyWallet)).to.be.reverted;
  });

  // Deposit
  it('Deposit PKF', async function () {
    const depositAmount = (100 * 10 ** 18).toString();
    await PKF.approve(tier.address, depositAmount);
    await tier.depositERC20(PKF.address, depositAmount);
    const userInfo = await tier.userInfo(owner, PKF.address);
    expect(userInfo.staked).to.equal(depositAmount);
    expect(await tier.userExternalStaked(owner)).to.equal(0);
    expect(await tier.userTotalStaked(owner)).to.equal(depositAmount);
  });

  it('Deposit sPKF with rate 1 sPKF = 1 PKF', async function () {
    const depositAmount = (100 * 10 ** 18).toString();
    await sPKF.approve(tier.address, depositAmount);
    await tier.depositERC20(sPKF.address, depositAmount);
    const userInfo = await tier.userInfo(owner, sPKF.address);
    expect(userInfo.staked).to.equal(depositAmount);
    expect(await tier.userExternalStaked(owner)).to.equal(depositAmount);
    expect(await tier.userTotalStaked(owner)).to.equal(depositAmount);
  });

  it('Deposit uniLP with rate 1 uniLP = 150 PKF', async function () {
    const depositAmount = (100 * 10 ** 18).toString();
    await uniLP.approve(tier.address, depositAmount);
    await tier.depositERC20(uniLP.address, depositAmount);
    const userInfo = await tier.userInfo(owner, uniLP.address);
    expect(userInfo.staked).to.equal(depositAmount);
    expect(await tier.userExternalStaked(owner)).to.equal("15000000000000000000000");
    expect(await tier.userTotalStaked(owner)).to.equal("15000000000000000000000");
  });
});