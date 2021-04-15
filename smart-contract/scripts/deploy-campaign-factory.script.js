const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

const main = async () => {
  // Pre-config
  // Get contract factory
  const PoolFactory = await ethers.getContractFactory(
    'PoolFactory',
  );
  // Deploy contract proxy
  const poolFactory = await upgrades.deployProxy(PoolFactory, []);
  // Log the address
  console.log('poolFactory deployed at', poolFactory.address);
  // Wait for Pool factory deploy success
  await poolFactory.deployed();
};

main();