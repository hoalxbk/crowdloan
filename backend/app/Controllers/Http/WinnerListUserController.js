'use strict'

const WinnerListService = use('App/Services/WinnerListUserService')
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');

class WinnerListUserController {
  async getWinnerList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    console.log(`start getWinnerList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      // get from redis cached
      let redisKey = 'winners_' + campaign_id;
      if (page) {
        redisKey = redisKey.concat('_',page,'_',pageSize);
      }
      if (await Redis.exists(redisKey)) {
        console.log(`existed key ${redisKey} on redis`);
        const cachedWinners = await Redis.get(redisKey);
        return HelperUtils.responseSuccess(JSON.parse(cachedWinners));
      }
      // if not existed winners on redis then get from db
      // create params to query to db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize
      };
      const winnerListService = new WinnerListService();
      // get winner list
      const winners = await winnerListService.findWinnerListUser(filterParams);
      // save to redis
      await Redis.set(redisKey, JSON.stringify(winners))
      return HelperUtils.responseSuccess(winners);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Winner List Failed !');
    }
  }

  async search({request}) {
    // get request params
    const searchParams = {
      'campaign_id': request.params.campaignId,
      'email': request.input('email'),
      'wallet_address': request.input('wallet_address'),
      'page': request.input('page'),
      'pageSize': request.input('limit') ? request.input('limit') : 10
    }
    try {
      const winnerListService = new WinnerListService();
      const result = await winnerListService.search(searchParams);
      return HelperUtils.responseSuccess(result);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Find Whitelist Error !');
    }
  }
}

module.exports = WinnerListUserController
