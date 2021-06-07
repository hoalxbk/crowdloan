'use strict'

const AirdropModel = use('App/Models/Airdrop');
const CampaignModel = use('App/Models/Campaign');
const CampaignService = use('App/Services/CampaignService');
const WalletService = use('App/Services/WalletAccountService');
const TierService = use('App/Services/TierService');
const WinnerListService = use('App/Services/WinnerListUserService');
const WhitelistService = use('App/Services/WhitelistUserService');
const ReservedListService = use('App/Services/ReservedListService');
const CampaignClaimConfigService = use('App/Services/CampaignClaimConfigService');
const SnapshotBalance = use('App/Jobs/SnapshotBalance')
const GetUserPurchasedBalanceJob = use('App/Jobs/GetUserPurchasedBalanceJob')

const UserService = use('App/Services/UserService');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');
const ConvertDateUtils = use('App/Common/ConvertDateUtils');
const Redis = use('Redis');
const BigNumber = use('bignumber.js')
BigNumber.config({EXPONENTIAL_AT: 50});

const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const {abi: CONTRACT_ABI} = CONTRACT_CONFIGS.CONTRACT_DATA;
const {abi: CONTRACT_ERC20_ABI} = require('../../../blockchain_configs/contracts/Normal/Erc20.json');

const Web3 = require('web3');
const BadRequestException = require("../../Exceptions/BadRequestException");
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const Config = use('Config');
const OFFER_FREE_TIME = process.env.OFFER_FREE_TIME_SECOND || 1800;
const OFFER_FREE_BUY = process.env.OFFER_FREE_BUY_LIMIT || 0;

class CampaignController {
  async campaignList({request}) {
    try {
      const param = request.all();
      const limit = param.limit ? param.limit : Config.get('const.limit_default');
      const page = param.page ? param.page : Config.get('const.page_default');
      const filter = {};
      let listData = CampaignModel.query().orderBy('id', 'DESC');
      if (param.title) {
        listData = listData.where(builder => {
          builder.where('title', 'like', '%' + param.title + '%')
            .orWhere('symbol', 'like', '%' + param.title + '%')
          if ((param.title).toLowerCase() == Config.get('const.suspend')) {
            builder.orWhere('is_pause', '=', 1)
          }
          if ((param.title).toLowerCase() == Config.get('const.active')) {
            builder.orWhere('is_pause', '=', 0)
          }
        })
      }
      if (param.start_time && !param.finish_time) {
        listData = listData.where('start_time', '>=', param.start_time)
      }
      if (param.finish_time && !param.start_time) {
        listData = listData.where('finish_time', '<=', param.finish_time)
      }
      if (param.finish_time && param.start_time) {
        listData = listData.where('finish_time', '<=', param.finish_time)
          .where('start_time', '>=', param.start_time)
      }
      if (param.registed_by) {
        listData = listData.where('registed_by', '=', param.registed_by)
      }
      listData = await listData.paginate(page, limit);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get campaign list fail !');
    }
  }

  async icoCampaignCreate({request}) {
    try {
      const param = request.all();
      console.log('[Webhook] - Create Pool with params: ', param);

      if (param.event != Const.CRAWLER_EVENT.POOL_CREATED) {
        return HelperUtils.responseBadRequest('Event Name is invalid');
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
      if (!findCampaign) {
        campaign = await CampaignSv.createCampaign(param, receipt, receiptData)
      } else {
        campaign = await CampaignSv.updateCampaign(param, receipt, receiptData)
      }
      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal("ERROR: Create ico campaign fail !");
    }
  }

  async campaignShow(request) {
    try {
      const campaign_value = request.params.campaign
      const campaigns = await CampaignModel.query().with('transaction').where(function () {
        this.where('campaign_hash', "=", campaign_value)
          .orWhere('id', '=', campaign_value)
      }).first();
      if (!campaigns) {
        return HelperUtils.responseBadRequest('Campaign not found');
      } else {
        const data = JSON.parse(JSON.stringify(campaigns));
        return HelperUtils.responseSuccess(data);
      }
    } catch (e) {
      return HelperUtils.responseErrorInternal('ERROR: show campaign fail !');
    }
  }

  async campaignNew() {
    try {
      const campaigns = await CampaignModel.query().whereNotNull('campaign_hash').with('transaction').orderBy('created_at', 'desc').first();
      return HelperUtils.responseSuccess(campaigns);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Create campaign fail !');
    }
  }

  async campaignLatestActive() {
    try {
      const campaigns = await CampaignModel.query().whereNotNull('campaign_hash').with('transaction')
        .where('is_pause', Const.ACTIVE).orderBy('created_at', 'desc').first();
      return HelperUtils.responseSuccess(campaigns);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get campaign latest fail !');
    }
  }

  async CampaignChanged({request}) {
    try {
      console.log('WEBHOOK-Update Campaign');
      const param = request.all();
      const tx = await web3.eth.getTransaction(param.txHash);
      if (tx == null)
        return HelperUtils.responseBadRequest('campaign not found!')
      const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to).first();
      if (!campaign) {
        console.log('waning! campaign not found!')
        return HelperUtils.responseSuccess();
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
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Change campaign fail !');
    }
  }

  async CampaignEditStatus({request}) {
    try {
      const param = request.all();
      const tx = await web3.eth.getTransaction(param.txHash);
      if (tx == null)
        return HelperUtils.responseBadRequest('Transaction not found');
      const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to).first();
      if (!campaign) {
        console.log('waning! campaign not found!')
        return {status: 200}
      }
      if (param.event == Config.get('const.pause')) {
        const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to)
          .update({
            is_pause: true
          })
        return campaign;
      } else {
        const campaign = await CampaignModel.query().where('campaign_hash', '=', tx.to)
          .update({
            is_pause: false
          })
        return campaign;
      }
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Update campaign status fail !')
    }
  }

  async campaignCreate({request}) {
    try {
      const params = request.all();
      const findCampaign = await CampaignModel.query().where('transaction_hash', '=', params.transactionHash).first();
      const CampaignSv = new CampaignService();
      if (findCampaign) {
        const campaignChange = await CampaignSv.changeCampaign(params)
        return campaignChange;
      } else {
        const campaign = await CampaignSv.addCampaign(params)
        return campaign;
      }
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: create campaign fail !');
    }
  }

  async myCampaign({request, auth}) {
    try {
      const param = request.all();
      const status = request.params.status;
      const statusCode = Config.get('const.status_' + status)
      const campaignService = new CampaignService;
      const wallet_address = auth.user !== null ? auth.user.wallet_address : null
      const listData = await campaignService.getCampaignByFilter(statusCode, param, wallet_address)
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log("error", e);
      return HelperUtils.responseErrorInternal("ERROR: Get my campaign fail !");
    }
  }

  async joinCampaign({request}) {
    // get request params
    const campaign_id = request.input('campaign_id');
    const wallet_address = request.header('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    console.log('Join campaign with params: ', campaign_id, wallet_address);
    try {
      // check campaign
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id);
      if (!camp || camp.buy_type !== Const.BUY_TYPE.WHITELIST_LOTTERY) {
        console.log(`Campaign with id ${campaign_id}`)
        return HelperUtils.responseBadRequest(`Bad request with campaignId ${campaign_id}`)
      }
      const currentDate = ConvertDateUtils.getDatetimeNowUTC();
      console.log(`Join with date ${currentDate}`);
      // check time to join campaign
      if (camp.start_join_pool_time > currentDate || camp.end_join_pool_time < currentDate) {
        console.log(`It's not right time to join campaign ${currentDate} ${camp.start_join_pool_time} ${camp.end_join_pool_time}`)
        return HelperUtils.responseBadRequest("It's not right time to join this campaign !");
      }
      // get user info
      const userService = new UserService();
      const userParams = {
        'wallet_address': wallet_address
      }
      const user = await userService.findUser(userParams);
      if (!user || !user.email) {
        console.log(`User ${user}`);
        return HelperUtils.responseBadRequest("You're not valid user to join this campaign !");
      }
      if (user.is_kyc != Const.KYC_STATUS.APPROVED) {
        console.log('User does not KYC yet !');
        return HelperUtils.responseBadRequest("You must register for KYC successfully to be allowed to join. Or the email address and/or wallet address you used for KYC does not match the one you use on Red Kite. Please check and update on Blockpass to complete KYC verification.");
      }
      // check user tier
      const userTier = (await HelperUtils.getUserTierSmart(wallet_address))[0];
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
      if (!tier) {
        return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign!");
      }
      // call to join campaign
      await campaignService.joinCampaign(campaign_id, wallet_address, user.email);
      return HelperUtils.responseSuccess(null, "Apply Whitelist successful. !");
    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Apply Whitelist fail !');
      }
    }
  }

  async deposit({request}) {
    // get all request params
    const params = request.all();
    const campaign_id = params.campaign_id;
    const userWalletAddress = request.header('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    console.log('Deposit campaign with params: ', params, campaign_id, userWalletAddress);
    try {
      // get user info
      const userService = new UserService();
      const userParams = {
        'wallet_address': userWalletAddress
      }
      const user = await userService.findUser(userParams);
      if (!user || !user.email) {
        console.log(`User ${user}`);
        return HelperUtils.responseBadRequest("You're not valid user to buy this campaign !");
      }
      if (user.is_kyc != Const.KYC_STATUS.APPROVED) {
        console.log('User does not KYC yet !');
        return HelperUtils.responseBadRequest("You must register for KYC successfully to be allowed to purchase !");
      }
      // check campaign info
      const filterParams = {
        'campaign_id': campaign_id
      };
      // call to db get campaign info
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id)
      if (!camp) {
        console.log(`Do not found campaign with id ${campaign_id}`);
        return HelperUtils.responseBadRequest("Do not found campaign");
      }
      let minBuy = 0, maxBuy = 0;
      let winner;
      const current = ConvertDateUtils.getDatetimeNowUTC();
      console.log(`Current time is ${current}`);
      // check if current time is free to buy or not
      const isFreeBuyTime = (current >= (Number(camp.start_time) + Number(OFFER_FREE_TIME)));
      console.log(`isFreeBuyTime ${isFreeBuyTime}`);
      if (isFreeBuyTime) {
        maxBuy = Number(OFFER_FREE_BUY);
      }
      // check user winner or reserved lis if campaign is lottery
      if (!isFreeBuyTime && camp.buy_type === Const.BUY_TYPE.WHITELIST_LOTTERY) {
        // check if exist in winner list
        const winnerListService = new WinnerListService();
        const winnerParams = {
          'wallet_address': userWalletAddress,
          'campaign_id': campaign_id
        }
        winner = await winnerListService.findOneByFilters(winnerParams);
        // if user not in winner list then check on reserved list
        if (!winner) {
          // if user is not in winner list then check with reserved list
          const reservedListService = new ReservedListService();
          const reserved = await reservedListService.findOneByFilter(winnerParams);
          if (!reserved) {
            console.log()
            return HelperUtils.responseBadRequest("Sorry, you are not on the list of winners to join this pool.");
          }
          // check time start buy for tier
          console.log(`Reserved ${reserved.start_time} ${reserved.end_time} ${current}`);
          if (reserved.start_time > current) {
            return HelperUtils.responseBadRequest('It is not yet time for your tier to start buying!');
          }
          if (reserved.end_time < current) {
            return HelperUtils.responseBadRequest("Time out of your tier you can buy!");
          }
          // set min, max buy amount of user
          minBuy = reserved.min_buy;
          maxBuy = reserved.max_buy;
        }
      }
      // check user tier if user not in reserved list
      if (!isFreeBuyTime && winner) {
        // get realtime tier from SC
        const currentTier = (await HelperUtils.getUserTierSmart(userWalletAddress))[0];
        // if user decrement their tier then they can not buy token
        if (currentTier < winner.level) {
          console.log(`Current tier ${currentTier} and snapshot tier ${winner.level}`);
          return HelperUtils.responseBadRequest('You have already decreased your tier so you can no longer buy tokens in this pool!');
        }
        // get user tier from winner table which snapshot user balance and pickup random winner
        console.log(`user tier is ${winner.level}`);
        // check user tier with min tier of campaign
        if (camp.min_tier > winner.level) {
          return HelperUtils.responseBadRequest("You're not tier qualified for buy this campaign!");
        }
        // call to db to get tier info
        const tierService = new TierService();
        const tierParams = {
          'campaign_id': params.campaign_id,
          'level': winner.level
        };
        const tier = await tierService.findByLevelAndCampaign(tierParams);
        if (!tier) {
          return HelperUtils.responseBadRequest("You're not tier qualified for buy this campaign !");
        }
        // check time start buy for tier
        console.log(`${tier.start_time} ${tier.end_time} ${current}`);
        if (tier.start_time > current) {
          return HelperUtils.responseBadRequest('It is not yet time for your tier to start buying!');
        }
        if (tier.end_time < current) {
          return HelperUtils.responseBadRequest("Time out of your tier you can buy!");
        }
        // set min, max buy amount of user
        minBuy = tier.min_buy;
        maxBuy = tier.max_buy * winner.lottery_ticket;
      }

      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId(filterParams);
      if (!wallet) {
        console.log(`Do not found wallet for campaign ${campaign_id}`);
        return HelperUtils.responseBadRequest("Do not found wallet for campaign");
      }
      // call to SC to get convert rate token erc20 -> our token
      const receipt = await HelperUtils.getOfferCurrencyInfo(camp);
      const rate = receipt[0];
      const decimal = receipt[1];
      const unit = receipt[2];
      console.log(rate, decimal, unit);
      // calc min, max token user can buy
      const maxTokenAmount = new BigNumber(maxBuy).multipliedBy(rate).dividedBy(Math.pow(10, Number(decimal))).multipliedBy(Math.pow(10, unit)).toFixed(0);
      const minTokenAmount = new BigNumber(minBuy).multipliedBy(rate).dividedBy(Math.pow(10, Number(decimal))).multipliedBy(Math.pow(10, unit)).toFixed(0);
      console.log(minTokenAmount, maxTokenAmount, userWalletAddress);
      // get message hash
      const messageHash = web3.utils.soliditySha3(userWalletAddress, maxTokenAmount, minTokenAmount);
      console.log(`message hash ${messageHash}`);
      const privateKey = wallet.private_key;
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
      return HelperUtils.responseErrorInternal("Deposit has internal server error !");
    }
  }

  async depositAdmin({request}) {
    const requestParams = request.only([ 'minBuy', 'maxBuy', 'userWalletAddress', 'campaignId']);
    console.log('requestParams: ', requestParams);
    const campaignId = requestParams.campaignId;
    const minTokenAmount = requestParams.minBuy || 0;
    const maxTokenAmount = requestParams.maxBuy;
    const userWalletAddress = requestParams.userWalletAddress;

    const filterParams = {
      'campaign_id': campaignId,
    };
    // get private key for campaign from db
    const walletService = new WalletService();
    const wallet = await walletService.findByCampaignId(filterParams);
    if (!wallet) {
      console.log(`Do not found wallet for campaign ${campaign_id}`);
      return HelperUtils.responseBadRequest("Do not found wallet for campaign");
    }

    console.log('Wallet: ', wallet);
    const privateKey = wallet.private_key;
    console.log('privateKey: ', privateKey);
    const messageHash = web3.utils.soliditySha3(userWalletAddress, maxTokenAmount, minTokenAmount);
    console.log('messageHash: ', messageHash);

    // create signature
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log('account: ', account);

    const accAddress = HelperUtils.checkSumAddress(account.address);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = accAddress;
    const signature = await web3.eth.sign(messageHash, accAddress);
    console.log(`signature ${signature}`);

    const response = {
      'max_buy': maxTokenAmount,
      'min_buy': minTokenAmount,
      'signature': signature
    };

    return HelperUtils.responseSuccess(response);
  }

  async countingJoinedCampaign({request}) {
    const campaignId = request.params.campaignId;
    try {
      // get from redis cached
      // let redisKey = 'counting_' + campaignId;
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWL = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      // }
      // if not existed on redis then get from db
      const wlService = new WhitelistService();
      let noOfParticipants = await wlService.countByCampaignId(campaignId);
      if (!noOfParticipants) {
        noOfParticipants = 0;
      }
      // save to redis
      // await Redis.set(redisKey, JSON.stringify(noOfParticipants));
      return HelperUtils.responseSuccess(noOfParticipants);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal("Counting join campaign has internal server error !");
    }
  }

  async checkJoinedCampaign({request, auth}) {
    const campaignId = request.params.campaignId;
    // get user wallet
    const userWalletAddress = request.input('wallet_address');
    // const userWalletAddress = auth.user !== null ? auth.user.wallet_address : null;
    if (!userWalletAddress) {
      return HelperUtils.responseBadRequest("User don't have a valid wallet");
    }
    try {
      const wlService = new WhitelistService();
      const existed = await wlService.checkExisted(userWalletAddress, campaignId);
      return HelperUtils.responseSuccess(existed);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal("Check join campaign has internal server error !");
    }
  }

  async claim({request}) {
    // get all request params
    const params = request.all();
    const campaign_id = params.campaign_id;
    const userWalletAddress = request.header('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    console.log('Claim token with params: ', params, campaign_id, userWalletAddress);

    try {
      // check campaign info
      const filterParams = {
        'campaign_id': campaign_id
      };
      // call to db get campaign info
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id)
      if (!camp) {
        console.log(`Do not found campaign with id ${campaign_id}`);
        return HelperUtils.responseBadRequest("Do not found campaign");
      }
      if (camp.pool_type != Const.POOL_TYPE.CLAIMABLE) {
        console.log(`Campaign is not claimable with id ${campaign_id}`);
        return HelperUtils.responseBadRequest("Campaign is not claimable !");
      }
      // get campaign claim config from db
      const claimParams = {
        'campaign_id': campaign_id,
        'current_time': ConvertDateUtils.getDatetimeNowUTC()
      };
      const claimConfigService = new CampaignClaimConfigService();
      const claimConfig = await claimConfigService.findLastClaimPhase(claimParams);
      if (!claimConfig) {
        console.log(`Do not found claim config for campaign ${campaign_id}`);
        return HelperUtils.responseBadRequest("You can not claim token at current time !");
      }
      // call to SC to get amount token purchased of user
      const campaignClaimSC = await HelperUtils.getContractClaimInstance(camp);
      const received = await Promise.all([
        campaignClaimSC.methods.userPurchased(userWalletAddress).call(),
        campaignClaimSC.methods.userClaimed(userWalletAddress).call()
      ]);
      const tokenPurchased = received[0];
      const tokenClaimed = received[1];
      // calc max token that user can claimable
      const maxTokenClaim = new BigNumber(claimConfig.max_percent_claim).dividedBy(100).multipliedBy(tokenPurchased);
      console.log(`user token purchased ${tokenPurchased} and user claimed ${tokenClaimed} and max token claim ${maxTokenClaim}`);

      console.log('claimConfig BE:', claimConfig);

      // get message hash
      const messageHash = web3.utils.soliditySha3(userWalletAddress, maxTokenClaim);
      console.log(`message hash to claim ${messageHash}`);

      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId(filterParams);
      if (wallet == null) {
        console.log(`Do not found wallet for campaign ${campaign_id}`);
        return HelperUtils.responseBadRequest("Do not found wallet for campaign");
      }
      const privateKey = wallet.private_key;
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      console.log(`signature ${signature}`);
      const response = {
        'amount': maxTokenClaim,
        'signature': signature
      }
      return HelperUtils.responseSuccess(response);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal("Claim token has internal server error !");
    }
  }

  async userSnapShotBalance({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    console.log(`Snap shot user balance with campaign ${campaign_id}`);
    try {
      // get campaign
      const camp = await CampaignModel.query().where('id', campaign_id).first();
      if (!camp) {
        console.log(`Do not found campaign with id ${campaign_id}`);
        return HelperUtils.responseBadRequest('Do not found campaign');
      }
      // create data to snap shot
      const data = {
        campaign_id : campaign_id
      }
      // dispatch to job to snapshot balance
      SnapshotBalance.handle(data);
      return HelperUtils.responseSuccess(null, "Snapshot user balance successful !")
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Snapshot user balance has error!');
    }
  }

  async getAirdrop({request}) {
    const campaign_id = request.params.campaignId;
    const wallet_address = request.params.walletAddress;
    console.log(`Check Airdrop with: `, request.params);
    try {
      // get campaign
      const camp = await CampaignModel.query().where('id', campaign_id).first();
      if (!camp) {
        console.log(`Campaign Not Found: ${campaign_id}`);
        return HelperUtils.responseBadRequest('Campaign Not Found');
      }

      const airdrop = await AirdropModel.query()
        .where('campaign_id', campaign_id)
        .where('wallet_address', wallet_address)
        .first();
      if (!airdrop) {
        return HelperUtils.responseSuccess(false, 'Not have Airdrop');
      }

      return HelperUtils.responseSuccess(airdrop, 'Get Airdrop successful !');
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Airdrop Error');
    }


  }

}

module.exports = CampaignController;
