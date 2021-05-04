export const TRANSACTION_ERROR = 'Transaction failed. Please check blockchain to know more error.';
export const API_URL_PREFIX = 'user';
export const ADMIN_URL_PREFIX = 'dashboard';
export const MAX_BUY_CAMPAIGN = 1000;
export const POOL_STATUS = {
  TBA: 0,
  UPCOMMING: 1,
  JOINING: 2,
  IN_PROGRESS: 3,
  FILLED: 4,
  CLOSED: 5,
  CLAIMABLE: 6
}

export const NETWORK = {
  ETHEREUM: 'eth',
  BSC: 'bsc'
}

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

export const USER_STATUS = {
  UNVERIFIED: 0,
  ACTIVE: 1,
  BLOCKED: 2,
  DELETED: 3
}

export const CONVERSION_RATE = [
  {
    name: 'Uniswap LP',
    rate: 150,
    symbol: 'UPKF'
  },
  {
    name: 'sPKF',
    rate: 1,
    symbol: 'MPKF'
  },
  // {
  //   name: 'NFT',
  //   rate: 100
  // },
]

export const TIERS = [
  {
    name: '',
    icon: '/images/icons/rocket.svg',
    bg: '/images/icons/red-kite-bg.png',
    bgColor: '#8D8DCC',
  },
  {
    name: 'Dove',
    bg: '/images/icons/hawk-bg.png',
    bgColor: '#5252AD',
    icon: '/images/icons/bronze-medal.svg'
  },
  {
    name: 'Falcon',
    bg: '/images/icons/falcon-bg.png',
    bgColor: '#3F3FA3',
    icon: '/images/icons/silver-medal.svg'
  },
  {
    name: 'Eagle',
    bg: '/images/icons/eagle-bg.png',
    bgColor: '#1B1BA3',
    icon: '/images/icons/golden-medal.svg'
  },
  {
    name: 'Phoenix',
    bg: '/images/icons/phoenix-bg.png',
    bgColor: '',
    icon: '/images/icons/diamond.svg'
  }
]
