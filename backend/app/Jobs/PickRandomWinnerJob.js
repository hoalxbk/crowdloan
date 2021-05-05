'use strict'

const kue = use('Kue');
const Const = use('App/Common/Const');
const UserBalanceSnapshotModel = use('App/Models/UserBalanceSnapshot');
const CampaignModel = use('App/Models/Campaign');
const WhitelistService = use('App/Services/WhitelistUserService');
const UserBalanceSnapshotService = use('App/Services/UserBalanceSnapshotService');
const {abi: CONTRACT_TIER_ABI} = require('../../../blockchain_configs/contracts/Normal/Tier.json');
const TIER_CONTRACT = process.env.TIER_SMART_CONTRACT;
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const priority = 'critical'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 5; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => { // Function to be run on the job before it is saved
  job.backoff()
};

class PickRandomWinnerJob {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 5
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return Const.JOB_KEY.PICKUP_RANDOM_WINNER;
  }

  // This is where the work is done.
  async handle(data) {
    console.log('PickRandomWinnerJob-job started', data);
    try {
      // get list whitelist to snapshot balance
      let i = 0
      // loop each 10 records to process
      do {
        const filterParams = {
          campaign_id : data.campaign_id,
          page : i,
          pageSize : 10
        }
        const whitelistService = new WhitelistService();
        const whitelist = await whitelistService.findWhitelistUser(filterParams);
        // loop to get balance of each user on white list
        const userSnapshots = await Promise.all(whitelist.toJSON().map(async (item) => {
          // call to SC to get balance
          const wallet = item.wallet_address;
          const tierContract = new web3.eth.Contract(CONTRACT_TIER_ABI, TIER_CONTRACT);
          const receivedData = await Promise.all([
            tierContract.methods.getUserTier(wallet).call(),
            tierContract.methods.userTotalStaked(wallet).call()
          ]);
          const tier = receivedData[0];
          const pkfBalance = receivedData[1];
          console.log(`Snapshot user balance with wallet ${wallet} tier ${tier} pkf_balance ${pkfBalance}`);
          // calc lottery_tickets
          // TODO need get setting from Db
          let tickets = 0;
          switch (tier) {
            case 1:
              tickets = Math.floor(pkfBalance/500);
              break;
            case 2:
              tickets = Math.floor(pkfBalance/500);
              break;
            case 3:
              tickets = Math.floor(pkfBalance/2000);
              break;
            case 4:
              // tickets = Math.floor(pkfBalance/);
              break;
            default :
              console.log('User has no quality tier to get lottery ticket');
          }
          let userSnapShot = new UserBalanceSnapshotModel();
          userSnapShot = {
            campaign_id: data.campaign_id,
            wallet_address : wallet,
            level : tier,
            lottery_ticket: tickets,
            pkf_balance : pkfBalance
          }
          return userSnapShot;
        }));
        // save to user_balance_snapshot
        const campaignUpdated = await CampaignModel.query().where('id', data.campaign_id).first();
        await campaignUpdated.user_balance_snapshot().saveMany(userSnapshots);
        // increment page
        i++;
      } while (whitelist && whitelist.length)

      // pickup random winner after snapshot all whitelist user balance
      await Promise.all(data.tiers.map(async (item) => {
        const userSnapshotService = new UserBalanceSnapshotService();
        // get number of users of each level
        const user_numbers = userSnapshotService.getRandomWinners();
        //
        // const winners =
        // save to winner list
        const campaignUpdated = await CampaignModel.query().where('id', data.campaign_id).first();
        await campaignUpdated.winner_list().saveMany(winners);
      }));
    } catch (e) {
      console.log('Pickup random winner has error', e);
      throw e;
    }
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch pickup random winner with data : ', data);
    kue.dispatch(this.key, data, {priority, attempts, remove, jobFn});
  }
}

module.exports = PickRandomWinnerJob

