'use strict'

const CampaignModel = use('App/Models/Campaign');
const WhitelistModel = use('App/Models/WhitelistUser');
const Config = use('Config');
const Const = use('App/Common/Const');
const ErrorFactory = use('App/Common/ErrorFactory');
const BigNumber = use('bignumber.js');
const CheckTxStatus = use('App/Jobs/CheckTxStatus');
const Redis = use('Redis');

const CONFIGS_FOLDER = '../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_FACTORY_ABI } = CONTRACT_FACTORY_CONFIGS.CONTRACT_DATA;

class CampaignService {
    async createCampaign(param, receipt, receiptData) {
        const campaign = new CampaignModel();
        campaign.campaign_id = param.params.poolId;
        campaign.registed_by = param.params.registedBy;
        campaign.campaign_hash    = param.params.pool;
        campaign.token       = param.params.token;
        campaign.title        = receipt[2]
        campaign.start_time  = receipt[0];
        campaign.finish_time = receipt[1];
        campaign.token_conversion_rate = receipt[3];
        campaign.ether_conversion_rate =  new BigNumber(receipt[4]).dividedBy(Math.pow(10, receipt[5])).toFixed();
        campaign.name = receiptData[0];
        campaign.decimals = receiptData[1];
        campaign.symbol = receiptData[2];
        campaign.affiliate = false;
        campaign.funding_wallet_address = receipt[6];
        campaign.is_pause = receipt[7];
        campaign.transaction_hash = param.txHash;
        campaign.is_deploy = true;
        await campaign.save();
        return campaign;
    }

    async updateCampaign(param, receipt, receiptData) {
      console.log('Update Campaign with: ', param, receipt, receiptData);

        const campaign = CampaignModel.query().where(function () {
          this.where('campaign_hash', '=', param.params.pool)
            .orWhere('transaction_hash', '=', param.txHash)
        }).update({
            campaign_hash: param.params.campaign,
            campaign_id: param.params.poolId,
            registed_by: param.params.registedBy,
            transaction_hash: param.txHash,
            token: param.params.token,
            title: receipt[2],
            start_time: receipt[0],
            finish_time: receipt[1],
            token_conversion_rate: receipt[3],
            funding_wallet_address: receipt[6],
            is_pause: receipt[7],
            ether_conversion_rate: new BigNumber(receipt[4]).dividedBy(Math.pow(10, receipt[5])).toFixed(),
            name : receiptData[0],
            decimals : receiptData[1],
            symbol : receiptData[2],
            affiliate: false,
            is_deploy: true,
        });
        return campaign;
    }

    async editCampaign(receipt, campaign){
      try{
        await CampaignModel.query().where('campaign_hash', campaign)
          .update({
            title: receipt[2],
            start_time: receipt[0],
            finish_time: receipt[1],
            affiliate: false, // receipt[3] == Config.get('const.zero_hex') ? false : true,
            token_conversion_rate: receipt[4],
            ether_conversion_rate: new BigNumber(receipt[5]).dividedBy(Math.pow(10, receipt[7])).toFixed(),
            is_pause: receipt[6],
            funding_wallet_address: receipt[7]
          })
        return true
      }catch (e){
          console.log('ERROR', e);
          return ErrorFactory.internal('error')
      }
    }

    async addCampaign(data){
      try{
        const campaign = new CampaignModel;
        campaign.title = data.title;
        campaign.token = data.token;
        campaign.start_time = data.start_time;
        campaign.finish_time = data.finish_time;
        campaign.funding_wallet_address = data.addressReceiver;
        campaign.name = data.name;
        campaign.symbol = data.symbol;
        campaign.decimals = data.decimals;
        campaign.ether_conversion_rate = data.tokenByETH;
        campaign.registed_by = data.owner;
        campaign.transaction_hash = data.transactionHash;
        campaign.description = data.description;
        campaign.is_pause = Config.get('const.processingValue');
        await campaign.save();

        this.updateCampaignTx(campaign.id, data.transactionHash, Const.TX_UPDATE_ACTION.CAMPAIGN_REGISTER);
        this.dispatchTransactionTracking({
          txHash: data.transactionHash,
          txTable: Const.TX_TABLE.CAMPAIGN,
          id: campaign.id,
          action: Const.TX_UPDATE_ACTION.CAMPAIGN_REGISTER,
        });

        return campaign;
      }catch (e){
        console.log('ERROR', e);
        return ErrorFactory.internal('error')
      }
    }

    async changeCampaign(data){
      try{
        const campaign = await CampaignModel.query().where('transaction_hash', data.transactionHash)
          .update({
            title : data.title,
            token : data.token,
            start_time : data.start_time,
            finish_time : data.finish_time,
            funding_wallet_address : data.addressReceiver,
            name : data.name,
            symbol : data.symbol,
            decimals : data.decimals,
            ether_conversion_rate : data.tokenByETH,
            registed_by : data.owner,
            description : data.description,
            is_pause : Config.get('const.processingValue'),
          });
        return campaign;
      }catch (e){
        console.log('ERROR', e);
        return ErrorFactory.internal('error')
      }
    }

    async dispatchTransactionTracking(data) {
      console.log('Dispatch Job CheckTxStatus with data: ', data);
      CheckTxStatus.doDispatch(data);
    }

    async updateCampaignTx(id, txHash, action) {
      if (
        action == Const.TX_UPDATE_ACTION.CAMPAIGN_REGISTER ||
        action == Const.TX_UPDATE_ACTION.CAMPAIGN_ACTIVATION
      ) {
        return await CampaignModel.query()
          .where('id', id)
          .update({
            blockchain_status:
            Const.CAMPAIGN_BLOCKCHAIN_STATUS.REGISTRATION_WAITING_CONFIRMATION,
            registration_tx: txHash
          });
      }

      if (action == Const.TX_UPDATE_ACTION.CAMPAIGN_UPDATE) {
        return await CampaignModel.query()
          .where('id', id)
          .update({
            blockchain_status: Const.CAMPAIGN_BLOCKCHAIN_STATUS.REGISTRATION_WAITING_CONFIRMATION,
          });
      }

      return await CampaignModel.query()
        .where('id', id)
        .update({
          blockchain_status: Const.CAMPAIGN_BLOCKCHAIN_STATUS.DELETION_WAITING_CONFIRMATION,
          deleted_tx: txHash
        });
    }

    async updateTxCampaignStatusFailed(txHash) {
      const updatedRow1 = await CampaignModel.query()
        .where('registration_tx', txHash)
        .update({
          blockchain_status: Const.CAMPAIGN_BLOCKCHAIN_STATUS.REGISTRATION_TX_FAILED
        });
      const updatedRow2 = await CampaignModel.query()
        .where('deleted_tx', txHash)
        .update({
          blockchain_status: Const.CAMPAIGN_BLOCKCHAIN_STATUS.DELETION_TX_FAILED
        });

      return updatedRow1 + updatedRow2;
    }

    async updateTxStatusSuccess(txHash) {
      const tx = await web3.eth.getTransaction(txHash);

      console.log('TRANSACTION: ', tx);
      console.log('BLOCK: ', tx.blockNumber);

      const campaign = await CampaignModel.query().where('transaction_hash', '=', txHash).update({
        // is_pause: Const.ACTIVE,
        blockchain_status: Const.CAMPAIGN_BLOCKCHAIN_STATUS.REGISTRATION_CONFIRMED,
      });

      return campaign;
    }

    async getCampaignByFilter(status, param, wallet_address =  null){
      const limit = param.limit ? param.limit : Config.get('const.limit_default');
      const page = param.page ? param.page : Config.get('const.page_default');
      const dateNow = Date.now() / 1000;
      let listData = CampaignModel.query()
      if(wallet_address){
        listData = listData.where('registed_by', wallet_address)
      }
      if(param.sort_by){
        listData = listData.orderBy(param.sort_by, 'DESC')
      }
      if(param.title){
        listData =  listData.where('title', 'like', '%'+ param.title +'%')
      }
      if(status && status === 1){
        listData = listData.whereRaw('finish_time >=' + dateNow)
          .whereRaw('start_time <=' + daowteNow)
      }
      if(status && status === 2){
        listData = listData.where('start_time', '>=', dateNow)
      }
      if(status && status === 3){
        listData = listData.where('finish_time', '<=', dateNow)
      }
      listData = await listData.paginate(page,limit);
      return listData
    }

    // investor join campaign
    async joinCampaign(campaign_id, wallet_address, email) {
      // check exist whitelist with wallet and campaign
      const existWl = await WhitelistModel.query()
        .where('wallet_address',wallet_address)
        .where('campaign_id',campaign_id).first();
      if (existWl != null) {
        console.log(`Existed record on whitelist with the same wallet_address ${wallet_address} and campaign_id ${campaign_id}`);
        ErrorFactory.badRequest('Bad request duplicate with wallet_address ' + wallet_address);
      }
      // insert to whitelist table
      const whitelist = new WhitelistModel();
      whitelist.wallet_address = wallet_address;
      whitelist.campaign_id = campaign_id;
      whitelist.email = email;
      await whitelist.save();
      // remove all old key of white list on redis
      // key regex
      const redisKeyRegex = 'whitelist_' + campaign_id + '*';
      // find all key matched with key regex
      const keys = await Redis.keys(redisKeyRegex);
      for (const key of keys) {
        console.log(key);
        await Redis.del(key);
      }
    }

  async findByCampaignId(campaign_id) {
    let builder = CampaignModel.query()
      .where('id', campaign_id);
    return await builder.first();
  }
}

module.exports = CampaignService;
