module.exports = {
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  // WEB3_API_URL: 'https://goerli.infura.io/v3/c745d07314904c539668b553dbd6b670',
  WEB3_API_URL: 'https://goerli.infura.io/v3/cc59d48c26f54ab58d831f545eda2bb7',
  // WEB3_API_URL: 'https://goerli.infura.io/v3/3a18fd787c2342c4915364de4955bcf5',

  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 9876,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/CampaignFactory.json'), // CampaignFactory
      // CONTRACT_ADDRESS: '0x578b8067C088cdfE26762193Dc2b7a96a8403923',
      // CONTRACT_ADDRESS: '0xAadC3018cE3182254D3AB20e74ec0190ee91a899',
      // CONTRACT_ADDRESS: '0x7Fd927D0Be34BF3d4B9cC81254C63D77752A1e6B',
      CONTRACT_ADDRESS: '0x41195Ef5642a6f4B4a0C277608e14dB027CB483F',
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
      CONTRACT_ADDRESS: '0xA7Df177d45567976DcD8983aE317245c8679d841',
      FIRST_CRAWL_BLOCK: 4680953,
      BLOCK_NUM_IN_ONE_GO: 10000,
      BREAK_TIME_AFTER_ONE_GO: 30000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    MantraStake: {
      CONTRACT_DATA: require('./contracts/MantraStake.json'), // MantraStake
      CONTRACT_ADDRESS: '0x0e8D8291E35B890d4887f4eaa6d9F91275e05E6D',
      FIRST_CRAWL_BLOCK: 4680953,
      BLOCK_NUM_IN_ONE_GO: 1000,
      BREAK_TIME_AFTER_ONE_GO: 10000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
  },
};
