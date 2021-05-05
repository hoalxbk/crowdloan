'use strict'

const UserBalanceSnapshotModel = use('App/Models/UserBalanceSnapshot');

class UserBalanceSnapshotService {
  buildQueryBuilder(params) {
    // create query
    let builder = UserBalanceSnapshotModel.query();
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

  async getRandomWinners(total_winner_ticket, tier, campaign_id) {
    return await UserBalanceSnapshotModel.query()
      .where('campaign_id', campaign_id)
      .where('level', tier)
      .orderByRaw('RAND()').limit(total_winner_ticket).fetch();
  }
}
