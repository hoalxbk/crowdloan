'use strict'

const MantraStakeService = use('App/Services/MantraStakeService');

class MantraStakeController {

  async staked({ request, params }) {
    try {
      const inputParams = request.only(['event', 'params', 'txHash']);
      console.log('[Webhook] - [staked] - request Params: ', request.all(), params);

      const stakingLog = (new MantraStakeService).saveRecord(inputParams.event, inputParams.params, inputParams.txHash);

      return stakingLog;
    } catch (e) {
      console.log('[Webhook] - [staked] - Error: ', e);
      return false;
    }
  }

  async unstaked({ request }) {
    try {
      const inputParams = request.only(['event', 'params', 'txHash']);
      console.log('[Webhook] - [unstaked] - request Params: ', request.all(), params);

      const stakingLog = (new MantraStakeService).saveRecord(inputParams.event, inputParams.params, inputParams.txHash);

      return stakingLog;
    } catch (e) {
      console.log('[Webhook] - [staked] - Error: ', e);
      return false;
    }
  }

}

module.exports = MantraStakeController
