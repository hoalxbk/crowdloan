import { getRepository, getConnection } from 'typeorm';
import { ContractLog, CrawlStatus } from './entities';
import { prepareEnvironment } from 'wallet-core';
import { IEventLogCrawlerOptions, BaseEventLogCrawler } from './BaseEventLogCrawler';
import { EventLogCrawlerByWeb3 } from './EventLogCrawlerByWeb3';
import * as rawdb from './rawdb';
import * as _ from 'lodash';
import { getLogger } from 'sota-common';

const logger = getLogger('CampaignLogCrawler');

const argv = require('minimist')(process.argv.slice(2));
const contractName = 'ETHLink';
const networkConfig = require(`./configs/${process.env.NODE_ENV}`);
const contractConfig = networkConfig.contracts[contractName];
const { abi } = contractConfig.CONTRACT_DATA;

// Use in making contract log entity to insert DB
const contractNames = {
  ETHLink: 'ETHLink',
};
const ethLinkEvent = {
  ICORegistered: 'ICORegistered',
  NewCampaign: 'NewCampaign',
  PurchaseToken: 'PurchaseToken',
  AffiliateLink: 'AffiliateLink',
  AffiliateSubLink: 'AffiliateSubLink',
  ChangeEthLinkFee: 'ChangeEthLinkFee',
  ChangeMinEthPerTrade: 'ChangeMinEthPerTrade',
  IcoCampaignChanged: 'IcoCampaignChanged',
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

      console.log('LOG EVENT-TRANSACTION', eventLog, transaction, transactionReceipt);
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

  console.log('Entity', eventLog.type, JSON.stringify(eventLog));

  entity.returnValues = JSON.stringify(makeFieldReturnValues(eventLog));


  entity.from = makeFieldFrom(eventLog, transaction);
  console.log('11111==========');
  entity.to = makeFieldTo(eventLog, transaction);
  console.log('2222==========');
  entity.value = makeFieldValue(eventLog, transaction);
  console.log('3333==========', entity);

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
  if (contractName === contractNames.ETHLink) {
    switch (eventLog.event) {
      case ethLinkEvent.AffiliateLink: // OK
        // returnValues: Result {
        // '0': '0xa8CB9C1980983B5c912053828ee0BCb3492910eB',
        //   '1': '0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3',
        //   '2': '0',
        //   creator: '0xa8CB9C1980983B5c912053828ee0BCb3492910eB',
        //   tokenAddress: '0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3',
        //   campaignId: '0'
        // },
        return eventLog.returnValues.creator;
      case ethLinkEvent.ICORegistered: // OK
        // {
        //   "registeredBy": "0xa8CB9C1980983B5c912053828ee0BCb3492910eB",
        //   "tokenAddress": "0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3",
        //   "websiteAddress": "https://test3.com"
        // }
        return eventLog.returnValues.registeredBy;
      case ethLinkEvent.NewCampaign: // OK
        //   returnValues: Result {
        //   '0': '0xa8CB9C1980983B5c912053828ee0BCb3492910eB',
        //     '1': '210 new first',
        //     '2': '0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3',
        //     '3': '10',
        //     '4': '0',
        //     campaignCreator: '0xa8CB9C1980983B5c912053828ee0BCb3492910eB',
        //     name: '210 new first',
        //     tokenAddress: '0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3',
        //     commission: '10',
        //     campaignId: '0'
        //   },
        return eventLog.returnValues.campaignCreator;
      case ethLinkEvent.PurchaseToken: // OK
        // returnValues: Result {
        // '0': '0xba535ade958703Ffb99B9325ca8db04A00937029',
        //   '1': '0xa8CB9C1980983B5c912053828ee0BCb3492910eB',
        //   '2': '0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3',
        //   '3': '0',
        //   '4': '1000000000000000000',
        //   buyer: '0xba535ade958703Ffb99B9325ca8db04A00937029',
        //   referral: '0xa8CB9C1980983B5c912053828ee0BCb3492910eB',
        //   token: '0x13ECe8EAf4176445d8a28DDB70FB5Af0B8758fB3',
        //   campaignId: '0',
        //   amount: '1000000000000000000'
        // },
        return eventLog.returnValues.buyer;
      case ethLinkEvent.AffiliateSubLink: // NG
        return eventLog.returnValues.creator;
      case ethLinkEvent.ChangeEthLinkFee: // NG
        return eventLog.returnValues.registeredBy;
      case ethLinkEvent.ChangeMinEthPerTrade: // NG
        return eventLog.returnValues.registeredBy;
      case ethLinkEvent.IcoCampaignChanged: // NG
        break; // use default
    }
  }
  return transaction.from;
}

function makeFieldTo(eventLog: any, transaction: any) {
  if (contractName === contractNames.ETHLink) {
    switch (eventLog.event) {
      case ethLinkEvent.AffiliateLink:
        return eventLog.returnValues.tokenAddress;
      case ethLinkEvent.ICORegistered:
        return eventLog.returnValues.tokenAddress;
      case ethLinkEvent.NewCampaign:
        return eventLog.returnValues.tokenAddress;
      case ethLinkEvent.PurchaseToken:
        return eventLog.returnValues.token;

      case ethLinkEvent.AffiliateSubLink:
        return eventLog.returnValues.tokenAddress;
      case ethLinkEvent.ChangeEthLinkFee:
        return eventLog.returnValues.spender;
      case ethLinkEvent.ChangeMinEthPerTrade:
        return eventLog.returnValues.spender;
      case ethLinkEvent.IcoCampaignChanged: // NG
        break; // use default
    }
  }
  return transaction.to;
}

function makeFieldValue(eventLog: any, transaction: any) {
  if (contractName === contractNames.ETHLink) {
    switch (eventLog.event) {
      case ethLinkEvent.AffiliateLink:
        break; // use default
      case ethLinkEvent.ICORegistered:
        break; // use default
      case ethLinkEvent.NewCampaign:
        break; // use default
      case ethLinkEvent.PurchaseToken:
        break; // use default

      case ethLinkEvent.AffiliateSubLink:
        break; // use default
      case ethLinkEvent.ChangeEthLinkFee:
        break; // use default
      case ethLinkEvent.ChangeMinEthPerTrade:
        break; // use default
      case ethLinkEvent.IcoCampaignChanged:
        break; // use default
    }
  }
  return transaction.value;
}
