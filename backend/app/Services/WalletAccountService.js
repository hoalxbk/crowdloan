'use strict'

const WalletAccountModel = use('App/Models/WalletAccount');

class WalletAccountService {
  buildQueryBuilder(params) {
    let builder = WalletAccountModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.wallet_address) {
      builder = builder.where('wallet_address', params.wallet_address);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    return builder;
  }

  async findByCampaignId(params) {
    let builder = this.buildQueryBuilder(params);
    return await builder.first();
  }
}

module.exports = WalletAccountService
