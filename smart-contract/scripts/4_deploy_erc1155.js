const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const uri = '';
  const Token = await hre.ethers.getContractFactory("contracts/token/ERC1155/ERC1155Token.sol:ERC1155Token");
//   const token = await Token.deploy(
//     uri
//   );
  const token = await Token.attach("0xb085aB1e76Af65FEa80cE569ECCF04E97335f47F");

//   await token.deployed();

  console.log(`ERC1155Token deployed to:`, token.address);

  console.log(
    await hre.run('verify:verify', {
      address: token.address,
      constructorArguments: [
        uri
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
