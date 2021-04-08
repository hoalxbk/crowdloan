'use strict'

const WinnerListService = use('App/Services/WinnerListUserService')
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');

class WinnerListUserController {
  async getWinnerList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    console.log(`start getWinnerList with campaign_id ${campaign_id}`);
    try {
      // get from redis cached
      const redisKey = 'winners_' + campaign_id;
      if (Redis.exists(redisKey)) {
        console.log(`existed key ${redisKey} on redis`);
        const cachedWinners = await Redis.get(redisKey);
        return HelperUtils.responseSuccess(JSON.parse(cachedWinners));
      }
      // if not existed winners on redis then get from db
      // create params to query to db
      const filterParams = {
        'campaign_id': campaign_id
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
}

module.exports = WinnerListUserController
