'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const WhitelistModel = use('App/Models/WhitelistUser');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');

class WhitelistUserService {
  buildQueryBuilder(params) {
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
    return await builder.fetch();
  }
}

module.exports = WhitelistUserService
