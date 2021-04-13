module.exports = {
  WEB3_API_URL: 'https://goerli.infura.io/v3/f1464dc327c64a93a31220b50334bf78',
  // WEB3_API_URL: 'https://rinkeby.infura.io/v3/3a18fd787c2342c4915364de4955bcf5',
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 9876,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/CapaignFactory.json'),
      CONTRACT_ADDRESS: '0x578b8067C088cdfE26762193Dc2b7a96a8403923',
      FIRST_CRAWL_BLOCK: 4550016, // First Block: 4554016
      BLOCK_NUM_IN_ONE_GO: 5000,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Campaign.json'),
      CONTRACT_ADDRESS: '0x6f4d398eb1db901a38e213aed6d2e42e38e1c19a',
      FIRST_CRAWL_BLOCK: 4550016,
      BLOCK_NUM_IN_ONE_GO: 500,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    EthLink: {
      CONTRACT_DATA: require('./contracts/EthLink.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 4550016,
      BLOCK_NUM_IN_ONE_GO: 500,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    }
  }
};
