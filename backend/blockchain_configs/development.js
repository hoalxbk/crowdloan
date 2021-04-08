module.exports = {
  // WEB3_API_URL: 'https://rinkeby.infura.io/v3/3a18fd787c2342c4915364de4955bcf5',
  // WEB3_API_URL: 'https://rinkeby.infura.io/v3/f1464dc327c64a93a31220b50334bf78',
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  WEB3_API_URL: 'https://goerli.infura.io/v3/f1464dc327c64a93a31220b50334bf78',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 9876,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/CapaignFactory.json'),
      CONTRACT_ADDRESS: '0x89a267131c104fa11554f8fc2a5fa4ad52741a74',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 5000,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Campaign.json'),
      CONTRACT_ADDRESS: '0x99AC963e5f6683c5BCdbBe169B742e9321a6FC46',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 500,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    EthLink: {
      CONTRACT_DATA: require('./contracts/EthLink.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 500,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    }
  }
};
