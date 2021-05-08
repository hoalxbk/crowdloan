'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const HelperUtils = use('App/Common/HelperUtils');
const StakingLogModel = use('App/Models/StakingLog');
const Const = use('App/Common/Const');
const BigNumber = use('bignumber.js');

class MantraStakeService {
    buildQueryBuilder(params) {
      let builder = StakingLogModel.query();
      if (params.id) {
        builder = builder.where('id', params.id);
      }
      return builder;
    }

    async findMantraStake(params) {
      let builder = this.buildQueryBuilder(params);
      return await builder.first();
    }

    async saveRecord(event, params, txHash) {
      const stakingLog = new StakingLogModel;
      stakingLog.event = event;
      stakingLog.transaction_hash = txHash;
      stakingLog.request_params = JSON.stringify(params);

      if (event === 'Staked') {
        stakingLog.account = params.account;
        stakingLog.amount = new BigNumber(params.stakedAmount || 0).dividedBy(Math.pow(10, 18)).toFixed();
      } else {
        console.log('Save Record Unstaked: ===================>', params);
        stakingLog.account = params.account;
        stakingLog.amount = new BigNumber(params.unstakedAmount || 0).dividedBy(Math.pow(10, 18)).toFixed();
      }
      await stakingLog.save();

      return stakingLog;
    }

}

module.exports = MantraStakeService
