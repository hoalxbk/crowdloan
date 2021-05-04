'use strict'

const TierModel = use('App/Models/Tier');
const CONFIGS_FOLDER = '../../../blockchain_configs/';

class TierService {
  buildQueryBuilder(params) {
    let builder = TierModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.level) {
      builder = builder.where('level', params.level);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    if(params.current_time) {
      builder = builder.where('start_time', '<=', params.current_time)
        .where('end_time', '>=', params.current_time)
    }
    return builder;
  }

  async findByLevelAndCampaign(params) {
    let builder = this.buildQueryBuilder(params);
    return await builder.first();
  }

  async findOneByFilter(filterParams) {
    return await this.buildQueryBuilder(filterParams).first();
  }

  async findAllByFilter(filterParams) {
    return await this.buildQueryBuilder(filterParams).fetch();
  }
}

module.exports = TierService
