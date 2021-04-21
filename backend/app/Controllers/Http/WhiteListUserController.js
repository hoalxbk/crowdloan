'use strict'

const WhitelistService = use('App/Services/WhitelistUserService')
const WinnerListService = use('App/Services/WinnerListUserService')
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
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWL = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      // }
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
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWL = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      // }
      // if not existed whitelist on redis then get from db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize,
        'search_term': request.input('search_term') || '',
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

  async deleteWhiteList({request, params}) {
    console.log('[deleteWhiteList] - Delete WhiteList with params: ', params, request.params);

    const { campaignId, walletAddress } = params;
    const whitelistService = new WhitelistService();
    const existRecord = await whitelistService.buildQueryBuilder({
      campaign_id: campaignId,
      wallet_address: walletAddress,
    }).first();
    if (existRecord) {
      await existRecord.delete();
    }
    console.log('existRecord', existRecord);

    return HelperUtils.responseSuccess(existRecord);
  }

  async getRandomWinners({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const num = request.params.number;
    if (isNaN(Number(campaign_id)) || isNaN(Number(num))) {
      return HelperUtils.responseBadRequest(`Bad request params with campaignId ${campaign_id} and number ${num}`)
    }
    try {
      const whitelistService = new WhitelistService();
      const winnerList = await whitelistService.getRandomWinners(num, campaign_id);
      // save to winner list
      const winnerListService = new WinnerListService();
      winnerListService.save(winnerList);
      return HelperUtils.responseSuccess(winnerList);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Random Winners Failed !');
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
      const whitelistService = new WhitelistService();
      const result = await whitelistService.search(searchParams);
      return HelperUtils.responseSuccess(result);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Find Whitelist Error !');
    }
  }

  async addWhitelistUser({request}) {
    const inputParams = request.only(['wallet_address', 'email', 'campaign_id']);
    const params = {
      wallet_address: inputParams.wallet_address,
      email: inputParams.email,
      campaign_id: inputParams.campaign_id,
    };
    const whitelistService = new WhitelistService();
    const user = await whitelistService.buildQueryBuilder({
      wallet_address: inputParams.wallet_address,
      campaign_id: inputParams.campaign_id,
    }).first();
    console.log('user', user);

    if (user) {
      return HelperUtils.responseBadRequest('User Exist !');
    }
    const res = await whitelistService.addWhitelistUser(params);

    return HelperUtils.responseSuccess(res);
  }

}

module.exports = WhiteListUserController
