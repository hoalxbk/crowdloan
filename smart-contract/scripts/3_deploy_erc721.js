const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const name = 'NFT PKF';
  const symbol = 'nPKF';
  const Token = await hre.ethers.getContractFactory("contracts/token/ERC721/ERC721Token.sol:ERC721Token");
//   const token = await Token.deploy(
//     name,
//     symbol,
//   );
  const token = await Token.attach("0xdE1CE3634dfED14400cED916B06d10115Da760Ec");

//   await token.deployed();

  console.log(`${name} deployed to:`, token.address);

  console.log(
    await hre.run('verify:verify', {
      address: token.address,
      constructorArguments: [
        name,
        symbol,
      ],
    })
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
