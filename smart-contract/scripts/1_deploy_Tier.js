const hre = require("hardhat");

async function main() {
  const PKF = "0x5d24b566F91A1B3D8B3C8e83544E8160924Ce276";
  const penaltyWallet = "0x1BaB8030249382A887F967FcAa7FE0be7B390728";

  const RedKiteTiers = await hre.ethers.getContractFactory("contracts/tier/RedKiteTiers.sol:RedKiteTiers");
  const redKiteTiers = await RedKiteTiers.deploy(PKF, penaltyWallet);
//   const redKiteTiers = await RedKiteTiers.attach("0xF04E3520640cEd805319B915e3095F1226C8762B");

  await redKiteTiers.deployed();

  console.log("RedKiteTiers deployed to:", redKiteTiers.address);
  console.log(
    await hre.run('verify:verify', {
      address: redKiteTiers.address,
      constructorArguments: [PKF, penaltyWallet],
    })
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });