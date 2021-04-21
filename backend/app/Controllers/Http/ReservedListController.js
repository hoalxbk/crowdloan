'use strict'

const ReservedListService = use('App/Services/ReservedListService')
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');

class ReservedListController {

  async getReservedList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    console.log(`start getReservedList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      // get from redis cached
      let redisKey = 'reserved_' + campaign_id;
      if (page) {
        redisKey = redisKey.concat('_', page, '_', pageSize);
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
      const reservedListService = new ReservedListService();
      // get winner list
      const whitelist = await reservedListService.findByCampaign(filterParams);
      // save to redis
      await Redis.set(redisKey, JSON.stringify(whitelist));
      return HelperUtils.responseSuccess(whitelist);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Reserved List Failed !');
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
      const reservedListService = new ReservedListService();
      const result = await reservedListService.search(searchParams);
      return HelperUtils.responseSuccess(result);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Find Reserved Error !');
    }
  }

  async create({request}) {
    // get request params
    const createParams = {
      'campaign_id': request.params.campaignId,
      'email': request.params.email,
      'wallet_address': request.params.wallet_address,
      'start_time': request.params.start_time,
      'end_time': request.params.end_time,
      'min_buy': request.params.min_buy,
      'max_buy': request.params.max_buy
    }
    try {
      const reservedListService = new ReservedListService();
      const result = await reservedListService.create(createParams);
      return HelperUtils.responseSuccess(result);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Insert New Reserved Error !');
    }
  }


  async deleteReserve({request, params}) {
    console.log('[deleteReserve] - Delete Winner with params: ', params, request.params);

    const { campaignId, walletAddress } = params;
    const reservedService = new ReservedListService();
    const existRecord = await reservedService.buildQueryBuilder({
      campaign_id: campaignId,
      wallet_address: walletAddress,
    }).first();
    if (existRecord) {
      await existRecord.delete();
    }
    console.log('existRecord', existRecord);

    return HelperUtils.responseSuccess(existRecord);
  }

}

module.exports = ReservedListController
