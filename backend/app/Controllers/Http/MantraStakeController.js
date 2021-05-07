'use strict'

const TransactionModel = use('App/Models/Transaction');
const TransactionService = use('App/Services/TransactionService');
const CampaignModel = use('App/Models/Campaign');
const CampaignTotalService = use('App/Services/CampaignTotalService');
const AssetTokenService = use('App/Services/AssetTokenService');
const Const = use('App/Common/Const');
const ErrorFactory = use('App/Common/ErrorFactory');
const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];
const {abi: CONTRACT_ABI} = CONTRACT_CONFIGS.CONTRACT_DATA;

const {abi: CONTRACT_ERC20_ABI} = require('../../../blockchain_configs/contracts/Normal/Erc20.json');
const {abi: CONTRACT_CAMPAIGN_ABI} = require('../../../blockchain_configs/contracts/Normal/Campaign.json');

const Web3 = require('web3');
const Event = use('Event')
const moment = require('moment');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const Config = use('Config')
const BigNumber = use('bignumber.js');
const HelperUtils = use('App/Common/HelperUtils');

class MantraStakeController {

  async staked({ request }) {
    // try {
    //   console.log(`Check Transaction Exist in Blockchain with transaction_hash: ${transactionHash}`);
    //   const tx = await web3.eth.getTransaction(transactionHash);
    //   console.log(tx);
    //
    //   return tx;
    // } catch (e) {
    //   console.log('Transaction is not exist: ', e);
    //   return false;
    // }
  }

  async unstaked({ request }) {
    // try {
    //   console.log(`Check Transaction Exist in Blockchain with transaction_hash: ${transactionHash}`);
    //   const tx = await web3.eth.getTransaction(transactionHash);
    //   console.log(tx);
    //
    //   return tx;
    // } catch (e) {
    //   console.log('Transaction is not exist: ', e);
    //   return false;
    // }
  }


}

module.exports = MantraStakeController
