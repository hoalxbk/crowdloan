const hre = require("hardhat");

async function main() {
  const SotaToken = "0xf0F39d2D5D12B04cdf98Dc13FB074f969a22871c";

  const SotaTier = await hre.ethers.getContractFactory("SotaTiers");
  const sotaTier = await SotaTier.attach(SotaToken);

  await sotaTier.deployed();

  console.log("SotaTier deployed to:", sotaTier.address);
  console.log(
    await hre.run('verify:verify', {
      address: sotaTier.address,
      constructorArguments: [SotaToken],
    })
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });