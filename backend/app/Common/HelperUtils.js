'use strict'

const crypto = use('crypto');
const Const = use('App/Common/Const');
const ErrorFactory = use('App/Common/ErrorFactory');

const CONFIGS_FOLDER = '../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const {abi: CONTRACT_ABI} = CONTRACT_CONFIGS.CONTRACT_DATA;
const {abi: CONTRACT_CLAIM_ABI} = CONTRACT_CONFIGS.CONTRACT_CLAIMABLE;
const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const web3Bsc = new Web3(NETWORK_CONFIGS.WEB3_BSC_API_URL);
const BigNumber = use('bignumber.js');

// Tier Smart contract
const { abi: CONTRACT_TIER_ABI } = require('../../blockchain_configs/contracts/Normal/Tier.json');
const TIER_SMART_CONTRACT = process.env.TIER_SMART_CONTRACT;
const { abi: CONTRACT_STAKE_ABI } = require('../../blockchain_configs/contracts/Normal/MantraStake.json');
const MANTRA_DAO_STAKE_SMART_CONTRACT = process.env.MATRA_DAO_STAKE_SMART_CONTRACT;
const ETH_SMART_CONTRACT_USDT_ADDRESS = process.env.ETH_SMART_CONTRACT_USDT_ADDRESS;
const ETH_SMART_CONTRACT_USDC_ADDRESS = process.env.ETH_SMART_CONTRACT_USDC_ADDRESS;
const BSC_SMART_CONTRACT_USDT_ADDRESS = process.env.BSC_SMART_CONTRACT_USDT_ADDRESS;
const BSC_SMART_CONTRACT_USDC_ADDRESS = process.env.BSC_SMART_CONTRACT_USDC_ADDRESS;
const BSC_SMART_CONTRACT_BUSD_ADDRESS = process.env.BSC_SMART_CONTRACT_BUSD_ADDRESS;
/**
 * Generate "random" alpha-numeric string.
 *
 * @param  {int}      length - Length of the string
 * @return {string}   The result
 */
const randomString = async (length = 40) => {
  let string = ''
  let len = string.length

  if (len < length) {
    let size = length - len
    let bytes = await crypto.randomBytes(size)
    let buffer = new Buffer(bytes)

    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }

  return string
};

const doMask = (obj, fields) => {
  for(const prop in obj) {
    if(!obj.hasOwnProperty(prop)) continue;
    if(fields.indexOf(prop)!=-1) {
      obj[prop] = this.maskEmail(obj[prop]);
    } else if(typeof obj[prop]==='object') {
      this.doMask(obj[prop], fields);
    }
  }
};

const maskEmail = async (email) => {
  console.log(`Email before mask is ${email}`);
  const preEmailLength = email.split("@")[0].length;
  // get number of word to hide, half of preEmail
  const hideLength = ~~(preEmailLength / 2);
  console.log(hideLength);
  // create regex pattern
  const r = new RegExp(".{"+hideLength+"}@", "g")
  // replace hide with ***
  email = email.replace(r, "***@");
  console.log(`Email after mask is ${email}`);
  return email;
};

const maskWalletAddress = async (wallet) => {
  console.log(`Wallet before mask is ${wallet}`);
  const preWalletLength = wallet.length;
  console.log('preWalletLength', preWalletLength);

  // get number of word to hide, 1/3 of preWallet
  const hideLength = Math.floor(preWalletLength / 3);
  console.log('hideLength', hideLength);

  // replace hide with ***
  let r = wallet.substr(hideLength, hideLength);
  wallet = wallet.replace(r, "*************");

  console.log(`Wallet after mask is ${wallet}`);
  return wallet;
};

const checkRole = (params, extraData) => {
  return {
    ...params,
    role: params.type === Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER,
  }
};

const responseErrorInternal = (message) => {
  return {
    status: 500,
    message: message || 'Sorry there seems to be a server error!',
    data: null,
  }
};

const responseNotFound = (message) => {
  return {
    status: 404,
    message: message || 'Not Found !',
    data: null,
  }
};

const responseBadRequest = (message) => {
  return {
    status: 400,
    message: message || 'Looks like this is unkown request, please try again or contact us.',
    data: null,
  }
};

const responseSuccess = (data = null, message) => {
  return {
    status: 200,
    message: message || 'Success !',
    data,
  }
};

const checkSumAddress = (address) => {
  const addressVerified = Web3.utils.toChecksumAddress(address);
  return addressVerified;
};

const paginationArray = (array, page_number, page_size) => {
  const newData = JSON.parse(JSON.stringify(array));
  const pageData = newData.slice((page_number - 1) * page_size, page_number * page_size);
  const dataLength = newData.length;
  return {
    data: pageData,
    total: dataLength,
    perPage: page_size,
    lastPage: Math.ceil(dataLength / page_size),
    page: page_number,
  };
};

/**
 * Smart Contract Utils
 */
const getTierSmartContractInstance = () => {
  const tierSc = new web3.eth.Contract(CONTRACT_TIER_ABI, TIER_SMART_CONTRACT);
  return tierSc;
};

const getMantraStakeSmartContractInstance = () => {
  const mantraSc = new web3.eth.Contract(CONTRACT_STAKE_ABI, MANTRA_DAO_STAKE_SMART_CONTRACT);
  return mantraSc;
};

const getUserTierSmart = async (wallet_address) => {
  const tierSc = getTierSmartContractInstance();
  const receivedData = await Promise.all([
    tierSc.methods.getTiers().call(),
    tierSc.methods.userTotalStaked(wallet_address).call(),
  ]);
  console.log('[getUserTierSmart] - receivedData: ', receivedData);

  // get 4 tiers
  const tiers = receivedData[0].slice(0, 4);
  // calc pfk equal
  const pkfEq = new BigNumber(receivedData[1]);
  let userTier = 0;
  tiers.map((pkfRequire, index) => {
    if (pkfEq.gte(pkfRequire)) {
      userTier = index + 1;
    }
  });

  console.log('wallet_address - userTier: ', wallet_address, userTier);
  console.log('pkfEq', pkfEq.toFixed());

  return [userTier, new BigNumber(pkfEq).dividedBy(Math.pow(10, 18)).toFixed()];
};


const getExternalTokenSmartContract = async (wallet_address) => {
  const tierSc = getTierSmartContractInstance();
  const externalTokenMantra = await tierSc.methods.externalToken(MANTRA_DAO_STAKE_SMART_CONTRACT).call();
  console.log('[getExternalTokenSmartContract] - externalToken', externalTokenMantra);
  return externalTokenMantra;
};


const getUserTotalStakeSmartContract = async (wallet_address) => {
  const tierSc = getTierSmartContractInstance();
  const totalStaked = await tierSc.methods.userTotalStaked(wallet_address).call();
  console.log('[getUserTotalStakeSmartContract] - totalStaked', totalStaked);
  return totalStaked;
};

const getUnstakeMantraSmartContract = async (wallet_address) => {
  const mantraSc = getMantraStakeSmartContractInstance();
  const unstakeAmountMantra = await mantraSc.methods.getUnstake(wallet_address).call();
  console.log('[getUnstakeMantraSmartContract] - unstakeAmountMantra', unstakeAmountMantra);
  return unstakeAmountMantra;
};

const getTierBalanceInfos = async (wallet_address) => {
  const tierSc = getTierSmartContractInstance();
  const mantraSc = getMantraStakeSmartContractInstance();
  const receivedData = await Promise.all([
    tierSc.methods.getTiers().call(),
    tierSc.methods.userTotalStaked(wallet_address).call(),
    mantraSc.methods.getUnstake(wallet_address).call(),
    tierSc.methods.externalToken(MANTRA_DAO_STAKE_SMART_CONTRACT).call(),
  ]);
  return receivedData;
};

const getContractInstance = async (camp) => {
  if (camp.network_available == Const.NETWORK_AVAILABLE.ETH) {
    return new web3.eth.Contract(CONTRACT_ABI, camp.campaign_hash);
  } else {
    return new web3Bsc.eth.Contract(CONTRACT_ABI, camp.campaign_hash);
  }
}

const getContractClaimInstance = async (camp) => {
  if (camp.network_available == Const.NETWORK_AVAILABLE.ETH) {
    return new web3.eth.Contract(CONTRACT_CLAIM_ABI, camp.campaign_hash);
  } else {
    return new web3Bsc.eth.Contract(CONTRACT_CLAIM_ABI, camp.campaign_hash);
  }
}

const getOfferCurrencyInfo = async (camp) => {
  // init pool contract
  const poolContract = await getContractInstance(camp);
  const isEthChain = (camp.network_available == Const.NETWORK_AVAILABLE.ETH) ? true : false;
  // get convert rate token erc20 -> our token
  let scCurrency, unit;
  switch (camp.accept_currency) {
    case Const.ACCEPT_CURRENCY.USDT:
      scCurrency = isEthChain ? ETH_SMART_CONTRACT_USDT_ADDRESS : BSC_SMART_CONTRACT_USDT_ADDRESS;
      unit = isEthChain ? 6 : 18;
      break;
    case Const.ACCEPT_CURRENCY.USDC:
      scCurrency = isEthChain ? ETH_SMART_CONTRACT_USDC_ADDRESS : BSC_SMART_CONTRACT_USDC_ADDRESS;
      unit = isEthChain ? 6 : 18;
      break;
    case Const.ACCEPT_CURRENCY.BUSD:
      scCurrency = BSC_SMART_CONTRACT_BUSD_ADDRESS;
      unit = 18;
      break;
    case Const.ACCEPT_CURRENCY.ETH:
    case Const.ACCEPT_CURRENCY.BNB:
      scCurrency = '0x0000000000000000000000000000000000000000';
      unit = 18;
      break;
    default:
      console.log(`Do not found currency support ${camp.accept_currency} of campaignId ${camp.id}`);
      return ErrorFactory.responseErrorInternal();
  }
  // call to SC to get rate
  const receipt = await Promise.all([
    poolContract.methods.getOfferedCurrencyRate(scCurrency).call(),
    poolContract.methods.getOfferedCurrencyDecimals(scCurrency).call()
  ]);

  const rate = receipt[0];
  const decimal = receipt[1];
  return [rate, decimal, unit];
}

module.exports = {
  randomString,
  doMask,
  maskEmail,
  maskWalletAddress,
  responseSuccess,
  responseNotFound,
  responseErrorInternal,
  responseBadRequest,
  checkSumAddress,
  paginationArray,
  getTierSmartContractInstance,
  getMantraStakeSmartContractInstance,
  getTierBalanceInfos,
  getUserTotalStakeSmartContract,
  getUnstakeMantraSmartContract,
  getExternalTokenSmartContract,
  getUserTierSmart,
  getContractInstance,
  getContractClaimInstance,
  getOfferCurrencyInfo
};
