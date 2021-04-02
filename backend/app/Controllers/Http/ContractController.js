'use strict'
const Const = use('App/Common/Const');
const ContractLogModel = use('App/Models/ContractLog');

const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const Web3 = require('web3');
const Config = use('Config')

class ContractController {
  async campaigns( {request}) {
    const param = request.all();
    const limit = param.limit ? param.limit : Config.get('const.limit_default')
    const page = param.page ? param.page : Config.get('const.page_default')
    let dataList = ContractLogModel.query().where('contract_name', '=' ,'campaign')
    if(param.from){
      dataList = dataList.whereRaw('from', 'like', '%'+ param.from +'%')
    }
    if(param.to){
      dataList = dataList.where('to', 'like', '%'+ param.to +'%')
    }
    if(param.transaction_hash){
      dataList = dataList.where('transaction_hash', 'like', '%'+ param.transaction_hash +'%')
    }
    if(param.transaction_from){
      dataList = dataList.where('transaction_fromm', 'like', '%'+ param.transaction_from +'%')
    }
    if(param.transaction_to){
      dataList = dataList.where('transaction_to', 'like', '%'+ param.transaction_to +'%')
    }

    dataList = await dataList.orderBy('id', 'DECS').paginate(page,limit);
    return {
      status: 200,
      data: dataList,
    };
  }

  async campaignFactories( {request}) {
    const param = request.all();
    const limit = param.limit ? param.limit : Config.get('const.limit_default')
    const page = param.page ? param.page : Config.get('const.page_default')
    const dataList = await ContractLogModel.query().where('contract_name', '=' ,'CampaignFactory').paginate(page,limit);

    return {
      status: 200,
      data: dataList,
    };
  }
}

module.exports = ContractController
