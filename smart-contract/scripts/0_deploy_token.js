const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const name = 'sPKF';
  const symbol = 'sPKF';
  const totalSupply = `5${'0'.repeat(27)}`
  const Token = await hre.ethers.getContractFactory("ERC20Token");
  // const token = await Token.deploy(
  //   name,
  //   symbol,
  //   process.env.INITIAL_ADDRESS,
  //   totalSupply
  // );
  const token = await Token.attach("0x38C98C5c798bebc34E9bedb7DcAC2c2ACe393Cf8");

  // await token.deployed();

  console.log(`${name} deployed to:`, token.address);

  console.log(
    await hre.run('verify:verify', {
      address: token.address,
      constructorArguments: [
        name,
        symbol,
        process.env.INITIAL_ADDRESS,
        totalSupply
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
