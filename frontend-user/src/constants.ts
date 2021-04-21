export const TRANSACTION_ERROR = 'Transaction failed. Please check blockchain to know more error.';
export const API_URL_PREFIX = 'user';
export const ADMIN_URL_PREFIX = 'dashboard';
export const MAX_BUY_CAMPAIGN = 1000;
export const POOL_STATUS = {
  UPCOMMING: 1,
  JOINING: 2,
  IN_PROGRESS: 3,
  FILLED: 4,
  CLOSED: 5,
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

export const TIERS = [
  {
    name: 'Start',
    icon: '/images/icons/rocket.svg'
  },
  {
    name: 'Bronze',
    icon: '/images/icons/bronze-medal.svg'
  },
  {
    name: 'Silver',
    icon: '/images/icons/silver-medal.svg'
  },
  {
    name: 'Gold',
    icon: '/images/icons/golden-medal.svg'
  },
  {
    name: 'Diamond',
    icon: '/images/icons/diamond.svg'
  }
]
