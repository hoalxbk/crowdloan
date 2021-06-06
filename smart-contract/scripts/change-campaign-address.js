const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

const main = async () => {
  // Pre-config
  // Get contract factory
  const Pool = await ethers.getContractFactory(
    'PreSalePool',
  );
  const poolAddress = "presale-pool-address";
  const token = "new-token-address";

  if (!token) {
    throw new Error("Token invalid");
  }

  const presalePool = Pool.attach(poolAddress);

  await presalePool.changeSaleToken(token);
};

main();