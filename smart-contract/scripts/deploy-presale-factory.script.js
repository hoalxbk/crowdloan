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
  const presaleFactory = await upgrades.deployProxy(PreSaleFactory, [], {initializer: 'initialize'});
  // Log the address
  console.log('presaleFactory deployed at', presaleFactory.address);
  console.log('Presale Owner', await presaleFactory.owner());
  // Wait for Pool factory deploy success
  await presaleFactory.deployed();
};

main();