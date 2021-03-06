module.exports = {
  WEB3_API_URL: 'https://mainnet.infura.io/v3/8eceb668320143dca7b05395869bde7e',
  WEB3_BSC_API_URL: 'https://bsc-dataseed.binance.org',
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 1,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/Normal/CapaignFactory.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/CapaignFactory.json'),
      CONTRACT_ADDRESS: '0xb3CCE3Bc96AF9fe32ae0E1185F07a25074b0f1e4',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Normal/Campaign.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    EthLink: {
      CONTRACT_DATA: require('./contracts/Normal/EthLink.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    }
  }
};
