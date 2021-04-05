'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const WhitelistService = use('App/Services/WhitelistUserService')
const HelperUtils = use('App/Common/HelperUtils');

class WhiteListUserController {
  async getWhiteList(params) {
    const filterParams = {
      'campaign_id': params.campaign_id
    };
    const whitelistService = new WhitelistService();
    try {
      const result = await whitelistService.findWhitelistUser(filterParams);
      return HelperUtils.responseSuccess({result});
    } catch (e) {
      console.log(e);
      return ErrorFactory.internal('ERROR: Get Whitelist User Failed !');
    }
  }
}

module.exports = WhiteListUserController
