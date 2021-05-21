'use strict'

const WinnerListService = use('App/Services/WinnerListUserService')
const ReservedListService = use('App/Services/ReservedListService')
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');
const WhitelistModel = use('App/Models/WhitelistUser');
const WinnerListModel = use('App/Models/WinnerListUser');

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
        redisKey = redisKey.concat('_', page, '_', pageSize);
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

  async getWinnerAndReserveList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page') || 1;
    const limit = request.input('limit') || 10;

    try {
      const winners = await WinnerListModel.query()
        .select('wallet_address', 'email', 'campaign_id')
        .where('campaign_id', campaign_id)
        .unionAll((query) => {
          query.select('wallet_address', 'email', 'campaign_id').from('reserved_list')
            .where('campaign_id', campaign_id)
        })
        .fetch();
      console.log('Mix Winners + Reserves User: ', JSON.stringify(winners));
      const paginationData = HelperUtils.paginationArray(winners, page, limit);

      return HelperUtils.responseSuccess(paginationData);
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
      'search': request.input('search'),
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
    try {
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
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async deleteWinner({request, params}) {
    try {
      console.log('[deleteWinner] - Delete Winner with params: ', params, request.params);
      const {campaignId, walletAddress} = params;
      const winnerService = new WinnerListService();
      const existRecord = await winnerService.buildQueryBuilder({
        campaign_id: campaignId,
        wallet_address: walletAddress,
      }).first();
      if (existRecord) {
        await existRecord.delete();
      }
      console.log('existRecord', existRecord);

      return HelperUtils.responseSuccess(existRecord);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async addParticipantsToWinner({request, params}) {
    try {
      console.log('[addParticipantsToWinner] - Add participants to Winner with params: ', params, request.params);
      const {campaignId} = params;
      const winners = request.input('winners') || [];
      console.log('[addParticipantsToWinner] - campaignId: ', campaignId, params, request.all());

      const resExist = await WhitelistModel.query()
        .whereIn('wallet_address', winners)
        .where('campaign_id', campaignId)
        .fetch();
      console.log('resExist', resExist);

      const data = await resExist.rows.map(async item => {
        try {
          const isExist = await WinnerListModel.query()
            .where('wallet_address', item.wallet_address)
            .where('campaign_id', item.campaign_id)
            .first();
          if (isExist) {
            return item;
          }

          console.log('[addParticipantsToWinner] - User Not Exist in Winner:', item);
          const walletAddress = await HelperUtils.checkSumAddress(item.wallet_address);
          let model = new WinnerListModel;
          model.email = item.email;
          model.wallet_address = item.wallet_address;
          model.campaign_id = item.campaign_id;
          model.lottery_ticket = 1;
          model.level = (await HelperUtils.getUserTierSmart(walletAddress))[0];
          await model.save();

          return model;
        } catch (e) {
          throw e;
        }
      });

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async checkExistWinner({request, params}) {
    try {
      console.log('[checkExistWinner] - Params: ', params);

      const inputParams = request.only(['wallet_address']);
      const campaign_id = params.campaignId;
      const wallet_address = inputParams.wallet_address;

      const winnerService = new WinnerListService();
      let existRecord = await winnerService.buildQueryBuilder({
        wallet_address,
        campaign_id,
      }).first();

      if (existRecord) {
        console.log('[checkExistWinner] - Record exist in Winner: ', existRecord);
        return HelperUtils.responseSuccess(existRecord, 'User exist in Winner User List');
      }

      const reservedService = new ReservedListService();
      existRecord = await reservedService.buildQueryBuilder({
        wallet_address,
        campaign_id,
      }).first();

      if (existRecord) {
        console.log('[checkExistWinner] - Record exist in Reserved: ', existRecord);
        return HelperUtils.responseSuccess(existRecord, 'User exist in Winner User List');
      }

      return HelperUtils.responseNotFound('User not exist in Winner User List');
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }


  async checkPickedWinner({request, params}) {
    try {
      console.log('[checkPickedWinner] - Params: ', params);
      const campaign_id = params.campaignId;
      const winnerService = new WinnerListService();

      // TODO: Add to Cache
      let existRecord = await winnerService.buildQueryBuilder({ campaign_id }).first();
      if (existRecord) {
        console.log('[checkPickedWinner] - Exist Winner: ', existRecord);
        return HelperUtils.responseSuccess(true, 'Campaign picked Winner');
      }
      return HelperUtils.responseNotFound(false, 'The campaign has not yet chosen a winner');
    } catch (e) {
      console.log('[checkPickedWinner] - ERROR: ', e);
      return HelperUtils.responseErrorInternal();
    }
  }

}

module.exports = WinnerListUserController
