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
  let owner, penaltyWallet, wallet, PKF, MantraPKF, nftPKF, uniPkfLP, sPKF, tier;
  beforeEach(async () => {
    // Get accounts
    accounts = await hardhat.ethers.provider.listAccounts();
    owner = accounts[0];
    penaltyWallet = owner;
    wallet = accounts[1];
    address0 = "0x0000000000000000000000000000000000000000";


    const ERC20TokenFactory = await hardhat.ethers.getContractFactory('ERC20Token');
    PKF = await ERC20TokenFactory.deploy("PolkaFoundry", "PKF", owner, `5${'0'.repeat(27)}`);
    MantraPKF = await ERC20TokenFactory.deploy("MantraDao PKF", "mPKF", owner, `5${'0'.repeat(27)}`);
    nftPKF = await ERC20TokenFactory.deploy("NFT PKF", "nPKF", owner, `5${'0'.repeat(27)}`);
    uniPkfLP = await ERC20TokenFactory.deploy("Uniswap PKF", "uPKF", owner, `5${'0'.repeat(27)}`);
    sPKF = await ERC20TokenFactory.deploy("sPKF", "sPKF", owner, `5${'0'.repeat(27)}`);

    // Deploy Tier Contract
    const RedKiteTier = await hardhat.ethers.getContractFactory(
      'RedKiteTier',
    );
    tier = await RedKiteTier.deploy(PKF.address, penaltyWallet);
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
});