const hre = require("hardhat");

async function main() {
  const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
  // const poolFactory = await PoolFactory.deploy();
  const poolFactory = await PoolFactory.attach("0x5038ccB1E855E85027bB2731a46d7dB7B04DB713");

  // await poolFactory.deployed();

  console.log("PoolFactory deployed to:", poolFactory.address);
  console.log(
    await hre.run('verify:verify', {
      address: poolFactory.address,
      constructorArguments: [],
    })
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });