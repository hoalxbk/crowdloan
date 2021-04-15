'use strict'

const WhitelistService = use('App/Services/WhitelistUserService')
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');

class WhiteListUserController {
  async getWhiteList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    console.log(`start getWhiteList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      // get from redis cached
      let redisKey = 'whitelist_' + campaign_id;
      if (page) {
        redisKey = redisKey.concat('_',page,'_',pageSize);
      }
      if (await Redis.exists(redisKey)) {
        console.log(`existed key ${redisKey} on redis`);
        const cachedWL = await Redis.get(redisKey);
        return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      }
      // if not existed whitelist on redis then get from db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize
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

  async getParticipants({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    console.log(`start getWhiteList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      // get from redis cached
      let redisKey = 'whitelist_' + campaign_id;
      if (page) {
        redisKey = redisKey.concat('_',page,'_',pageSize);
      }
      if (await Redis.exists(redisKey)) {
        console.log(`existed key ${redisKey} on redis`);
        const cachedWL = await Redis.get(redisKey);
        return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      }
      // if not existed whitelist on redis then get from db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize
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
