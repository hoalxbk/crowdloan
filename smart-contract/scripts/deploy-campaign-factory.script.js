const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

const main = async () => {
  // Pre-config
  const SotaToken = "0xf0F39d2D5D12B04cdf98Dc13FB074f969a22871c";

  const SotaTier = await hre.ethers.getContractFactory("SotaTier");
  const sotaTier = await SotaTier.deploy(SotaToken);

  await sotaTier.deployed();

  console.log("SotaTier deployed to:", sotaTier.address);

  // Get contract factory
  const PoolFactory = await ethers.getContractFactory(
    'PoolFactory',
  );
  // Deploy contract proxy
  const poolFactory = await upgrades.deployProxy(PoolFactory, [sotaTier.address]);
  // Log the address
  console.log('poolFactory deployed at', poolFactory.address);
  // Wait for Pool factory deploy success
  await poolFactory.deployed();
};

main();