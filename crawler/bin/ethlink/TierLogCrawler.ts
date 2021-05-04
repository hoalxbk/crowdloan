import { getRepository, getConnection } from 'typeorm';
import { ContractLog, CrawlStatus, CrawlCampaignStatus } from './entities';
import { prepareEnvironment } from 'wallet-core';
import { IEventLogCrawlerOptions, BaseEventLogCrawler } from './BaseEventLogCrawler';
import { EventLogCrawlerByWeb3 } from './EventLogCrawlerByWeb3';
import * as rawdb from './rawdb';
import * as _ from 'lodash';
import { getLogger } from 'sota-common';

const logger = getLogger('TierLogCrawler');
const argv = require('minimist')(process.argv.slice(2));

const contractName = 'Tier';
const networkConfig = require(`./configs/${process.env.NODE_ENV}`);
const contractConfig = networkConfig.contracts[contractName];
const { abi } = contractConfig.CONTRACT_DATA;

const campaignFactoryEvent = {
  StakedERC20: 'StakedERC20',
  StakedSingleERC721: 'StakedSingleERC721',
  StakedBatchERC721: 'StakedBatchERC721',
  WithdrawnERC20: 'WithdrawnERC20',
  WithdrawnSingleERC721: 'WithdrawnSingleERC721',
  WithdrawnBatchERC721: 'WithdrawnBatchERC721',
  EmergencyWithdrawnERC20: 'EmergencyWithdrawnERC20',
  EmergencyWithdrawnERC721: 'EmergencyWithdrawnERC721',
  AddExternalToken: 'AddExternalToken',
  ExternalTokenStatsChange: 'ExternalTokenStatsChange',
  ChangePenaltyWallet: 'ChangePenaltyWallet',
};

prepareEnvironment()
  .then(start)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

function start(): void {
  logger.info(`Start crawling event logs of contract: ${contractName}`);

  const crawlerOpts: IEventLogCrawlerOptions = {
    onEventLogCrawled,
    getLatestCrawledBlockNumber,
    networkConfig,
    contractConfig,
  };

  const crawler = new EventLogCrawlerByWeb3(crawlerOpts);
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
    const contractLogEntities: ContractLog[] = [];
    for (const eventLog of eventLogs) {
      const transaction = _.find(transactions, tx => tx.hash === eventLog.transactionHash);
      const transactionReceipt = _.find(
        transactionReceipts,
        txReceipt => txReceipt.transactionHash === eventLog.transactionHash
      );
      contractLogEntities.push(makeContractLogEntity(eventLog, transaction, transactionReceipt));
    }
    await manager.getRepository(ContractLog).save(contractLogEntities);

    if (contractConfig.NEED_NOTIFY_BY_WEBHOOK) {
      for (const entity of contractLogEntities) {
        await rawdb.insertWebhookProgress(manager, entity.id, entity.contractName, entity.event);
      }
    }

    if (lastBlockNumber > 0) {
      let crawlStatus = await manager.getRepository(CrawlStatus).findOne({ contractName });
      if (crawlStatus) {
        crawlStatus.blockNumber = lastBlockNumber;
        await manager.save(crawlStatus);
      } else {
        crawlStatus = new CrawlStatus();
        crawlStatus.contractName = contractName;
        crawlStatus.blockNumber = lastBlockNumber;
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(CrawlStatus)
          .values(crawlStatus)
          .execute();
      }
    }
  });
}

async function getLatestCrawledBlockNumber(): Promise<number> {
  const log = await getRepository(CrawlStatus).findOne({ contractName });
  if (!log) {
    return NaN;
  }
  return log.blockNumber;
}

// When change params of contract's event, need to update these below funcs
function makeContractLogEntity(eventLog: any, transaction: any, transactionReceipt: any) {
  const entity = new ContractLog();
  entity.contractName = contractName;
  entity.event = eventLog.event;

  // console.log('Entity', eventLog.type, JSON.stringify(eventLog));

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
  for (const input of eventDef.inputs) {
    res[input.name] = eventLog.returnValues[input.name];
    // if (contractName === contractNames.Campaign && input.type === 'bytes') {
    //   res[input.name] = Buffer.from(res[input.name].substr(2), 'hex').toString('utf8');
    // }
  }
  return res;
}

function makeFieldFrom(eventLog: any, transaction: any) {
  switch (eventLog.event) {
    case campaignFactoryEvent.StakedERC20:
      break; // use default
    case campaignFactoryEvent.StakedSingleERC721:
      break; // use default
    case campaignFactoryEvent.StakedBatchERC721:
      break; // use default
    case campaignFactoryEvent.WithdrawnERC20:
      break; // use default
    case campaignFactoryEvent.WithdrawnSingleERC721:
      break; // use default
    case campaignFactoryEvent.WithdrawnBatchERC721:
      break; // use default
    case campaignFactoryEvent.EmergencyWithdrawnERC20:
      break; // use default
    case campaignFactoryEvent.EmergencyWithdrawnERC721:
      break; // use default
    case campaignFactoryEvent.AddExternalToken:
      break; // use default
    case campaignFactoryEvent.ExternalTokenStatsChange:
      break; // use default
    case campaignFactoryEvent.ChangePenaltyWallet:
      break; // use default
  }
  return transaction.from;
}

function makeFieldTo(eventLog: any, transaction: any) {
  switch (eventLog.event) {
    case campaignFactoryEvent.StakedERC20:
      break; // use default
    case campaignFactoryEvent.StakedSingleERC721:
      break; // use default
    case campaignFactoryEvent.StakedBatchERC721:
      break; // use default
    case campaignFactoryEvent.WithdrawnERC20:
      break; // use default
    case campaignFactoryEvent.WithdrawnSingleERC721:
      break; // use default
    case campaignFactoryEvent.WithdrawnBatchERC721:
      break; // use default
    case campaignFactoryEvent.EmergencyWithdrawnERC20:
      break; // use default
    case campaignFactoryEvent.EmergencyWithdrawnERC721:
      break; // use default
    case campaignFactoryEvent.AddExternalToken:
      break; // use default
    case campaignFactoryEvent.ExternalTokenStatsChange:
      break; // use default
    case campaignFactoryEvent.ChangePenaltyWallet:
      break; // use default
  }
  return transaction.to;
}

function makeFieldValue(eventLog: any, transaction: any) {
  switch (eventLog.event) {
    case campaignFactoryEvent.StakedERC20:
      break; // use default
    case campaignFactoryEvent.StakedSingleERC721:
      break; // use default
    case campaignFactoryEvent.StakedBatchERC721:
      break; // use default
    case campaignFactoryEvent.WithdrawnERC20:
      break; // use default
    case campaignFactoryEvent.WithdrawnSingleERC721:
      break; // use default
    case campaignFactoryEvent.WithdrawnBatchERC721:
      break; // use default
    case campaignFactoryEvent.EmergencyWithdrawnERC20:
      break; // use default
    case campaignFactoryEvent.EmergencyWithdrawnERC721:
      break; // use default
    case campaignFactoryEvent.AddExternalToken:
      break; // use default
    case campaignFactoryEvent.ExternalTokenStatsChange:
      break; // use default
    case campaignFactoryEvent.ChangePenaltyWallet:
      break; // use default
  }
  return transaction.value;
}
