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
  beforeEach(async () => {
    accounts = await provider.listAccounts();
    owner = accounts[0];
    penaltyWallet = owner;
    address0 = "0x0000000000000000000000000000000000000000";

    const ERC20TokenFactory = await hardhat.ethers.getContractFactory('ERC20Token');
    PKF = await ERC20TokenFactory.deploy("PolkaFoundry", "PKF", 18, owner, utils.parseUnits("1000000", 18));
    uniLP = await ERC20TokenFactory.deploy("Uniswap V2", "UNI-V2", 18, owner, utils.parseUnits("1000000", 18));
    sPKF = await ERC20TokenFactory.deploy("Staked PKF", "sPKF", 18, owner, utils.parseUnits("1000000", 18));

    const ERC721TokenFactory = await hardhat.ethers.getContractFactory('ERC721Token');
    NFT = await ERC721TokenFactory.deploy("NFT", "NFT");

    // Deploy Tier Contract
    const RedKiteTiers = await hardhat.ethers.getContractFactory(
      'RedKiteTiers',
    );
    tier = await RedKiteTiers.deploy(PKF.address, sPKF.address, uniLP.address, penaltyWallet);
    await tier.deployed();

    // Add NFT
    const rate = utils.parseUnits("1000", 18);
    await tier.addExternalToken(NFT.address, 0, rate, true, true);
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
  it('Deposit / withdraw PKF with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await PKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await PKF.transfer(user2.address, utils.parseUnits("50000", 18));

    const depositAmount = utils.parseUnits("20000", 18);

    await PKF.connect(user1).approve(tier.address, depositAmount);
    await PKF.connect(user2).approve(tier.address, depositAmount);

    await tier.connect(user1).depositERC20(PKF.address, depositAmount);
    await tier.connect(user2).depositERC20(PKF.address, depositAmount);

    const user1Info = await tier.userInfo(user1.address, PKF.address);
    const user2Info = await tier.userInfo(user2.address, PKF.address);

    expect(user1Info.staked).to.equal(depositAmount);
    expect(user2Info.staked).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user1.address)).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(depositAmount);

    await tier.connect(user1).withdrawERC20(PKF.address, depositAmount);
    await tier.connect(user2).withdrawERC20(PKF.address, depositAmount);

    expect((await tier.userInfo(user1.address, PKF.address)).staked).to.equal(0);
    expect((await tier.userInfo(user2.address, PKF.address)).staked).to.equal(0);
    expect(await tier.userTotalStaked(user1.address)).to.equal(0);
    expect(await tier.userTotalStaked(user2.address)).to.equal(0);
  });

  it('Deposit / withdraw sPKF (1 sPKF = 1.02 PKF) with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await sPKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await sPKF.transfer(user2.address, utils.parseUnits("50000", 18));

    const depositAmount = utils.parseUnits("20000", 18);
    const stakedAmount = utils.parseUnits((20000 * 1.02).toString(), 18);

    await sPKF.connect(user1).approve(tier.address, depositAmount);
    await sPKF.connect(user2).approve(tier.address, depositAmount);
    await tier.connect(owner).setExternalToken(sPKF.address, "2", "102", true);

    await tier.connect(user1).depositERC20(sPKF.address, depositAmount);
    await tier.connect(user2).depositERC20(sPKF.address, depositAmount);

    const user1Info = await tier.userInfo(user1.address, sPKF.address);
    const user2Info = await tier.userInfo(user1.address, sPKF.address);

    expect(user1Info.staked).to.equal(depositAmount);
    expect(user2Info.staked).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user1.address)).to.equal(stakedAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(stakedAmount);

    await tier.connect(user1).withdrawERC20(sPKF.address, depositAmount);
    await tier.connect(user2).withdrawERC20(sPKF.address, depositAmount);

    expect((await tier.userInfo(user1.address, sPKF.address)).staked).to.equal(0);
    expect((await tier.userInfo(user2.address, sPKF.address)).staked).to.equal(0);
    expect(await tier.userTotalStaked(user1.address)).to.equal(0);
    expect(await tier.userTotalStaked(user2.address)).to.equal(0);
  });

  it('Deposit / withdraw with withdraw < deposit sPKF by multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await sPKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await sPKF.transfer(user2.address, utils.parseUnits("50000", 18));

    const depositAmount = utils.parseUnits("10000", 18);
    const stakedAmount = utils.parseUnits((10000 * 1.02).toString(), 18);
    const withdrawAmount = utils.parseUnits("6500", 18);
    const remainingAmount = utils.parseUnits("3500", 18);
    const remainingStakedAmount = utils.parseUnits((3500 * 1.02).toString(), 18);

    await sPKF.connect(user1).approve(tier.address, depositAmount);
    await sPKF.connect(user2).approve(tier.address, depositAmount);
    await tier.connect(owner).setExternalToken(sPKF.address, "2", "102", true);

    await tier.connect(user1).depositERC20(sPKF.address, depositAmount);
    await tier.connect(user2).depositERC20(sPKF.address, depositAmount);

    const user1Info = await tier.userInfo(user1.address, sPKF.address);
    const user2Info = await tier.userInfo(user1.address, sPKF.address);

    expect(user1Info.staked).to.equal(depositAmount);
    expect(user2Info.staked).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user1.address)).to.equal(stakedAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(stakedAmount);

    await tier.connect(user1).withdrawERC20(sPKF.address, withdrawAmount);
    await tier.connect(user2).withdrawERC20(sPKF.address, withdrawAmount);

    expect((await tier.userInfo(user1.address, sPKF.address)).staked).to.equal(remainingAmount);
    expect((await tier.userInfo(user2.address, sPKF.address)).staked).to.equal(remainingAmount);
    expect(await tier.userTotalStaked(user1.address)).to.equal(remainingStakedAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(remainingStakedAmount);
  });

  it('Deposit / withdraw with withdraw < deposit sPKF with multiple deposits', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await PKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await sPKF.transfer(user1.address, utils.parseUnits("50000", 18));

    await PKF.connect(user1).approve(tier.address, utils.parseUnits("50000", 18));
    await sPKF.connect(user1).approve(tier.address, utils.parseUnits("50000", 18));

    await tier.connect(owner).setExternalToken(sPKF.address, "0", "1", true);
    await tier.connect(user1).depositERC20(sPKF.address, utils.parseUnits("5000", 18));
    await tier.connect(user1).withdrawERC20(sPKF.address, utils.parseUnits("1000", 18));

    await tier.connect(owner).setExternalToken(sPKF.address, "2", "102", true);
    await tier.connect(user1).depositERC20(PKF.address, utils.parseUnits("10400", 18));
    await tier.connect(user1).depositERC20(sPKF.address, utils.parseUnits("5800", 18));

    const user1sPKFInfo = await tier.userInfo(user1.address, sPKF.address);
    const user1PKFInfo = await tier.userInfo(user1.address, PKF.address);

    expect(user1sPKFInfo.staked).to.equal(utils.parseUnits("9800", 18));
    expect(user1PKFInfo.staked).to.equal(utils.parseUnits("10400", 18));
    expect(await tier.userExternalStaked(user1.address)).to.equal(utils.parseUnits("9916", 18));
    expect(await tier.userTotalStaked(user1.address)).to.equal(utils.parseUnits("20316", 18));

    await tier.connect(owner).setExternalToken(sPKF.address, "0", "1", true);
    await tier.connect(user1).withdrawERC20(sPKF.address, utils.parseUnits("9800", 18)); // 9996 vs 9916

    expect((await tier.userInfo(user1.address, sPKF.address)).staked).to.equal(0);
    expect(await tier.userTotalStaked(user1.address)).to.equal(utils.parseUnits("10516", 18));
    await tier.connect(user1).withdrawERC20(PKF.address, utils.parseUnits("10400", 18));
  });

  it('Revert when withdraw > deposit sPKF with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await sPKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await sPKF.transfer(user2.address, utils.parseUnits("50000", 18));

    const depositAmount = utils.parseUnits("10000", 18);
    const stakedAmount = utils.parseUnits((10000 * 1.02).toString(), 18);
    const withdrawAmount = utils.parseUnits("10001", 18);

    await sPKF.connect(user1).approve(tier.address, depositAmount);
    await sPKF.connect(user2).approve(tier.address, depositAmount);
    await tier.connect(owner).setExternalToken(sPKF.address, "2", "102", true);

    await tier.connect(user1).depositERC20(sPKF.address, depositAmount);
    await tier.connect(user2).depositERC20(sPKF.address, depositAmount);

    const user1Info = await tier.userInfo(user1.address, sPKF.address);
    const user2Info = await tier.userInfo(user1.address, sPKF.address);

    expect(user1Info.staked).to.equal(depositAmount);
    expect(user2Info.staked).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user1.address)).to.equal(stakedAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(stakedAmount);

    await expect(tier.connect(user1).withdrawERC20(sPKF.address, withdrawAmount)).to.be.reverted;
    await expect(tier.connect(user2).withdrawERC20(sPKF.address, withdrawAmount)).to.be.reverted;
  });

  it('Deposit / withdraw ERC721 with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await NFT.addNFT(user1.address); // Token id 1
    await NFT.addNFT(user1.address); // Token id 2
    await NFT.addNFT(user2.address); // Token id 3
    await NFT.addNFT(user2.address); // Token id 4

    await NFT.connect(user1).approve(tier.address, 1);
    await NFT.connect(user2).approve(tier.address, 3);
    await NFT.connect(user2).approve(tier.address, 4);

    const user1DepositAmount = utils.parseUnits((1 * 1000).toString(), 18);
    const user2DepositAmount = utils.parseUnits((2 * 1000).toString(), 18);

    await tier.connect(user1).depositSingleERC721(NFT.address, 1);
    await tier.connect(user2).depositBatchERC721(NFT.address, [3, 4]);

    const user1Info = await tier.userInfo(user1.address, NFT.address);
    const user2Info = await tier.userInfo(user2.address, NFT.address);

    expect(user1Info.staked).to.equal(1);
    expect(user2Info.staked).to.equal(2);
    expect(await tier.userTotalStaked(user1.address)).to.equal(user1DepositAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(user2DepositAmount);

    await tier.connect(user1).withdrawSingleERC721(NFT.address, 1);
    await tier.connect(user2).withdrawBatchERC721(NFT.address, [3, 4]);

    expect((await tier.userInfo(user1.address, NFT.address)).staked).to.equal(0);
    expect((await tier.userInfo(user2.address, NFT.address)).staked).to.equal(0);
    expect(await tier.userTotalStaked(user1.address)).to.equal(0);
    expect(await tier.userTotalStaked(user2.address)).to.equal(0);
  });

  it('Deposit / withdraw with withdraw < deposit ERC721 by multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await NFT.addNFT(user1.address); // Token id 1
    await NFT.addNFT(user1.address); // Token id 2
    await NFT.addNFT(user2.address); // Token id 3
    await NFT.addNFT(user2.address); // Token id 4

    await NFT.connect(user1).approve(tier.address, 1);
    await NFT.connect(user1).approve(tier.address, 2);
    await NFT.connect(user2).approve(tier.address, 3);
    await NFT.connect(user2).approve(tier.address, 4);

    const depositAmount = utils.parseUnits((2 * 1000).toString(), 18);
    const remainingAmount = utils.parseUnits((1 * 1000).toString(), 18);

    await tier.connect(user1).depositBatchERC721(NFT.address, [1, 2]);
    await tier.connect(user2).depositBatchERC721(NFT.address, [3, 4]);

    const user1Info = await tier.userInfo(user1.address, NFT.address);
    const user2Info = await tier.userInfo(user1.address, NFT.address);

    expect(user1Info.staked).to.equal(2);
    expect(user2Info.staked).to.equal(2);
    expect(await tier.userTotalStaked(user1.address)).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(depositAmount);

    await tier.connect(user1).withdrawBatchERC721(NFT.address, [1]);
    await tier.connect(user2).withdrawBatchERC721(NFT.address, [3]);

    expect((await tier.userInfo(user1.address, NFT.address)).staked).to.equal(1);
    expect((await tier.userInfo(user2.address, NFT.address)).staked).to.equal(1);
    expect(await tier.userTotalStaked(user1.address)).to.equal(remainingAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(remainingAmount);
  });

  it('Deposit / withdraw with withdraw < deposit ERC721 with multiple deposits', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await NFT.addNFT(user1.address); // Token id 1
    await NFT.addNFT(user1.address); // Token id 2
    await NFT.addNFT(user1.address); // Token id 3
    await NFT.addNFT(user1.address); // Token id 4

    await NFT.connect(user1).approve(tier.address, 1);
    await NFT.connect(user1).approve(tier.address, 2);
    await NFT.connect(user1).approve(tier.address, 3);
    await NFT.connect(user1).approve(tier.address, 4);

    const depositAmount = utils.parseUnits((4 * 1000).toString(), 18);

    await tier.connect(user1).depositBatchERC721(NFT.address, [1, 2, 3, 4]);

    const user1Info = await tier.userInfo(user1.address, NFT.address);

    expect(user1Info.staked).to.equal(4);
    expect(await tier.userTotalStaked(user1.address)).to.equal(depositAmount);

    await tier.connect(user1).withdrawBatchERC721(NFT.address, [1, 2, 3, 4]);

    expect((await tier.userInfo(user1.address, NFT.address)).staked).to.equal(0);
    expect(await tier.userTotalStaked(user1.address)).to.equal(0);
  });

  it('Revert when withdraw > deposit ERC721 with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await NFT.addNFT(user1.address); // Token id 1
    await NFT.addNFT(user1.address); // Token id 2
    await NFT.addNFT(user2.address); // Token id 3
    await NFT.addNFT(user2.address); // Token id 4

    await NFT.connect(user1).approve(tier.address, 1);
    await NFT.connect(user2).approve(tier.address, 3);

    const depositAmount = utils.parseUnits((1 * 1000).toString(), 18);

    await tier.connect(user1).depositBatchERC721(NFT.address, [1]);
    await tier.connect(user2).depositBatchERC721(NFT.address, [3]);

    const user1Info = await tier.userInfo(user1.address, NFT.address);
    const user2Info = await tier.userInfo(user1.address, NFT.address);

    expect(user1Info.staked).to.equal(1);
    expect(user2Info.staked).to.equal(1);
    expect(await tier.userTotalStaked(user1.address)).to.equal(depositAmount);
    expect(await tier.userTotalStaked(user2.address)).to.equal(depositAmount);

    await expect(tier.connect(user1).withdrawBatchERC721(NFT.address, [1, 2])).to.be.reverted;
    await expect(tier.connect(user2).withdrawBatchERC721(NFT.address, [3, 4])).to.be.reverted;
  });

  // Emergency Withdraw
  it('Emergency withdraw PKF with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await PKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await PKF.transfer(user2.address, utils.parseUnits("50000", 18));

    const depositAmount = utils.parseUnits("20000", 18);

    await PKF.connect(user1).approve(tier.address, depositAmount);
    await PKF.connect(user2).approve(tier.address, depositAmount);

    await tier.connect(user1).depositERC20(PKF.address, depositAmount);
    await tier.connect(user2).depositERC20(PKF.address, depositAmount);

    await tier.connect(owner).updateEmergencyWithdrawStatus(true);
    expect(await tier.canEmergencyWithdraw()).to.equal(true);

    await tier.connect(user1).emergencyWithdrawERC20(PKF.address);
    await tier.connect(user2).emergencyWithdrawERC20(PKF.address);

    const user1Info = await tier.userInfo(user1.address, PKF.address);
    const user2Info = await tier.userInfo(user1.address, PKF.address);

    expect(user1Info.staked).to.equal(0);
    expect(user2Info.staked).to.equal(0);
  });

  it('Emergency withdraw sPKF with multiple accounts', async function () {
    const [owner, user1, user2] = await hardhat.ethers.getSigners();

    await sPKF.transfer(user1.address, utils.parseUnits("50000", 18));
    await sPKF.transfer(user2.address, utils.parseUnits("50000", 18));

    const depositAmount = utils.parseUnits("20000", 18);

    await sPKF.connect(user1).approve(tier.address, depositAmount);
    await sPKF.connect(user2).approve(tier.address, depositAmount);

    await tier.connect(user1).depositERC20(sPKF.address, depositAmount);
    await tier.connect(user2).depositERC20(sPKF.address, depositAmount);

    await tier.connect(owner).updateEmergencyWithdrawStatus(true);
    expect(await tier.canEmergencyWithdraw()).to.equal(true);

    await tier.connect(user1).emergencyWithdrawERC20(sPKF.address);
    await tier.connect(user2).emergencyWithdrawERC20(sPKF.address);

    const user1Info = await tier.userInfo(user1.address, sPKF.address);
    const user2Info = await tier.userInfo(user2.address, sPKF.address);

    expect(user1Info.staked).to.equal(0);
    expect(user2Info.staked).to.equal(0);
    expect(await tier.userTotalStaked(user1.address)).to.equal(0);
    expect(await tier.userTotalStaked(user2.address)).to.equal(0);
  });

  it('Revert nothing to Emergency withdraw', async function () {
    const [owner, user1] = await hardhat.ethers.getSigners();

    await tier.connect(owner).updateEmergencyWithdrawStatus(true);
    expect(await tier.canEmergencyWithdraw()).to.equal(true);

    await expect(tier.connect(user1).emergencyWithdrawERC20(PKF.address, utils.parseUnits("1", 18))).to.be.reverted;
  });
});