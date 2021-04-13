const hardhat = require('hardhat');
const {
  ethers,
  upgrades
} = hardhat;

const main = async () => {
  // Pre-config
  const SotaToken = "0xf0F39d2D5D12B04cdf98Dc13FB074f969a22871c";

  const SotaTier = await hre.ethers.getContractFactory("PKFTiers");
  const sotaTier = await SotaTier.deploy(SotaToken, '0xd1C7BD89165f4c82e95720574e327fa2248F9cf2');

  await sotaTier.deployed();

  console.log("SotaTier deployed to:", sotaTier.address);

  // Get contract factory
  const PreSaleFactory = await ethers.getContractFactory(
    'PreSaleFactory',
  );
  // Deploy contract proxy
  const presaleFactory = await upgrades.deployProxy(PreSaleFactory, []);
  // Log the address
  console.log('presaleFactory deployed at', presaleFactory.address);
  // Wait for Pool factory deploy success
  await presaleFactory.deployed();
};

main();