'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const TierModel = use('App/Models/Tier');
const CONFIGS_FOLDER = '../../../blockchain_configs/';
// const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
// const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);

class TierService {
  buildQueryBuilder(params) {
    // create query
    let builder = TierModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    return builder;
  }

}

module.exports = TierService
