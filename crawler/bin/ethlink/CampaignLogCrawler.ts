import { getRepository, getConnection } from 'typeorm';
import { ContractLog, CrawlCampaignStatus, CrawlStatus } from './entities';
import { prepareEnvironment } from 'wallet-core';
import { IEventLogCrawlerOptions, BaseEventLogCrawler } from './BaseEventLogCrawler';
import { EventLogCampaignCrawlerByWeb3 } from './EventLogCampaignCrawlerByWeb3';
import * as rawdb from './rawdb';
import * as _ from 'lodash';
import { getLogger } from 'sota-common';

const logger = getLogger('CampaignLogCrawler');

const contractName = 'Campaign';
const networkConfig = require(`./configs/${process.env.NODE_ENV}`);
const contractConfig = networkConfig.contracts[contractName];
const { abi } = contractConfig.CONTRACT_DATA;
const Web3 = require('web3');

// Use in making contract log entity to insert DB
const contractNames = {
  Campaign: 'Campaign',
};
const campaignEvent = {
  // CampaignCreated: 'CampaignCreated',
  AllowTokenToTradeWithRate: 'AllowTokenToTradeWithRate',
  TokenPurchaseByEther: 'TokenPurchaseByEther',
  TokenPurchaseByToken: 'TokenPurchaseByToken',
  TokenPurchaseByEtherWithEthLink: 'TokenPurchaseByEtherWithEthLink',
  RefundedTokenForIcoWhenEndIco: 'RefundedTokenForIcoWhenEndIco',
  CloseTimeChanged: 'CloseTimeChanged',
  OpenTimeChanged: 'OpenTimeChanged',
  CampaignStatsChanged: 'CampaignStatsChanged',
  TokenClaimed: 'TokenClaimed',
};

prepareEnvironment()
  .then(start)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function getLatestCrawledBlockNumber(): Promise<number> {
  const log = await getRepository(CrawlStatus).findOne({ contractName });
  if (!log) {
    return NaN;
  }
  return log.blockNumber;
}

async function start(): Promise<void> {
  logger.info(`Start crawling event logs of contract: ${contractName}`);

  const crawlerOpts: IEventLogCrawlerOptions = {
    onEventLogCrawled,
    getLatestCrawledBlockNumber,
    networkConfig,
    contractConfig,
  };

  const crawler = new EventLogCampaignCrawlerByWeb3(crawlerOpts);
  crawler.start();
}

async function onEventLogCrawled(
  crawler: BaseEventLogCrawler,
  eventLogs: any,
  transactions: any,
  transactionReceipts: any,
  lastBlockNumber: number
): Promise<void> {
  await getConnection().transaction(async manager => {
    if (eventLogs && eventLogs.length) {
      console.log('eventLogs', eventLogs.length);
    }
    // if (lastBlockNumber) {
    //   console.log('lastBlockNumber', lastBlockNumber);
    // }

    await getConnection().transaction(async manager => {
      const contractLogEntities: ContractLog[] = [];
      for (const eventLog of eventLogs) {
        const transaction = _.find(transactions, tx => tx.hash === eventLog.transactionHash);
        const transactionReceipt = _.find(
          transactionReceipts,
          txReceipt => txReceipt.transactionHash === eventLog.transactionHash
        );

        contractLogEntities.push(await makeContractLogEntity(eventLog, transaction, transactionReceipt));
      }

      await manager.getRepository(ContractLog).save(contractLogEntities);

      if (contractConfig.NEED_NOTIFY_BY_WEBHOOK) {
        for (const entity of contractLogEntities) {
          await rawdb.insertWebhookProgress(manager, entity.id, entity.contractName, entity.event);
        }
      }

      if (lastBlockNumber > 0) {
        if (eventLogs && eventLogs.length > 0) {
          const event = eventLogs[0];
          const campaignAddress = event.address;
          const crawlCampaignStatus = await manager.getRepository(CrawlCampaignStatus).findOne({ campaignAddress });
          if (crawlCampaignStatus) {
            crawlCampaignStatus.blockNumber = lastBlockNumber;
            await manager.save(crawlCampaignStatus);
          }
        }
      }
    });
  });
}

// When change params of contract's event, need to update these below funcs
function makeContractLogEntity(eventLog: any, transaction: any, transactionReceipt: any) {
  const entity = new ContractLog();
  entity.contractName = contractName;
  entity.event = eventLog.event || '';

  console.log('Event: ', eventLog.event, eventLog);
  console.log('Entity: ', JSON.stringify(eventLog));
  if (!eventLog.event) {
    console.log('=============================START EMPTY EVENT');
    // console.log('Event: ', eventLog.event, eventLog);
    console.log('Transaction: ', transaction);
    console.log('transactionReceipt: ', transactionReceipt);
    console.log('=============================END');
  }

  entity.returnValues = JSON.stringify(makeFieldReturnValues(eventLog));

  entity.from = makeFieldFrom(eventLog, transaction);
  entity.to = makeFieldTo(eventLog, transaction);
  entity.value = makeFieldValue(eventLog, transaction);
  entity.blockNumber = eventLog.blockNumber;
  entity.blockHash = eventLog.blockHash;
  entity.transactionHash = eventLog.transactionHash;
  entity.transactionFrom = transaction.from;
  entity.transactionTo = transaction.to || 0;
  entity.transactionValue = transaction.value;
  entity.gas = transaction.gas;
  entity.gasPrice = transaction.gasPrice;
  entity.gasUsed = transactionReceipt.gasUsed;

  return entity;
}

function makeFieldReturnValues(eventLog: any) {
  const eventDef = _.find(abi, e => e.type === 'event' && e.name === eventLog.event);
  const res: any = {};

  if (!eventDef || !eventDef.inputs) {
    return res;
  }

  for (const input of eventDef.inputs) {
    res[input.name] = eventLog.returnValues[input.name];
    // if (contractName === contractNames.Campaign && input.type === 'bytes') {
    //   res[input.name] = Buffer.from(res[input.name].substr(2), 'hex').toString('utf8');
    // }
  }
  return res;
}

function makeFieldFrom(eventLog: any, transaction: any) {
  if (contractName === contractNames.Campaign) {
    switch (eventLog.event) {
      // case campaignEvent.CampaignCreated:
      //   break; // use default
      case campaignEvent.TokenPurchaseByEther:
        break; // use default
      case campaignEvent.TokenPurchaseByToken:
        break; // use default
      case campaignEvent.RefundedTokenForIcoWhenEndIco:
        break; // use default
      case campaignEvent.CampaignStatsChanged:
        break; // use default
      case campaignEvent.TokenClaimed:
        break; // use default
    }
  }
  return transaction.from;
}

function makeFieldTo(eventLog: any, transaction: any) {
  if (contractName === contractNames.Campaign) {
    switch (eventLog.event) {
      // case campaignEvent.CampaignCreated:
      //   break; // use default
      case campaignEvent.TokenPurchaseByEther:
        break; // use default
      case campaignEvent.TokenPurchaseByToken:
        break; // use default
      case campaignEvent.RefundedTokenForIcoWhenEndIco:
        break; // use default
      case campaignEvent.CampaignStatsChanged:
        break; // use default
      case campaignEvent.TokenClaimed:
        break; // use default
    }
  }
  return transaction.to;
}

function makeFieldValue(eventLog: any, transaction: any) {
  if (contractName === contractNames.Campaign) {
    switch (eventLog.event) {
      // case campaignEvent.CampaignCreated:
      //   break; // use default
      case campaignEvent.TokenPurchaseByEther:
        break; // use default
      case campaignEvent.TokenPurchaseByToken:
        break; // use default
      case campaignEvent.RefundedTokenForIcoWhenEndIco:
        break; // use default
      case campaignEvent.CampaignStatsChanged:
        break; // use default
      case campaignEvent.TokenClaimed:
        break; // use default
    }
  }
  return transaction.value;
}
