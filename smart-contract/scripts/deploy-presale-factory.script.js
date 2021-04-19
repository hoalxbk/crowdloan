const hardhat = require('hardhat');
const {
  ethers,
  upgrades
} = hardhat;

const main = async () => {
  // Pre-config

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