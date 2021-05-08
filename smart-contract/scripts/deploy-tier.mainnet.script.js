const hre = require("hardhat");

async function main() {
  const PKF = "0x8b39b70e39aa811b69365398e0aace9bee238aeb";
  const sPKF = "0x1dfdb0fb85402dc7f8d72d92ada8fbbb3ffc8633"; // Staked PKF
  const UniLp = "0xfe903A12359496B932e24C5e9B78f1B9060a6342"; // PKF-ETH LP

  const [owner] = await hre.ethers.getSigners();

  const penaltyWallet = owner.address;

  const RedKiteTiers = await hre.ethers.getContractFactory("contracts/tier/RedKiteTiers.sol:RedKiteTiers");
  const redKiteTiers = await RedKiteTiers.deploy(PKF, sPKF, UniLp, penaltyWallet);

  await redKiteTiers.deployed();

  console.log("RedKiteTiers deployed to:", redKiteTiers.address);

  console.log(
    await hre.run('verify:verify', {
      address: redKiteTiers.address,
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