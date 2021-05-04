'use strict'

const TierModel = use('App/Models/Tier');
const CampaignModel = use('App/Models/Campaign');
const WhitelistService = use('App/Services/WhitelistUserService')
const TierService = use('App/Services/TierService');
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');

const PickRandomWinnerJob = use('App/Jobs/PickRandomWinnerJob')

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
    const total_ticket = request.params.number;
    console.log(`Pick random winner with campaign ${campaign_id} and total ticket ${total_ticket}`);
    try {
      // get tier setting from db
      const tierService = new TierService();
      const oldTiers = await tierService.findAllByFilter({'campaign_id': campaign_id});
      if (oldTiers === undefined || oldTiers.length == 0) {
        console.log(`Do not found tiers with campaign ${campaign_id}`);
        return HelperUtils.responseBadRequest('Do not found tiers with campaign request');
      }
      // calc number of ticket allowance for each tier then save to db
      const newTiers = oldTiers.toJSON().map((item, index) => {
        const tierObj = new TierModel();
        tierObj.fill({
          level: item.level,
          name: item.name,
          start_time: item.start_time,
          end_time: item.end_time,
          min_buy: item.min_buy,
          max_buy: item.max_buy,
          ticket_allow_percent: item.ticket_allow_percent,
          ticket_allow : Math.floor(total_ticket * item.ticket_allow_percent/100)
        });
        return tierObj;
      });
      // save to db
      const campaignUpdated = await CampaignModel.query().where('id', campaign_id).first();
      await campaignUpdated.tiers().delete();
      await campaignUpdated.tiers().saveMany(newTiers);

      const randomData = newTiers.map(item => {
        const tierObj = {
          level: item.level,
          ticket_allow: item.ticket_allow
        };
        return tierObj;
      });
      // dispatch to job to pick random user
      PickRandomWinnerJob.doDispatch(randomData);
      return HelperUtils.responseSuccess(null, "Pickup random winner successful !")
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
    console.log('[addWhitelistUser] - user: ', user);

    if (user) {
      return HelperUtils.responseBadRequest('User Exist !');
    }
    const res = await whitelistService.addWhitelistUser(params);

    return HelperUtils.responseSuccess(res);
  }

}

module.exports = WhiteListUserController
