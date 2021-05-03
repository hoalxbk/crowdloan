module.exports = {
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  WEB3_API_URL: 'https://goerli.infura.io/v3/c745d07314904c539668b553dbd6b670',
  // WEB3_API_URL: 'https://goerli.infura.io/v3/cc59d48c26f54ab58d831f545eda2bb7',
  // WEB3_API_URL: 'https://goerli.infura.io/v3/3a18fd787c2342c4915364de4955bcf5',

  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 9876,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/CampaignFactory.json'), // CampaignFactory
      CONTRACT_ADDRESS: '0x578b8067C088cdfE26762193Dc2b7a96a8403923',
      FIRST_CRAWL_BLOCK: 4550016, // Start Block: 4555016
      BLOCK_NUM_IN_ONE_GO: 40000,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Campaign.json'), // Campaign
      CONTRACT_ADDRESS: '0x6f4d398eb1db901a38e213aed6d2e42e38e1c19a', // Ignored
      FIRST_CRAWL_BLOCK: 4550016,
      BLOCK_NUM_IN_ONE_GO: 2000,
      BREAK_TIME_AFTER_ONE_GO: 30000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    ETHLink: {
      CONTRACT_DATA: require('./contracts/ETHLink.json'), // ETHLink
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 4550016,
      BLOCK_NUM_IN_ONE_GO: 4000,
      BREAK_TIME_AFTER_ONE_GO: 40000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Tier: {
      CONTRACT_DATA: require('./contracts/Tier.json'), // Tier
      CONTRACT_ADDRESS: '0xDf2b8f344c54A600636f2C13001d59341Ed246e8',
      FIRST_CRAWL_BLOCK: 4680953,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
  },
};
