'use strict'

const CampaignModel = use('App/Models/Campaign');
const Tier = use('App/Models/Tier');
const WalletAccountService = use('App/Services/WalletAccountService');
const Const = use('App/Common/Const');
const CampaignService = use('App/Services/CampaignService');
const Common = use('App/Common/Common');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');

const Redis = use('Redis');
const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_FACTORY_ABI } = CONTRACT_FACTORY_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_ERC20_ABI } = require('../../../blockchain_configs/contracts/Erc20.json');

const Web3 = require('web3');
const BadRequestException = require("../../Exceptions/BadRequestException");
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const Config = use('Config')
const ErrorFactory = use('App/Common/ErrorFactory');
const moment = require('moment');

class PoolController {

  async createPool({request, auth}) {
    const params = request.only([
      'register_by',
      'title', 'banner', 'description', 'address_receiver',
      'token', 'token_by_eth', 'token_images', 'total_sold_coin',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type',
      'min_tier', 'tier_configuration',
    ]);

    const data = {
      'title': params.title,
      'description': params.description,
      'token': params.token,
      'start_time': params.start_time,
      'finish_time': params.finish_time,
      'ether_conversion_rate': params.token_by_eth,

      'banner': params.banner,
      'address_receiver': params.address_receiver,
      'token_images': params.token_images,
      'total_sold_coin': params.total_sold_coin,
      'release_time': params.release_time,
      'start_join_pool_time': params.start_join_pool_time,
      'end_join_pool_time': params.end_join_pool_time,
      'accept_currency': params.accept_currency,
      'network_available': params.network_available,
      'buy_type': params.buy_type,
      'pool_type': params.pool_type,
      'min_tier': params.min_tier,
    };

    console.log('Create Pool with data: ', data);

    try {
      const campaign = new CampaignModel();
      campaign.fill(data);
      await campaign.save();

      const tiers = (params.tier_configuration || []).map((item, index) => {
        const tierObj = new Tier();
        tierObj.fill({
          level: (index + 1),
          name: item.name,
          start_time: moment(item.startTime).unix(),
          end_time: moment(item.endTime).unix(),
          max_buy: item.maxBuy,
          currency: item.currency,
        });
        return tierObj;
      });
      await campaign.tiers().saveMany(tiers);

      console.log('params.tier_configuration', tiers);

      const campaignId = campaign.id;
      // Create Web3 Account
      const account = await (new WalletAccountService).createWalletAddress(campaignId);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('ERROR', e);
      return ErrorFactory.internal('error')
    }
  }

  async updatePool({ request, auth, params }) {
    const inputParams = request.only([
      'register_by',
      'title', 'banner', 'description', 'address_receiver',
      'token', 'token_by_eth', 'token_images', 'total_sold_coin',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type',
      'min_tier', 'tier_configuration',
      // 'is_deploy',
    ]);

    const data = {
      'title': inputParams.title,
      'description': inputParams.description,
      'token': inputParams.token,
      'start_time': inputParams.start_time,
      'finish_time': inputParams.finish_time,
      'ether_conversion_rate': inputParams.token_by_eth,

      'banner': inputParams.banner,
      'address_receiver': inputParams.address_receiver,
      'token_images': inputParams.token_images,
      'total_sold_coin': inputParams.total_sold_coin,
      'release_time': inputParams.release_time,
      'start_join_pool_time': inputParams.start_join_pool_time,
      'end_join_pool_time': inputParams.end_join_pool_time,
      'accept_currency': inputParams.accept_currency,
      'network_available': inputParams.network_available,
      'buy_type': inputParams.buy_type,
      'pool_type': inputParams.pool_type,
      'min_tier': inputParams.min_tier,
    };

    // if (!inputParams.is_deploy) {
    //   data.is_deploy = inputParams.is_deploy;
    // }

    console.log('Update Pool with data: ', data, params);
    const campaignId = params.campaignId;
    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', campaignId).update(data);

      const tiers = (inputParams.tier_configuration || []).map((item, index) => {
        const tierObj = new Tier();
        tierObj.fill({
          level: (index + 1),
          name: item.name,
          start_time: moment(item.startTime).unix(),
          end_time: moment(item.endTime).unix(),
          max_buy: item.maxBuy,
          currency: item.currency,
        });
        return tierObj;
      });
      const campaignUpdated = await CampaignModel.query().where('id', campaignId).first();
      await campaignUpdated.tiers().delete();
      await campaignUpdated.tiers().saveMany(tiers);

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);
      RedisUtils.deleteRedisTierList(campaignId);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('ERROR', e);
      return ErrorFactory.internal('error');
    }
  }

  async updateDeploySuccess({ request, auth, params }) {
    const inputParams = request.only([
      'campaign_hash', 'token_symbol',
    ]);

    console.log('Update Deploy Success with data: ', inputParams);
    const campaignId = params.campaignId;
    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', campaignId).update({
        is_deploy: true,
        campaign_hash: inputParams.campaign_hash,
        token: inputParams.token_symbol,
      });

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('ERROR', e);
      return ErrorFactory.internal('error');
    }
  }


  async getPool({ request, auth, params }) {
    const poolId = params.campaignId;
    console.log('Start getPool with poolId: ', poolId);
    try {
      if (await RedisUtils.checkExistRedisPoolDetail(poolId)) {
        const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(poolId);
        console.log('Exist cache data Public Pool Detail: ', cachedPoolDetail);
        return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      }

      const pool = await CampaignModel.query()
        .with('tiers')
        .where('id', poolId)
        .first();

      // Cache data
      RedisUtils.createRedisPoolDetail(poolId, pool);

      return HelperUtils.responseSuccess(pool);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

  async getPoolList({request}) {
    const param = request.all();
    const limit = param.limit ? param.limit : Config.get('const.limit_default');
    const page = param.page ? param.page : Config.get('const.page_default');
    param.limit = limit;
    param.page = page;
    console.log('Start Pool List with params: ', param);

    try {
      // console.log(await RedisUtils.checkExistRedisPoolList(param));
      // console.log('9999999');

      if (await RedisUtils.checkExistRedisPoolList(param)) {
        const cachedPoolDetail = await RedisUtils.getRedisPoolList(param);
        console.log('Exist cache data Public Pool List: ', cachedPoolDetail);
        return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      }

      const filter = {};
      let listData = CampaignModel.query().orderBy('id', 'DESC');
      if(param.title) {
        listData =  listData.where(builder => {
          builder.where('title', 'like', '%'+ param.title +'%')
            .orWhere('symbol', 'like', '%'+ param.title +'%')
          if((param.title).toLowerCase() == Config.get('const.suspend')){
            builder.orWhere('is_pause', '=', 1)
          }
          if((param.title).toLowerCase() == Config.get('const.active')){
            builder.orWhere('is_pause', '=', 0)
          }
        })
      }
      if(param.start_time && !param.finish_time) {
        listData = listData.where('start_time', '>=', param.start_time)
      }
      if(param.finish_time && !param.start_time ) {
        listData = listData.where('finish_time', '<=', param.finish_time)
      }
      if(param.finish_time && param.start_time ) {
        listData = listData.whereRaw('finish_time <=' + param.finish_time)
          .whereRaw('start_time >=' + param.start_time)
      }
      if(param.registed_by){
        listData = listData.where('registed_by', '=', param.registed_by)
      }
      listData = await listData.paginate(page,limit);

      // Cache data
      RedisUtils.createRedisPoolList(param, listData);

      return HelperUtils.responseSuccess(listData);

      // return {
      //   status: 200,
      //   data: listData,
      // }

    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal(e.message);
    }


  }

}

module.exports = PoolController
