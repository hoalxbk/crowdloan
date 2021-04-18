'use strict'

const CampaignModel = use('App/Models/Campaign');
const WalletAccountModel = use('App/Models/WalletAccount');
const Tier = use('App/Models/Tier');
const WalletAccountService = use('App/Services/WalletAccountService');
const Const = use('App/Common/Const');
const PoolService = use('App/Services/PoolService');
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
    const inputParams = request.only([
      'register_by',
      'title', 'website', 'banner', 'description', 'address_receiver',
      'token', 'token_by_eth', 'token_images', 'total_sold_coin',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type',
      'min_tier', 'tier_configuration',
    ]);

    const data = {
      'title': inputParams.title,
      'website': inputParams.website,
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

    console.log('Create Pool with data: ', data);

    try {
      const campaign = new CampaignModel();
      campaign.fill(data);
      await campaign.save();

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
      await campaign.tiers().saveMany(tiers);

      console.log('inputParams.tier_configuration', JSON.stringify(tiers));

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
      'title', 'website', 'banner', 'description', 'address_receiver',
      'token', 'token_by_eth', 'token_conversion_rate', 'token_images', 'total_sold_coin',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type',
      'min_tier', 'tier_configuration',
      // 'is_deploy',
    ]);

    const data = {
      'title': inputParams.title,
      'website': inputParams.website,
      'description': inputParams.description,
      'token': inputParams.token,
      'start_time': inputParams.start_time,
      'finish_time': inputParams.finish_time,
      'ether_conversion_rate': inputParams.token_by_eth,
      'token_conversion_rate': inputParams.token_conversion_rate,

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
          min_buy: item.minBuy,
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

  async changeDisplay({ request, auth, params }) {
    const inputParams = request.only([
      'is_display'
    ]);

    console.log('Update Change Display with data: ', inputParams);
    const campaignId = params.campaignId;
    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', campaignId).update({
        is_display: inputParams.is_display,
      });

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);

      return HelperUtils.responseSuccess();
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

      const walletAccount = await WalletAccountModel.query().where('campaign_id', poolId).first();
      pool.wallet = {
        id: walletAccount.id,
        wallet_address: walletAccount.wallet_address,
      };

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
    param.is_display = false;
    param.is_search = true;
    console.log('Start Pool List with params: ', param);

    try {
      // if (await RedisUtils.checkExistRedisPoolList(param)) {
      //   const cachedPoolDetail = await RedisUtils.getRedisPoolList(param);
      //   console.log('Exist cache data Public Pool List: ', cachedPoolDetail);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      // }

      let listData = (new PoolService).buildSearchQuery(param);
      listData = listData.orderBy('id', 'DESC');
      listData = await listData.paginate(page,limit);

      // Cache data
      RedisUtils.createRedisPoolList(param, listData);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal(e.message);
    }


  }

}

module.exports = PoolController
