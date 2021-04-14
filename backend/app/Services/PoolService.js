'use strict'

const CampaignModel = use('App/Models/Campaign');
const Config = use('Config');
const Const = use('App/Common/Const');

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
            .orWhere('symbol', 'like', '%'+ params.title +'%');

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
      builder = builder.whereRaw('finish_time <=' + params.finish_time)
        .whereRaw('start_time >=' + params.start_time)
    }
    if(params.registed_by){
      builder = builder.where('registed_by', '=', params.registed_by)
    }
    if(params.is_display !== undefined){
      builder = builder.where('is_display', '=', params.is_display)
    }

    return builder;
  }

  buildSearchQuery(params) {
    return this.buildQueryBuilder({
      ...params,
      is_search: true,
    })
  }

  // buildSearchQueryWithTitle(query, searchQueryText) {
  //   return query.where((q) => {
  //     q.where('email', 'like', `%${searchQueryText}%`)
  //       .orWhere('wallet_address', 'like', `%${searchQueryText}%`)
  //       .orWhere('username', 'like', `%${searchQueryText}%`);
  //   })
  // }

}

module.exports = PoolService;
