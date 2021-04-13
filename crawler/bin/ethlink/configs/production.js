module.exports = {
  WEB3_API_URL: 'https://goerli.infura.io/v3/c745d07314904c539668b553dbd6b670',
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 9876,
  contracts: {
    CampainFactory: {
      CONTRACT_DATA: require('./contracts/CampaignFactory.json'),
      CONTRACT_ADDRESS: '0x0Ddb3a3BEC7eC0D9a13E76b5ECCFD9c9c5c3eD52',
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
    }
  },
};
