const hre = require("hardhat");

async function main() {
  const PKF = "0x1dfdb0fb85402dc7f8d72d92ada8fbbb3ffc8633";
  const UniLp = "0xfe903A12359496B932e24C5e9B78f1B9060a6342"; // PKF-ETH LP

  const [owner] = await hre.ethers.getSigners();

  const penaltyWallet = owner.address;

  const PKFTiers = await hre.ethers.getContractFactory("contracts/tier/RedKiteTiers.sol:RedKiteTiers");
  const pkfTiers = await PKFTiers.deploy(PKF, UniLp, penaltyWallet);

  await pkfTiers.deployed();

  console.log("PKFTiers deployed to:", pkfTiers.address);
  
  console.log(
    await hre.run('verify:verify', {
      address: pkfTiers.address,
      constructorArguments: [PKF, UniLp, penaltyWallet],
    })
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });