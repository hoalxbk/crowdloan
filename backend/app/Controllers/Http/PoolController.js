'use strict'

const CampaignModel = use('App/Models/Campaign');
const WalletAccountModel = use('App/Models/WalletAccount');
const WalletAccountService = use('App/Services/WalletAccountService');
const Const = use('App/Common/Const');
const PoolService = use('App/Services/PoolService');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');

const Redis = use('Redis');
const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_FACTORY_ABI } = CONTRACT_FACTORY_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_ERC20_ABI } = require('../../../blockchain_configs/contracts/Normal/Erc20.json');

const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const Config = use('Config')
const moment = require('moment');
const BigNumber = use('bignumber.js');
const {pick} = require('lodash');

class PoolController {

  async createPool({request, auth}) {
    const inputParams = request.only([
      'registed_by',
      'title', 'website', 'banner', 'description', 'address_receiver',
      'token', 'token_images', 'total_sold_coin',
      'token_by_eth',  'token_conversion_rate', 'price_usdt', 'display_price_rate',
      'tokenInfo',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type',
      'min_tier', 'tier_configuration', 'claim_configuration',
    ]);

    const tokenInfo = inputParams.tokenInfo;
    const data = {
      'registed_by': inputParams.registed_by,

      'title': inputParams.title,
      'website': inputParams.website,
      'description': inputParams.description,
      // 'token': inputParams.token,
      'start_time': inputParams.start_time,
      'finish_time': inputParams.finish_time,
      'ether_conversion_rate': inputParams.token_by_eth,
      'token_conversion_rate': inputParams.token_conversion_rate,
      'price_usdt': inputParams.price_usdt,
      'display_price_rate': inputParams.display_price_rate,

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

      'is_display': false,  // Default is hidden

      'symbol': tokenInfo && tokenInfo.symbol,
      'name': tokenInfo && tokenInfo.name,
      'decimals': tokenInfo && tokenInfo.decimals,
      'token': tokenInfo && tokenInfo.address,
    };
    console.log('Create Pool with data: ', data);

    try {
      // Create Pool
      const poolService = new PoolService;
      const campaign = new CampaignModel();
      campaign.fill(data);
      await campaign.save();

      // Update Claim Config
      let claimConfigs = inputParams.claim_configuration || [];
      claimConfigs = poolService.addDefaultClaimConfig(claimConfigs, campaign.release_time);
      console.log('[createPool] - Update Claim Config - claimConfigs', claimConfigs);
      await poolService.updateClaimConfig(campaign, claimConfigs);

      // Update Tier Config
      console.log('[createPool] - Update Tier Config - inputParams.tier_configuration', inputParams.tier_configuration);
      await poolService.updateTierConfig(campaign, inputParams.tier_configuration || []);

      // Create Web3 Account
      const campaignId = campaign.id;
      const account = await (new WalletAccountService).createWalletAddress(campaignId);
      console.log('[createPool] - Create Walllet Account:', account.wallet_address);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async updatePool({ request, auth, params }) {
    const inputParams = request.only([
      'registed_by',
      'title', 'website', 'banner', 'description', 'address_receiver',
      'token', 'token_images', 'total_sold_coin',
      'token_by_eth',  'token_conversion_rate', 'price_usdt', 'display_price_rate',
      'tokenInfo',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type',
      'min_tier', 'tier_configuration', 'claim_configuration',
    ]);

    const tokenInfo = inputParams.tokenInfo;
    const data = {
      'registed_by': inputParams.registed_by,

      'title': inputParams.title,
      'website': inputParams.website,
      'description': inputParams.description,
      'start_time': inputParams.start_time,
      'finish_time': inputParams.finish_time,
      'ether_conversion_rate': inputParams.token_by_eth,
      'token_conversion_rate': inputParams.token_conversion_rate,
      'price_usdt': inputParams.price_usdt,
      'display_price_rate': inputParams.display_price_rate,

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

      'symbol': tokenInfo && tokenInfo.symbol,
      'name': tokenInfo && tokenInfo.name,
      'decimals': tokenInfo && tokenInfo.decimals,
      'token': tokenInfo && tokenInfo.address,
    };

    console.log('[updatePool] - tokenInfo:', inputParams.tokenInfo);
    console.log('[updatePool] - Update Pool with data: ', data, params);
    const campaignId = params.campaignId;
    try {
      const poolService = new PoolService;
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', campaignId).update(data);

      // Update Claim Config
      await poolService.updateClaimConfig(campaign, inputParams.claim_configuration || []);

      // Update Tier Config
      if (!campaign.is_deploy) {
        await poolService.updateTierConfig(campaign, inputParams.tier_configuration || []);
      }

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);
      RedisUtils.deleteRedisTierList(campaignId);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async updateDeploySuccess({ request, auth, params }) {
    const inputParams = request.only([
      'campaign_hash', 'token_symbol', 'token_name', 'token_decimals', 'token_address',
    ]);

    console.log('Update Deploy Success with data: ', inputParams);
    const campaignId = params.campaignId;
    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      campaign.is_deploy = true;
      campaign.campaign_hash = inputParams.campaign_hash;
      campaign.token = inputParams.token_address;
      campaign.name = inputParams.token_name;
      campaign.symbol = inputParams.token_symbol;
      campaign.decimals = inputParams.token_decimals;
      campaign.save();

      console.log('[updateDeploySuccess] - CAMPAIGN: ', campaign);
      // const camp = await CampaignModel.query().where('id', campaignId).update({
      //   is_deploy: true,
      //   campaign_hash: inputParams.campaign_hash,
      //   token: inputParams.token_address,
      //   name: inputParams.name,
      //   symbol: inputParams.symbol,
      //   decimals: inputParams.decimals,
      // });

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
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
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPoolAdmin({ request, auth, params }) {
    const poolId = params.campaignId;
    console.log('Start getPool (Admin) with poolId: ', poolId);
    try {
      let pool = await CampaignModel.query().with('tiers').with('campaignClaimConfig').where('id', poolId).first();
      if (!pool) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      pool = JSON.parse(JSON.stringify(pool));
      console.log('[getPool] - pool.tiers: ', pool.tiers);
      if (pool.tiers && pool.tiers.length > 0) {
        pool.tiers = pool.tiers.map((item, index) => {
          return {
            ...item,
            min_buy: (new BigNumber(item.min_buy)).toNumber(),
            max_buy: (new BigNumber(item.max_buy)).toNumber(),
          }
        });
      }

      const walletAccount = await WalletAccountModel.query().where('campaign_id', poolId).first();
      if (walletAccount) {
        pool.wallet = {
          id: walletAccount.id,
          wallet_address: walletAccount.wallet_address,
        };
      }

      // Cache data
      RedisUtils.createRedisPoolDetail(poolId, pool);

      return HelperUtils.responseSuccess(pool);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPoolPublic({ request, auth, params }) {
    const poolId = params.campaignId;
    console.log('[getPublicPool] - Start getPublicPool with poolId: ', poolId);
    try {
      if (await RedisUtils.checkExistRedisPoolDetail(poolId)) {
        const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(poolId);
        console.log('Exist cache data Public Pool Detail: ', cachedPoolDetail);
        return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      }

      let pool = await CampaignModel.query().with('tiers').where('id', poolId).first();
      if (!pool) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      pool = JSON.parse(JSON.stringify(pool));

      const publicPool = pick(pool, [
        // Pool Info
        'id', 'title', 'website', 'banner', 'updated_at', 'created_at',
        'campaign_hash', 'campaign_id', 'description', 'registed_by', 'register_by',

        // Types
        'buy_type', 'accept_currency', 'min_tier', 'network_available', 'pool_type', 'is_deploy', 'is_display', 'is_pause',

        // Time
        'release_time', 'start_join_pool_time', 'start_time', 'end_join_pool_time', 'finish_time',

        // Token Info
        'name', 'symbol', 'decimals', 'token', 'token_images', 'total_sold_coin',
        'token_conversion_rate', 'ether_conversion_rate',
        'price_usdt', 'display_price_rate',
      ]);

      console.log('[getPublicPool] - pool.tiers: ', pool.tiers);
      if (pool.tiers && pool.tiers.length > 0) {
        publicPool.tiers = pool.tiers.map((item, index) => {
          return {
            ...item,
            min_buy: (new BigNumber(item.min_buy)).toNumber(),
            max_buy: (new BigNumber(item.max_buy)).toNumber(),
          }
        });
      }

      // Cache data
      RedisUtils.createRedisPoolDetail(poolId, publicPool);

      return HelperUtils.responseSuccess(publicPool);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get public pool fail !');
    }
  }

  async getPoolList({request}) {
    const param = request.all();
    const limit = param.limit ? param.limit : Config.get('const.limit_default');
    const page = param.page ? param.page : Config.get('const.page_default');
    param.limit = limit;
    param.page = page;
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

      // // Cache data
      // RedisUtils.createRedisPoolList(param, listData);

      // console.log('listData:======>', JSON.stringify(listData));

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal('Get Pools Fail !!!');
    }
  }

  async getTopPools({request}) {
    const inputParams = request.all();
    const limit = inputParams.limit ? inputParams.limit : Config.get('const.limit_default');
    const page = inputParams.page ? inputParams.page : Config.get('const.page_default');
    inputParams.limit = limit;
    inputParams.page = page;
    inputParams.is_search = true;
    console.log('[getTopPools] - inputParams: ', inputParams);

    try {
      let listData = (new PoolService).buildSearchQuery(inputParams);
      listData = listData.orderBy('created_at', 'DESC');
      listData = await listData.paginate(page,limit);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Top Pools Fail !!!');
    }
  }

  async getJoinedPools({ request, params }) {
    const inputParams = request.all();
    const limit = inputParams.limit ? inputParams.limit : Config.get('const.limit_default');
    const page = inputParams.page ? inputParams.page : Config.get('const.page_default');
    inputParams.limit = limit;
    inputParams.page = page;
    inputParams.is_search = true;
    console.log('[getJoinedPools] - inputParams: ', inputParams);

    const walletAddress = params.walletAddress;
    try {
      let listData = (new PoolService).getJoinedPools(walletAddress, inputParams);
      listData = listData.orderBy('created_at', 'DESC');
      listData = await listData.paginate(page,limit);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Joined Pool Fail !!!');
    }
  }

}

module.exports = PoolController
