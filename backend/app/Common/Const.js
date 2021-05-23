module.exports = Object.freeze({
  DEFAULT_LIMIT: 10,
  TOKEN_DECIMAL: 18,
  CONTRACTS: {
    // map to contract_name in contract_logs table
    CAMPAIGN: 'Campaign',
    CAMPAIGNFACTORY: 'CampaignFactory',
    ETHLINK: 'ETHLink',
    ERC20: 'Erc20',
    TIER: 'Tier',
    MANTRA_STAKE: 'MantraStake',
  },
  TX_TABLE: {
    CAMPAIGN: 1,
  },
  MAX_BUY_CAMPAIGN: 1000,
  EVENT_BY_TOKEN: 'TokenPurchaseByToken',
  CAMPAIGN_BLOCKCHAIN_STATUS: {
    REGISTRATION_WAITING_TX_FROM_CLIENT: 0,
    REGISTRATION_WAITING_CONFIRMATION: 1,
    REGISTRATION_CONFIRMED: 2,
    DELETION_WAITING_TX_FROM_CLIENT: 3,
    DELETION_WAITING_CONFIRMATION: 4,
    DELETION_CONFIRMED: 5,
    ACTIVATION_ACCOUNT_TX_FROM_CLIENT: 6,
    INACTIVE: 7,
    REGISTRATION_TX_FAILED: 10,
    DELETION_TX_FAILED: 11
  },
  OPERATORS_BLOCKCHAIN_ADDRESS_STATUS: {
    REGISTRATION_WAITING_TX_FROM_CLIENT: 0,
    REGISTRATION_WAITING_CONFIRMATION: 1,
    REGISTRATION_CONFIRMED: 2,
    DELETION_WAITING_TX_FROM_CLIENT: 3,
    DELETION_WAITING_CONFIRMATION: 4,
    DELETION_CONFIRMED: 5,
    ACTIVATION_ACCOUNT_TX_FROM_CLIENT: 6,
    REGISTRATION_TX_FAILED: 10,
    DELETION_TX_FAILED: 11
  },
  TX_UPDATE_ACTION: {
    CAMPAIGN_REGISTER: 401,
    CAMPAIGN_DELETE: 402,
    CAMPAIGN_ACTIVATION: 403,
    CAMPAIGN_UPDATE: 404,
  },
  JOB_KEY: {
    CHECK_STATUS: 'CheckTxStatus-job',
    SEND_FORGOT_PASSWORD: 'SendForgotPasswordJob-job',
    SEND_CONFIRMATION_EMAIL: 'SendConfirmationEmailJob-job',
    SEND_ADMIN_INFO_EMAIL: 'SendAdminInfoEmailJob-job',
    PICKUP_RANDOM_WINNER: 'PickupRandomWinner-job'
  },
  ACTIVE: 0,
  SUSPEND: 1,
  PROCESSING: 2,
  USER_ROLE: {
    ICO_OWNER: 1,
    PUBLIC_USER: 2,
  },
  USER_TYPE: {
    WHITELISTED: 1,
    REGULAR: 2,
  },
  USER_TYPE_PREFIX: {
    ICO_OWNER: 'admin',
    PUBLIC_USER: 'user',
  },
  USER_STATUS: {
    UNVERIFIED: 0,
    ACTIVE: 1,
    BLOCKED: 2,
    DELETED: 3
  },
  FILE_SITE: '2mb',
  FILE_EXT: ['png', 'gif', 'jpg', 'jpeg', 'JPEG'],
  TIME_EXPIRED: 300000,
  PASSWORD_MIN_LENGTH: 8,
  TEXT_MAX_LENGTH: 255,
  EXPIRE_ETH_PRICE: 900,
  ERROR_CODE: {
    AUTH_ERROR: {
      ADDRESS_NOT_EXIST: 'AUTH_ERROR.ADDRESS_NOT_EXIST',
      PASSWORD_NOT_MATCH: 'AUTH_ERROR.PASSWORD_NOT_MATCH',
    },
  },
  CRAWLER_EVENT: {
    POOL_CREATED: 'PoolCreated',
    ICO_CAMPAIGN_CREATED: 'IcoCampaignCreated',
    ICO_CAMPAIGN_CREATED_WITH_ETH_LINK: 'IcoCampaignCreatedWithEthLink',
    TOKEN_PURCHASE_BY_ETHER_WITH_ETH_LINK: 'TokenPurchaseByEtherWithEthLink',
    TOKEN_PURCHASE_BY_ETHER: 'TokenPurchaseByEther',
    TOKEN_PURCHASE_BY_TOKEN: 'TokenPurchaseByToken',
    PAUSE: 'Pause',
    UNPAUSE: 'Unpause',
    BUY_WITH_ETHER: 'buyWithEther',
    BUY_WITH_TOKEN: 'buyWithToken',
    BUY_WITH_ETHER_WITH_ETH_LINK: 'buyWithEtherWithETHLink',
    REFUND: 'Refund',
    TOKEN_CLAIMED: 'TokenClaimed',
  },
  BUY_TYPE: {
    WHITELIST_LOTTERY: 'whitelist',
    FCFS: 'fcfs',
  },
  ACCEPT_CURRENCY: {
    ETH: 'eth',
    BNB: 'bnb',
    USDT: 'usdt',
    USDC: 'usdc',
    BUSD: 'busd'
  },
  POOL_TYPE: {
    SWAP: 'swap',
    CLAIMABLE: 'claimable',
  },
  POOL_DISPLAY: {
    DISPLAY: 1,
    HIDDEN: 0,
  },
  NETWORK_AVAILABLE: {
    ETH: 'eth',
    BSC: 'bsc',
  },
  DEPLOY_STATUS: {
    DEPLOYED: 1,
    NOT_DEPLOY: 0,
  },
  KYC_STATUS: {
    INCOMPLETE: 0, // Blockpass verifications pending
    APPROVED: 1, // profile has been approved by Merchant
    RESUBMIT: 2, // Merchant has rejected one or more attributes
    WAITING: 3, // Merchant's review pending
    INREVIEW: 4, // in review by Merchant
  },
  NETWORK_AVAILABLE: {
    ETH: 'eth',
    BSC: 'bsc',
  },
});
