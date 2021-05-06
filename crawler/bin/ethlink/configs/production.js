module.exports = {
  WEB3_API_URL: 'https://mainnet.infura.io/v3/514448fdbdb743aea877afebfdc21661',
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 1,
  contracts: {
    CampainFactory: {
      CONTRACT_DATA: require('./contracts/CampaignFactory.json'),
      CONTRACT_ADDRESS: '0x77010248524b58a01afa9e85c21a7316810d154b',
      FIRST_CRAWL_BLOCK: 4181605,
      BLOCK_NUM_IN_ONE_GO: 1000,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Campaign.json'),
      CONTRACT_ADDRESS: '0x3BE421042CAe5BBf47BbfC1AA20F6ADFCcF8bB2D',
      FIRST_CRAWL_BLOCK: 4178705,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    ETHLink: {
      CONTRACT_DATA: require('./contracts/ETHLink.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 4178705,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Tier: {
      CONTRACT_DATA: require('./contracts/Tier.json'), // Tier
      CONTRACT_ADDRESS: '0x383478280136ee5b58b2eceeb93e551cd1749529',
      FIRST_CRAWL_BLOCK: 12377225,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
  },
};
