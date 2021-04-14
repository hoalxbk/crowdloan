'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const WhitelistModel = use('App/Models/WhitelistUser');

class WhitelistUserService {
  buildQueryBuilder(params) {
    // create query
    let builder = WhitelistModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.email) {
      builder = builder.where('email', params.email);
    }
    if (params.wallet_address) {
      builder = builder.where('wallet_address', params.wallet_address);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    return builder;
  }

  async findWhitelistUser(params) {
    let builder = this.buildQueryBuilder(params);
    if (params.page && params.pageSize) {
      // pagination
      return await builder.paginate(params.page, params.pageSize);
    }
    // return all result
    return await builder.fetch();
  }

  async countByCampaignId(campaign_id) {
    return await WhitelistModel.query().
      where('campaign_id', campaign_id).getCount();
  }

  async checkExisted(wallet_address, campaign_id) {
    const wl = await WhitelistModel.query().
    where('campaign_id', campaign_id).
    where('wallet_address', wallet_address).first();
    return wl != null ? true : false;
  }
}

module.exports = WhitelistUserService
