'use strict'

const CampaignModel = use('App/Models/Campaign');
const CampaignClaimConfigModel = use('App/Models/CampaignClaimConfig');
const TierModel = use('App/Models/Tier');
const Config = use('Config');
const Const = use('App/Common/Const');
const BigNumber = use('bignumber.js');

const CONFIGS_FOLDER = '../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_FACTORY_ABI } = CONTRACT_FACTORY_CONFIGS.CONTRACT_DATA;

class PoolService {
  buildQueryBuilder(params) {
    let builder = CampaignModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }

    if (params.title) {
      if (params.is_search) {
        builder = builder.where(query => {
          query.where('title', 'like', '%'+ params.title +'%')
            .orWhere('symbol', 'like', '%'+ params.title +'%')
            .orWhere('token', 'like', '%'+ params.title +'%')
            .orWhere('campaign_hash', 'like', '%'+ params.title +'%');

          if((params.title).toLowerCase() == Config.get('const.suspend')) {
            query.orWhere('is_pause', '=', 1)
          }
          if((params.title).toLowerCase() == Config.get('const.active')) {
            query.orWhere('is_pause', '=', 0)
          }
        })
      } else {
        builder = builder.where('title', params.title);
      }
    }

    if(params.start_time && !params.finish_time) {
      builder = builder.where('start_time', '>=', params.start_time)
    }
    if(params.finish_time && !params.start_time ) {
      builder = builder.where('finish_time', '<=', params.finish_time)
    }
    if(params.finish_time && params.start_time ) {
      builder = builder.where('finish_time', '<=', params.finish_time)
        .where('start_time', '>=', params.start_time)
    }
    if(params.registed_by){
      builder = builder.where('registed_by', '=', params.registed_by)
    }

    if (params.is_display === undefined) {
      builder = builder.where('is_display', '=', Const.POOL_DISPLAY.DISPLAY);
    } else {
      builder = builder.where('is_display', '=', params.is_display);
    }

    return builder;
  }

  buildSearchQuery(params) {
    return this.buildQueryBuilder({
      ...params,
      is_search: true,
    })
  }

  getPoolWithTiers(filterParams) {
    const pool = this.buildQueryBuilder(filterParams).with('tiers').first();
    return pool;
  }

  getJoinedPools(walletAddress, params) {
    const query =  this.buildSearchQuery(params);
    query.whereHas('whitelistUsers',(builder) => {
      builder.where('wallet_address', walletAddress);
    }, '>', 0);
    return query;
  }

  checkExist(campaignId) {

  }

  updatePoolAdmin() {

  }

  addDefaultClaimConfig(claim_configuration, release_time) {
    let claimConfigs = claim_configuration || [];
    if (claimConfigs.length == 0) {
      claimConfigs = [{
        minBuy: 0,
        maxBuy: 100,
        endTime: null,
        startTime: release_time,
      }];
    }
    return claimConfigs
  }

  async updateClaimConfig(campaign, claim_configuration) {
    const campaignClaimConfigs = claim_configuration.map((item, index) => {
      const tierObj = new CampaignClaimConfigModel();
      tierObj.fill({
        start_time: item.startTime,
        end_time: item.endTime,
        min_percent_claim: new BigNumber(item.minBuy || 0).toFixed(),
        max_percent_claim: new BigNumber(item.maxBuy || 0).toFixed(),
      });
      return tierObj;
    });

    await campaign.campaignClaimConfig().delete();
    await campaign.campaignClaimConfig().saveMany(campaignClaimConfigs);
  }

  async updateTierConfig(campaign, tier_configuration) {
    const tiers = tier_configuration.map((item, index) => {
      const tierObj = new TierModel();
      tierObj.fill({
        level: index,
        name: item.name,
        // start_time: moment.utc(item.startTime).unix(),
        // end_time: moment.utc(item.endTime).unix(),
        start_time: item.startTime,
        end_time: item.endTime,

        min_buy: new BigNumber(item.minBuy || 0).toFixed(),
        max_buy: new BigNumber(item.maxBuy || 0).toFixed(),
        ticket_allow: new BigNumber(item.ticket_allow || 0).toFixed(),
        currency: item.currency,
      });
      return tierObj;
    });
    await campaign.tiers().delete();
    await campaign.tiers().saveMany(tiers);

    console.log('inputParams.tier_configuration', JSON.stringify(tiers));
  }

}

module.exports = PoolService;
