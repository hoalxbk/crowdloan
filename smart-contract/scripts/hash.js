const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();
const alchemyKey = process.env.ALCHEMY_KEY;
const web3 = new Web3(`https://eth-goerli.alchemyapi.io/v2/${alchemyKey}`);
const privateKey = process.env.DEPLOY_ACCOUNT_PRIVATE_KEY;


const main = async () => {
  // 1. Add accounts to web3
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const accountAddress = account.address;

  web3.eth.accounts.wallet.add(account)
  // 2. Set default account
  web3.eth.defaultAccount = account.address;

  // Get Signer
  // call to contract with parameters
  const hash = '0x4d79c66bd3d3c6f24bdf3c68924ab858cf020007e2f6b54a1647be6da799639b';

  // Sign this message hash with private key and account address
  const signature = await web3.eth.sign(hash, accountAddress);
  console.log(signature);
}

main();