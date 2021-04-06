'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const WinnerListService = use('App/Services/WinnerListUserService')
const HelperUtils = use('App/Common/HelperUtils');

class WinnerListUserController {
  async getWinnerList(params) {
    const filterParams = {
      'campaign_id': params.campaign_id
    };
    const winnerListService = new WinnerListService();
    try {
      const result = await winnerListService.findWinnerListUser(filterParams);
      return HelperUtils.responseSuccess({result});
    } catch (e) {
      console.log(e);
      return ErrorFactory.internal('ERROR: Get Winner User List Failed !');
    }
  }
}

module.exports = WinnerListUserController
