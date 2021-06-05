'use strict'

const UserBalanceSnapshotModel = use('App/Models/UserBalanceSnapshot');

class UserBalanceSnapshotService {
  buildQueryBuilder(params) {
    // create query
    let builder = UserBalanceSnapshotModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.wallet_address) {
      builder = builder.where('wallet_address', params.wallet_address);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    if (params.level) {
      builder = builder.where('level', params.level);
    }

    return builder;
  }

  async findOneByFilters(params) {
    return await this.buildQueryBuilder(params).first();
  }

  async sumPKFBalanceByFilters(params) {
    return await this.buildQueryBuilder(params).sum('pkf_balance');
  }

  async sumPKFWithWeightRateBalanceByFilters(params) {
    return await this.buildQueryBuilder(params).sum('pkf_balance_with_weight_rate');
  }

  async getAllSnapshotByFilters(params) {
    return await this.buildQueryBuilder(params).fetch();
  }

  async countByFilters(params) {
    return await this.buildQueryBuilder(params).count();
  }

  async getRandomWinners(total_winner_ticket, tier, campaign_id) {
    return await UserBalanceSnapshotModel.query()
      .where('campaign_id', campaign_id)
      .where('level', tier)
      .orderByRaw('RAND()').limit(total_winner_ticket).fetch();
  }
}

module.exports = UserBalanceSnapshotService
