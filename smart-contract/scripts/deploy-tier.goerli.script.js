const hre = require("hardhat");

async function main() {
  const PKF = "0x5d24b566f91a1b3d8b3c8e83544e8160924ce276";
  const sPKF = "0x2499ec6fad7394dbf3b7d06bccfd90092a6e5a03"; // Staked PKF
  const UniLp = "0xf8f37cb8a7d54be879b69ea63b1a645e8c262601"; // PKF-ETH LP

  const [owner] = await hre.ethers.getSigners();

  const penaltyWallet = owner.address;

  const RedKiteTiers = await hre.ethers.getContractFactory("contracts/tier/RedKiteTiers.sol:RedKiteTiers");
  const redKiteTiers = await RedKiteTiers.deploy(PKF, sPKF, UniLp, penaltyWallet);

  await redKiteTiers.deployed();

  console.log("RedKiteTiers deployed to:", redKiteTiers.address);

  console.log(
    await hre.run('verify:verify', {
      address: redKiteTiers.address,
      contract: "contracts/tier/RedKiteTiers.sol:RedKiteTiers",
      constructorArguments: [PKF, sPKF, UniLp, penaltyWallet],
    })
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });