'use strict'

const CampaignModel = use('App/Models/Campaign');
const Tier = use('App/Models/Tier');
const CampaignService = use('App/Services/CampaignService');
const WalletService = use('App/Services/WalletAccountService');
const TierService = use('App/Services/TierService');
const WinnerListService = use('App/Services/WinnerListUserService');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');

const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_FACTORY_ABI } = CONTRACT_FACTORY_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_ERC20_ABI } = require('../../../blockchain_configs/contracts/Erc20.json');
const { abi: CONTRACT_TIER_ABI } = require('../../../blockchain_configs/contracts/Tier.json');

const Web3 = require('web3');
const BadRequestException = require("../../Exceptions/BadRequestException");
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const Config = use('Config')
const ErrorFactory = use('App/Common/ErrorFactory');
const tierSmartContract = process.env.TIER_SMART_CONTRACT;
const SMART_CONTRACT_USDT_ADDRESS =  process.env.SMART_CONTRACT_USDT_ADDRESS;

class CampaignController {
  async campaignList ({request}) {
    const param = request.all();
    const limit = param.limit ? param.limit : Config.get('const.limit_default');
    const page = param.page ? param.page : Config.get('const.page_default');
    const filter = {};
    let listData = CampaignModel.query().orderBy('id', 'DESC');
    if(param.title){
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
    if(param.start_time && !param.finish_time){
      listData = listData.where('start_time', '>=', param.start_time)
    }
    if(param.finish_time && !param.start_time ){
      listData = listData.where('finish_time', '<=', param.finish_time)
    }
    if(param.finish_time && param.start_time ){
      listData = listData.whereRaw('finish_time <=' + param.finish_time)
        .whereRaw('start_time >=' + param.start_time)
    }
    if(param.registed_by){
      listData = listData.where('registed_by', '=', param.registed_by)
    }
    listData = await listData.paginate(page,limit);
    return {
      status: 200,
      data: listData,
    }
  }
  async icoCampaignCreate( {request}) {
    try{
      const param = request.all();
      if(param.event != Config.get('const.event_ico_create_campaign') && param.event != Config.get('const.event_ico_create_eth_link'))
        return ErrorFactory.badRequest('event not found')
      const contract = new web3.eth.Contract(CONTRACT_ABI, param.params.campaign);
      const receipt = await Promise.all([
        contract.methods.openTime().call(),
        contract.methods.closeTime().call(),
        contract.methods.name().call(),
        contract.methods.getErc20TokenConversionRate(param.params.token).call(),
        contract.methods.getEtherConversionRate().call(),
        contract.methods.getEtherConversionRateDecimals().call(),
        contract.methods.fundingWallet().call(),
        contract.methods.paused().call(),
      ]);
      const findCampaign = await CampaignModel.query()
        .where(function () {
          this.where('campaign_hash', '=', param.params.campaign)
            .orWhere('transaction_hash', '=', param.txHash)
        })
        .first();
      const contractFactory = new web3.eth.Contract(CONTRACT_ERC20_ABI, param.params.token);
      // TODO: Check to remove this
      const receiptData = await Promise.all([
        contractFactory.methods.name().call(),
        contractFactory.methods.decimals().call(),
        contractFactory.methods.symbol().call(),
      ]);
      const CampaignSv = new CampaignService();
      let campaign = {}
      if(!findCampaign){
        campaign = await CampaignSv.createCampaign(param, receipt, receiptData)
      }else {
        campaign = await CampaignSv.updateCampaign(param, receipt, receiptData)
      }
      return {
        status: 200,
        data: campaign,
      };
    }catch (e){
      console.log(e)
      return ErrorFactory.badRequest("error")
    }
  }

  async campaignShow(request){
    const campaign_value = request.params.campaign
    const campaigns = await CampaignModel.query().with('transaction').where(function () {
      this.where('campaign_hash', "=", campaign_value)
        .orWhere('id', '=', campaign_value)
    }).first();
    if (!campaigns) {
      return ErrorFactory.badRequest('Campaign not found')
    }else {
      const data = JSON.parse(JSON.stringify(campaigns));
      return {
        status: 200,
        data: data
      }
    }
  }

  async campaignNew(){
    const campaigns = await CampaignModel.query().whereNotNull('campaign_hash').with('transaction').orderBy('created_at', 'desc').first();
    return {
      status: 200,
      data: campaigns
    }
  }

  async campaignLastestActive() {
    const campaigns = await CampaignModel.query().whereNotNull('campaign_hash').with('transaction')
                          .where('is_pause', Const.ACTIVE).orderBy('created_at', 'desc').first();
    return {
      status: 200,
      data: campaigns
    }
  }


  async campaignDelete({request}) {
    const walletAddress = request.params.walletAddress
    const campaign = request.params.campaign
    // const deleted =
  }

  async CampaignChanged ({request}) {
    console.log('WEBHOOK-Update Campaign');

    const param = request.all();
    const tx = await web3.eth.getTransaction(param.txHash);
    if (tx == null)
      return ErrorFactory.badRequest('campaign not found!')
    const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to).first();
    if(!campaign){
      console.log('waning! campaign not found!')
      return {
        status: 200
      }
    }
    const contract = new web3.eth.Contract(CONTRACT_ABI, tx.to);
    const receipt = await Promise.all([
      contract.methods.openTime().call(),
      contract.methods.closeTime().call(),
      contract.methods.name().call(),
      contract.methods.name().call(), // TODO: Check to remove this
      contract.methods.getErc20TokenConversionRate(campaign.token).call(),
      contract.methods.getEtherConversionRate().call(),
      contract.methods.paused().call(),
      contract.methods.getEtherConversionRateDecimals().call(),
      contract.methods.fundingWallet().call(),
    ]);

    console.log('Update Campaign with Receipt: ', receipt);
    const CampaignSv = new CampaignService();
    const campaignUpdate = await CampaignSv.editCampaign(receipt, tx.to)

    console.log('WEBHOOK-Update Campaign Success!', campaignUpdate);
    return campaignUpdate
  }

  async CampaignEditStatus({request}){
    try{

      const param = request.all();
      const tx = await web3.eth.getTransaction(param.txHash);
      if (tx == null)
        return ErrorFactory.badRequest('Transaction not found')
      const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to).first();
      if(!campaign){
        console.log('waning! campaign not found!')
        return {status: 200}
      }
      if(param.event == Config.get('const.pause')){
        const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to)
          .update({
            is_pause: true
          })
        return campaign;
      }else {
        const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to)
          .update({
            is_pause: false
          })
        return campaign;
      }
    }catch (e){
      console.log(e);
      return ErrorFactory.badRequest('error')
    }

  }

  async campaignCreate({request}) {
    try{
      const params = request.all();
      const findCampaign = await CampaignModel.query().where('transaction_hash', '=', params.transactionHash).first();
      const CampaignSv = new CampaignService();
      if(findCampaign){
        const campaignChange = await CampaignSv.changeCampaign(params)
        return campaignChange;
      }else {
        const campaign = await CampaignSv.addCampaign(params)
        return campaign;
      }
    }catch (e){
      console.log(e)
      return ErrorFactory.badRequest('error')
    }
  }

  async myCampaign({request, auth}) {
    try{
      const param = request.all();
      const status = request.params.status;
      const statusCode = Config.get('const.status_' + status)
      const campaignService = new CampaignService;
      const wallet_address = auth.user !== null ? auth.user.wallet_address : null
      const listData = await campaignService.getCampaignByFilter(statusCode, param , wallet_address)
      return {
        status: 200,
        data: listData,
      }
    }catch (e){
      console.log("error", e)
      return ErrorFactory.internal("error")
    }
  }

  async joinCampaign({request, auth}) {
    // get all params
    const params = request.all()
    // get user wallet_address
    const wallet_address = auth.user !== null ? auth.user.wallet_address : null;
    const email = auth.user.email;
    if (wallet_address == null) {
      return HelperUtils.responseBadRequest("User don't have a valid wallet");
    }
    // call to join campaign
    const campaignService = new CampaignService();
    try {
      await campaignService.joinCampaign(params.campaign_id, wallet_address, email);
      return HelperUtils.responseSuccess(null,"Join Campaign Successful !");
    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal(e.message);
      }
    }
  }

  async deposit({request, auth}) {
    try {
      // get all request params
      const params = request.all();
      console.log(params);
      // get user wallet
      const userWalletAddress = auth.user !== null ? auth.user.wallet_address : null;
      if (userWalletAddress == null) {
        return HelperUtils.responseBadRequest("User don't have a valid wallet");
      }
      // check if exist in winner list
      const winnerListService = new WinnerListService();
      const winner = await winnerListService.findByWalletAddress({'wallet_address': userWalletAddress});
      if (winner == null) {
        return ErrorFactory.badRequest("You're not in winner list");
      }

      // TODO list reserved
      // check user tier
      const tierSc = new web3.eth.Contract(CONTRACT_TIER_ABI, tierSmartContract);
      const userTier = await tierSc.methods.getUserTier(userWalletAddress).call();
      console.log(`user tier is ${userTier}`);
      // call to db to get tier info
      const tierService = new TierService();
      const tierParams = {
        'campaign_id': params.campaign_id,
        'level': userTier,
        'current_time': Date.now()/1000
      };
      const tier = await tierService.findByLevelAndCampaign(tierParams);
      if (tier == null) {
        return ErrorFactory.badRequest("You're not get tier required to join this campaign or you're early to deposit");
      }
      const filterParams = {
        'campaign_id': params.campaign_id
      };
      // call to db get campaign info
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(params.campaign_id)
      if (camp == null) {
        console.log(`Do not found campaign with id ${params.campaign_id}`);
        return ErrorFactory.badRequest("Error");
      }
      // get private key from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId(filterParams);
      if (wallet == null) {
        console.log(`Do not found wallet for campaign ${params.campaign_id}`);
        return ErrorFactory.badRequest("Error");
      }
      // call to SC to get sign hash
      const poolContract = new web3.eth.Contract(CONTRACT_ABI, camp.campaign_hash);
      // get convert rate token erc20 -> our token
      const rate = await poolContract.methods.getErc20TokenConversionRate(SMART_CONTRACT_USDT_ADDRESS).call();
      const maxTokenAmount = web3.utils.toWei((tier.max_buy * rate).toString(), "ether");
      console.log(rate, maxTokenAmount, userWalletAddress, camp.start_time);
      const messageHash = await poolContract.methods.getMessageHash(userWalletAddress, maxTokenAmount, camp.start_time).call();
      console.log(`message hash ${messageHash}`);
      const privateKey = wallet.private_key;
      console.log(`private key ${privateKey}`)
      // get sign for wallet address
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      console.log(`signature ${signature}`);
      const response = {
        'max_buy': maxTokenAmount,
        'signature': signature,
        'dead_line': camp.start_time
      }
      return HelperUtils.responseSuccess(response);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

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
          name: item.name,
          start_time: item.startTime,
          end_time: item.endTime,
          max_buy: item.maxBuy,
        });
        return tierObj;
      });
      await campaign.tiers().saveMany(tiers);

      console.log('params.tier_configuration', tiers);

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

    console.log('Update Pool with data: ', data, params);

    try {
      const campaign = await CampaignModel.query().where('id', params.id).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', params.id).update(data);

      const tiers = (inputParams.tier_configuration || []).map((item) => {
        const tierObj = new Tier();
        tierObj.fill({
          name: item.name,
          start_time: item.startTime,
          end_time: item.endTime,
          max_buy: item.maxBuy,
        });
        return tierObj;
      });
      const campaignUpdated = await CampaignModel.query().where('id', params.id).first();
      await campaignUpdated.tiers().delete();
      await campaignUpdated.tiers().saveMany(tiers);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('ERROR', e);
      return ErrorFactory.internal('error')
    }
  }

  async getPool({ request, auth, params }) {
    const pool = await CampaignModel.query()
      .with('tiers')
      // .with('winners')
      // .with('whitelistUsers')
      .where('id', params.id)
      // .where('is_pause', Const.ACTIVE)
      // .orderBy('created_at', 'desc')
      .first();

    return {
      status: 200,
      data: pool,
    }
  }
}

module.exports = CampaignController
