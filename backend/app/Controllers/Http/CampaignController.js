'use strict'

const CampaignModel = use('App/Models/Campaign');
const Tier = use('App/Models/Tier');
const CampaignService = use('App/Services/CampaignService');
const WalletService = use('App/Services/WalletAccountService');
const TierService = use('App/Services/TierService');
const WinnerListService = use('App/Services/WinnerListUserService');
const WhitelistService = use('App/Services/WhitelistUserService');
const ReservedListService = use('App/Services/ReservedListService');
const UserService = use('App/Services/UserService');
const Const = use('App/Common/Const');
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
      console.log('[Webhook] - Create Pool with params: ', param);

      if(param.event != Const.CRAWLER_EVENT.POOL_CREATED) {
        return ErrorFactory.badRequest('Event Name is invalid');
      }

      const campaignHash = param.params.pool;
      const token = param.params.token;
      const contract = new web3.eth.Contract(CONTRACT_ABI, campaignHash);
      const receipt = await Promise.all([
        contract.methods.openTime().call(),
        contract.methods.closeTime().call(),
        contract.methods.name().call(),
        contract.methods.getErc20TokenConversionRate(token).call(),
        contract.methods.getEtherConversionRate().call(),
        contract.methods.getEtherConversionRateDecimals().call(),
        contract.methods.fundingWallet().call(),
        contract.methods.paused().call(),
      ]);
      const findCampaign = await CampaignModel.query()
        .where(function () {
          this.where('campaign_hash', '=', campaignHash)
            .orWhere('transaction_hash', '=', param.txHash)
        })
        .first();

      console.log('Find Campaign: ', JSON.stringify(findCampaign));

      const contractERC20 = new web3.eth.Contract(CONTRACT_ERC20_ABI, token);
      // TODO: Check to remove this
      const receiptData = await Promise.all([
        contractERC20.methods.name().call(),
        contractERC20.methods.decimals().call(),
        contractERC20.methods.symbol().call(),
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
    } catch (e) {
      console.log(e)
      return ErrorFactory.badRequest("error");
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

  async joinCampaign({request}) {
    // get request params
    const campaign_id = request.input('campaign_id');
    const wallet_address = request.header('wallet_address');
    if (campaign_id == null) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    console.log('Join campaign with params: ', campaign_id, wallet_address);
    try {
      // check campaign
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id);
      if (camp == null || camp.buy_type !== Const.BUY_TYPE.WHITELIST_LOTTERY) {
        console.log(`Campaign with id ${campaign_id}`)
        return HelperUtils.responseBadRequest(`Bad request with campaignId ${campaign_id}`)
      }
      const currentDate = Math.floor(Date.now() / 1000);
      console.log(`Join with date ${currentDate}`);
      // check time to join campaign
      if (camp.start_join_pool_time > currentDate || camp.end_join_pool_time < currentDate) {
        console.log(`It's not right time to join campaign ${currentDate} ${camp.start_join_pool_time} ${camp.end_join_pool_time}`)
        return HelperUtils.responseBadRequest("It's not right time to join this campaign !");
      }
      // get user info
      const userService = new UserService();
      const userParams = {
        'wallet_address': wallet_address,
        'campaign_id': campaign_id
      }
      const user = await userService.findUser(userParams);
      if (user == null || user.email === '') {
        console.log(`User ${user}`);
        return HelperUtils.responseBadRequest("You're not valid user to join this campaign !");
      }
      // check user tier
      const tierSc = new web3.eth.Contract(CONTRACT_TIER_ABI, tierSmartContract);
      const userTier = await tierSc.methods.getUserTier(wallet_address).call();
      console.log(`user tier is ${userTier}`);
      // check user tier with min tier of campaign
      if (camp.min_tier > userTier) {
        return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign!");
      }
      // call to db to get tier info
      const tierService = new TierService();
      const tierParams = {
        'campaign_id': campaign_id,
        'level': userTier
      };
      const tier = await tierService.findByLevelAndCampaign(tierParams);
      if (tier == null) {
        return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign!");
      }
      // call to join campaign
      await campaignService.joinCampaign(campaign_id, wallet_address, user.email);
      return HelperUtils.responseSuccess(null, "Join Campaign Successful !");
    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal(e.message);
      }
    }
  }

  async deposit({request}) {
    // get all request params
    const params = request.all();
    const campaign_id = request.params.campaign_id;
    const userWalletAddress = request.header('wallet_address');
    console.log('Deposit campaign with params: ',params, campaign_id, userWalletAddress);
    try {
      // get user info
      const userService = new UserService();
      const userParams = {
        'wallet_address': userWalletAddress,
        'campaign_id': campaign_id
      }
      const user = await userService.findUser(userParams);
      if (user == null || user.email === '') {
        console.log(`User ${user}`);
        return HelperUtils.responseBadRequest("You're not valid user to join this campaign !");
      }
      // check campaign info
      const filterParams = {
        'campaign_id': campaign_id
      };
      // call to db get campaign info
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id)
      if (camp == null) {
        console.log(`Do not found campaign with id ${campaign_id}`);
        return HelperUtils.responseBadRequest("Do not found campaign");
      }

      // check if exist in winner list
      const winnerListService = new WinnerListService();
      const winnerParams = {
        'wallet_address': userWalletAddress,
        'campaign_id': campaign_id
      }
      let minBuy = 0, maxBuy = 0;
      const winner = await winnerListService.findOneByFilters(winnerParams);
      // check user tier for winner
      if (winner != null) {

        // ===========================================================================================
        // Todo - FCFS does not have winner list and reserve list
        // ===========================================================================================
        // check user tier
        const tierSc = new web3.eth.Contract(CONTRACT_TIER_ABI, tierSmartContract);
        const userTier = await tierSc.methods.getUserTier(userWalletAddress).call();
        console.log(`user tier is ${userTier}`);
        // check user tier with min tier of campaign
        if (camp.min_tier > userTier) {
          return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign!");
        }
        // call to db to get tier info
        const tierService = new TierService();
        const tierParams = {
          'campaign_id': params.campaign_id,
          'level': userTier
        };
        const tier = await tierService.findByLevelAndCampaign(tierParams);
        if (tier == null) {
          return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign !");
        }
        // check time start buy for tier
        const current = Date.now() / 1000;
        if (tier.start_time > current || tier.end_time < current) {
          console.log(`${tier.start_time} ${tier.end_time} ${current}`);
          return HelperUtils.responseBadRequest("You're early come to join this campaign !");
        }
        // set min, max buy amount of user
        minBuy = tier.min_buy;
        maxBuy = tier.max_buy;
      } else {
        // if user is not in winner list then check with reserved list
        const reservedListService = new ReservedListService();
        const reserved = await reservedListService.findOneByFilter(winnerParams);
        if (reserved == null) {
          console.log()
          return HelperUtils.responseBadRequest("You're not in buyer list !");
        }
        // check time start buy for tier
        const current = Date.now() / 1000;
        if (reserved.start_time > current || reserved.end_time < current) {
          console.log(`Reserved ${reserved.start_time} ${reserved.end_time} ${current}`);
          return HelperUtils.responseBadRequest("You're early come to join this campaign !");
        }
        // set min, max buy amount of user
        minBuy = reserved.min_buy;
        maxBuy = reserved.max_buy;
      }
      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId(filterParams);
      if (wallet == null) {
        console.log(`Do not found wallet for campaign ${params.campaign_id}`);
        return HelperUtils.responseBadRequest("Do not found wallet for campaign");
      }
      // call to SC to get sign hash
      const poolContract = new web3.eth.Contract(CONTRACT_ABI, camp.campaign_hash);
      // get convert rate token erc20 -> our token
      // TODO need get dynamic rate of each Erc20 token

      // ===========================================================================================
      // Todo - Support multiple token buy from ETH, USDC, USDT. Need check supported currency
      // => Different max Token amount
      // => Support min buy amount and convert in response
      // ===========================================================================================
      const rate = await poolContract.methods.getErc20TokenConversionRate(SMART_CONTRACT_USDT_ADDRESS).call();
      // calc min, max token user can buy
      const maxTokenAmount = web3.utils.toWei((maxBuy * rate).toString(), "ether");
      const minTokenAmount = web3.utils.toWei((minBuy * rate).toString(), "ether");
      console.log(rate, minTokenAmount, maxTokenAmount, userWalletAddress);

      // ===========================================================================================
      // Todo - Params getMessageHash changed. Please check new Smart contract
      // ===========================================================================================
      // get message hash
      const messageHash = await poolContract.methods.getMessageHash(userWalletAddress, maxTokenAmount, camp.start_time).call();
      console.log(`message hash ${messageHash}`);
      const privateKey = wallet.private_key;
      console.log(`private key ${privateKey}`)
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      console.log(`signature ${signature}`);
      const response = {
        'max_buy': maxTokenAmount,
        'min_buy': minTokenAmount,
        'signature': signature
      }
      return HelperUtils.responseSuccess(response);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

  async countingJoinedCampaign({request}) {
    const campaignId = request.params.campaignId;
    try {
      // get from redis cached
      let redisKey = 'counting_' + campaignId;
      if (await Redis.exists(redisKey)) {
        console.log(`existed key ${redisKey} on redis`);
        const cachedWL = await Redis.get(redisKey);
        return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      }
      // if not existed on redis then get from db
      const wlService = new WhitelistService();
      let noOfParticipants = await wlService.countByCampaignId(campaignId);
      if (!noOfParticipants) {
        noOfParticipants = 0;
      }
      // save to redis
      await Redis.set(redisKey, JSON.stringify(noOfParticipants));
      return HelperUtils.responseSuccess(noOfParticipants);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

  async checkJoinedCampaign({request, auth}) {
    const campaignId = request.params.campaignId;
    // get user wallet
    const userWalletAddress = request.input('wallet_address');
    // const userWalletAddress = auth.user !== null ? auth.user.wallet_address : null;
    if (userWalletAddress == null) {
      return HelperUtils.responseBadRequest("User don't have a valid wallet");
    }
    try {
      const wlService = new WhitelistService();
      const existed = await wlService.checkExisted(userWalletAddress, campaignId);
      return HelperUtils.responseSuccess(existed);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

}

module.exports = CampaignController;
