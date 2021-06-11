export const TRANSACTION_ERROR = 'Transaction failed. Please check blockchain to know more error.';
export const DEFAULT_LIMIT = 10;
export const API_URL_PREFIX = 'admin';
export const ADMIN_URL_PREFIX = 'dashboard';
export const IMAGE_URL_PREFIX = 'image';
export const MAX_BUY_CAMPAIGN = 1000;
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIERS = [
  '-',
  'Dove',
  'Hawk',
  'Eagle',
  'Phoenix',
];

export const ACCEPT_CURRENCY = {
  ETH: 'eth',
  USDT: 'usdt',
  USDC: 'usdc',
};
export const BUY_TYPE = {
  WHITELIST_LOTTERY: 'whitelist',
  FCFS: 'fcfs',
};
export const POOL_TYPE = {
  SWAP: 'swap',
  CLAIMABLE: 'claimable',
};
export const NETWORK_AVAILABLE = {
  ETH: 'eth',
  BSC: 'bsc',
};
export const PUBLIC_WINNER_STATUS = {
  PUBLIC: 1,
  PRIVATE: 0,
};
export const POOL_IS_PRIVATE = {
  PUBLIC: 0,
  PRIVATE: 1,
};
export const PICK_WINNER_RULE = {
  RULE_NORMAL: 'rule-normal',
  RULE_WITH_WEIGHT_RATE: 'rule-with-weight-rate',
};

export const USDT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_USDT_ADDRESS;
export const USDC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_USDC_ADDRESS;
export const USDT_BSC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_BSC_USDT_ADDRESS;
export const USDC_BSC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_BSC_USDC_ADDRESS;
export const BUSD_BSC_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_BSC_BUSD_ADDRESS;

export const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
export const BCSSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";

export const ETH_CHAIN_ID = process.env.REACT_APP_NETWORK_ID as string;
export const BSC_CHAIN_ID = process.env.REACT_APP_BSC_NETWORK_ID as string;
export const NETWORK_ETH_NAME = process.env.REACT_APP_NETWORK_NAME;
export const NETWORK_BSC_NAME = process.env.REACT_APP_BSC_NETWORK_NAME;
export const APP_NETWORK_NAMES = {
  [ETH_CHAIN_ID]: NETWORK_ETH_NAME,
  [BSC_CHAIN_ID]: NETWORK_BSC_NAME,
};
export const ACCEPT_NETWORKS = {
  ETH_CHAIN_ID: process.env.REACT_APP_NETWORK_ID,
  BSC_CHAIN_ID: process.env.REACT_APP_BSC_NETWORK_ID,
};

export const CHAIN_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  BSC_TESTNET: 97,
  BSC_MAINNET: 56,
};
export const CHAIN_ID_NAME_MAPPING: any = {
  '1': 'Mainnet',
  '3': 'Ropsten',
  '4': 'Rinkeby',
  '5': 'Goerli',
  '42': 'Kovan',
  '97': 'BSC Testnet',
  '56': 'BSC Mainnet',
};
export const ETH_NETWORK_ACCEPT_CHAINS: any = {
  '1': 'Mainnet',
  '3': 'Ropsten',
  '4': 'Rinkeby',
  '5': 'Goerli',
  '42': 'Kovan',
};
export const BSC_NETWORK_ACCEPT_CHAINS: any = {
  '97': 'BSC Testnet',
  '56': 'BSC Mainnet',
};

export const ETHERSCAN_BASE_URL: any = {
  '1': 'https://etherscan.io/address',
  '4': 'https://rinkeby.etherscan.io/address',
  '5': 'https://goerli.etherscan.io/address',
  '97': 'https://testnet.bscscan.com/address',
};
