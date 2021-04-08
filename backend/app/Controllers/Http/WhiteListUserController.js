'use strict'

const WhitelistService = use('App/Services/WhitelistUserService')
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');

class WhiteListUserController {
  async getWhiteList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    console.log(`start getWhiteList with campaign_id ${campaign_id}`);
    try {
      // get from redis cached
      const redisKey = 'whitelist_' + campaign_id;
      if (Redis.exists(redisKey)) {
        console.log(`existed key ${redisKey} on redis`);
        const cachedWL = await Redis.get(redisKey);
        return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      }
      // if not existed whitelist on redis then get from db
      const filterParams = {
        'campaign_id': campaign_id
      };
      const whitelistService = new WhitelistService();
      // get winner list
      const whitelist = await whitelistService.findWhitelistUser(filterParams);
      // save to redis
      await Redis.set(redisKey, JSON.stringify(whitelist));
      return HelperUtils.responseSuccess(whitelist);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Whitelist Failed !');
    }
  }
}

module.exports = WhiteListUserController
