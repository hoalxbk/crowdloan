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
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWinners = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWinners));
      // }
      // if not existed winners on redis then get from db
      // create params to query to db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize,
        'search_term': request.input('search_term') || '',
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


  async addWinnerUser({request}) {
    const inputParams = request.only(['wallet_address', 'email', 'campaign_id']);
    const params = {
      wallet_address: inputParams.wallet_address,
      email: inputParams.email,
      campaign_id: inputParams.campaign_id,
    };
    const winnerListService = new WinnerListService();
    const user = await winnerListService.buildQueryBuilder({
      wallet_address: inputParams.wallet_address,
      campaign_id: inputParams.campaign_id,
    }).first();
    console.log('user', user);

    if (user) {
      return HelperUtils.responseBadRequest('User Exist !');
    }
    const res = await winnerListService.addWinnerListUser(params);

    return HelperUtils.responseSuccess(res);
  }

}

module.exports = WinnerListUserController
