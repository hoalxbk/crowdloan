import { BaseEventLogCrawler } from './BaseEventLogCrawler';
import { getLogger, implement, override } from 'sota-common';
import pLimit from 'p-limit';
import { CrawlCampaignStatus, CrawlStatus } from './entities';
import { getConnection, getRepository } from 'typeorm';
import { Campaign } from './entities/Campaign';
const BigNumber = require('bignumber.js');
BigNumber.config({ EXPONENTIAL_AT: 30 });

const logger = getLogger('EventLogCampaignCrawlerByWeb3');
const Web3 = require('web3');
const limit = pLimit(5);

// Store in-progress block
let LATEST_PROCESSED_BLOCK = NaN;

export class EventLogCampaignCrawlerByWeb3 extends BaseEventLogCrawler {
  public currentContractAddress = '';
  public crawlCampaignStatus: any = [];

  @override
  protected async doProcess(): Promise<void> {
    // Firstly try to get latest block number from network
    const latestNetworkBlock = await this.getBlockCount();

    // And looking for the latest processed block in local
    let latestProcessedBlock = LATEST_PROCESSED_BLOCK;

    // If there's no data in-process, then try to find it from environment variable
    if (!latestProcessedBlock && this.getOptions().contractConfig.FORCE_CRAWL_BLOCK) {
      latestProcessedBlock = parseInt(this.getOptions().contractConfig.FORCE_CRAWL_BLOCK, 10);
    }

    // If still no data, use the callback in options to get the initial value for this process
    if (!latestProcessedBlock || isNaN(latestProcessedBlock)) {
      latestProcessedBlock = await this.getOptions().getLatestCrawledBlockNumber();
    }
    if (!latestProcessedBlock && this.getOptions().contractConfig.FIRST_CRAWL_BLOCK) {
      latestProcessedBlock = parseInt(this.getOptions().contractConfig.FIRST_CRAWL_BLOCK, 10);
    }

    // If there's no data, just process from the newest block on the network
    if (!latestProcessedBlock) {
      latestProcessedBlock = latestNetworkBlock - 1;
    }

    /**
     * Start with the next block of the latest processed one
     */
    const fromBlockNumber = latestProcessedBlock + 1;

    /**
     * If crawled the newest block already
     * Wait for a period that is equal to average block time
     * Then try crawl again (hopefully new block will be available then)
     */
    if (fromBlockNumber > latestNetworkBlock) {
      logger.info(
        `Block <${fromBlockNumber}> is the newest block can be processed (on network: ${latestNetworkBlock}). Wait for the next tick...`
      );
      return;
    }

    /**
     * Try to process several blocks at once, up to the newest one on the network
     */
    let toBlockNumber = latestProcessedBlock + this.getBlockNumInOneGo();
    if (toBlockNumber > latestNetworkBlock) {
      toBlockNumber = latestNetworkBlock;
    }

    /**
     * Actual crawl and process blocks
     * about 10 minutes timeout based on speed of gateway
     */
    await this.processCampaignBlocks(fromBlockNumber, toBlockNumber, latestNetworkBlock);

    /**
     * Cache the latest processed block number
     * Do the loop again in the next tick
     */
    LATEST_PROCESSED_BLOCK = toBlockNumber;

    if (toBlockNumber >= latestNetworkBlock) {
      // If the newest block is processed already, will check the next tick after 1 block time duration
      logger.info(`Have processed newest block already. Will wait for a while until next check...`);
      this.setNextTickTimer(this.getAverageBlockTime());
    } else {
      // Otherwise try to continue processing immediately
      this.setNextTickTimer(this.getBreakTimeAfterOneGo());
    }

    return;
  }

  protected async processCampaignBlocks(
    fromBlockNumber: number,
    toBlockNumber: number,
    latestNetworkBlock: number
  ): Promise<void> {
    logger.info(
      `processBlocks BEGIN_PROCESS_CAMPAIGN_BLOCKS: ${fromBlockNumber}→${toBlockNumber} / ${latestNetworkBlock}`
    );

    const crawlCampaignStatus = await getRepository(CrawlCampaignStatus).find();
    console.log('GETNEW', crawlCampaignStatus.length);
    if (crawlCampaignStatus && crawlCampaignStatus.length > 0) {
      Promise.all(
        crawlCampaignStatus.map(async (item: any) => {
          const campaignAddress = item.campaignAddress;
          const currentCampaign = await getRepository(Campaign).findOne({ campaignHash: campaignAddress });
          if (!currentCampaign) {
            console.log('CURRRENT CAMPAIGN NOT FOUND', campaignAddress);
            return;
          }

          // TODO: Uncomment for performance
          // Check Campaign is active time
          logger.info(`Contract ADDRESS: ${JSON.stringify(campaignAddress)}`);
          const now = new Date().getTime();
          const startTime = new BigNumber(currentCampaign.startTime).multipliedBy(1000).minus(300000).toFixed();  // 300000 = 5 minutes
          const finishTime = new BigNumber(currentCampaign.finishTime).multipliedBy(1000).toFixed();
          // // if ((now < startTime) || (now > finishTime)) {
          // if (now > finishTime) {
          //   // console.log('IGNORE CRAWL CAMPAIGN');
          //   return;
          // }
          console.log('CRAWL CAMPAIGN: ', campaignAddress);

          const web3 = new Web3(this.getOptions().networkConfig.WEB3_API_URL);
          const { abi } = this.getOptions().contractConfig.CONTRACT_DATA;
          const contract = new web3.eth.Contract(abi, campaignAddress);
          const eventLogs = await contract.getPastEvents(
            'allEvents',
            {
              fromBlock: fromBlockNumber,
              toBlock: toBlockNumber,
            },
            (err: any) => {
              if (err) {
                logger.error(err);
              }
            }
          );

          const transactions = await this.getTransactions(eventLogs);
          if (transactions && transactions.length) {
            console.log('TRANSACTION', transactions.length);
          }
          const transactionReceipts = await this.getTransactionReceipts(eventLogs);
          if (transactionReceipts && transactionReceipts.length) {
            console.log('transactionReceipts', transactionReceipts.length);
          }
          await this.getOptions().onEventLogCrawled(this, eventLogs, transactions, transactionReceipts, toBlockNumber);

          logger.info(
            `processBlocks FINISH_PROCESS_CAMPAIGN_BLOCKS: ${fromBlockNumber}→${toBlockNumber} logs:${eventLogs.length}`
          );
        })
      ).then(
        async (): Promise<void> => {
          const contractName = 'Campaign';
          await getConnection().transaction(async manager => {
            const lastBlockNumber = toBlockNumber;
            if (lastBlockNumber > 0) {
              let crawlStatus = await manager.getRepository(CrawlStatus).findOne({ contractName });
              if (crawlStatus) {
                crawlStatus.blockNumber = toBlockNumber;
                await manager.save(crawlStatus);
              } else {
                crawlStatus = new CrawlStatus();
                crawlStatus.contractName = contractName;
                crawlStatus.blockNumber = toBlockNumber;
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
      );

      console.log('Pending to wait....');
    }
  }

  /**
   * Process several blocks in one go. Just use single database transaction
   * @param {number} fromBlockNumber - begin of crawling blocks range
   * @param {number} toBlockNumber - end of crawling blocks range
   * @param {number} latestNetworkBlock - recent height of blockchain in the network
   *
   * @returns {number} the highest block that is considered as confirmed
   */
  @implement
  protected async processBlocks(
    fromBlockNumber: number,
    toBlockNumber: number,
    latestNetworkBlock: number
  ): Promise<void> {
    logger.info(`processBlocks BEGIN_PROCESS_BLOCKS: ${fromBlockNumber}→${toBlockNumber} / ${latestNetworkBlock}`);

    logger.info(`Contract ADDRESS: ${JSON.stringify(this.getOptions().contractConfig.CONTRACT_ADDRESS)}`);

    const web3 = new Web3(this.getOptions().networkConfig.WEB3_API_URL);
    const { abi } = this.getOptions().contractConfig.CONTRACT_DATA;
    const contract = new web3.eth.Contract(abi, this.getOptions().contractConfig.CONTRACT_ADDRESS);

    const eventLogs = await contract.getPastEvents(
      'allEvents',
      {
        fromBlock: fromBlockNumber,
        toBlock: toBlockNumber,
      },
      (err: any) => {
        if (err) {
          logger.error(err);
        }
      }
    );

    const transactions = await this.getTransactions(eventLogs);
    const transactionReceipts = await this.getTransactionReceipts(eventLogs);

    await this.getOptions().onEventLogCrawled(this, eventLogs, transactions, transactionReceipts, toBlockNumber);

    logger.info(`processBlocks FINISH_PROCESS_BLOCKS: ${fromBlockNumber}→${toBlockNumber} logs:${eventLogs.length}`);
  }

  @implement
  protected async getBlockCount(): Promise<number> {
    const web3 = new Web3(this.getOptions().networkConfig.WEB3_API_URL);
    const latestBlockNumber = await web3.eth.getBlockNumber();
    return latestBlockNumber - this.getRequiredConfirmation();
  }

  private async getTransactions(eventLogs: []): Promise<object[]> {
    return Promise.all(
      eventLogs.map(async (eventLog: any) => limit(() => this.getTransaction(eventLog.transactionHash)))
    );
  }

  private async getTransaction(txHash: string): Promise<object> {
    const web3 = new Web3(this.getOptions().networkConfig.WEB3_API_URL);
    return web3.eth.getTransaction(txHash);
  }

  private async getTransactionReceipts(eventLogs: []): Promise<object[]> {
    return Promise.all(
      eventLogs.map(async (eventLog: any) => limit(() => this.getTransactionReceipt(eventLog.transactionHash)))
    );
  }

  private async getTransactionReceipt(txHash: string): Promise<object> {
    const web3 = new Web3(this.getOptions().networkConfig.WEB3_API_URL);
    return web3.eth.getTransactionReceipt(txHash);
  }
}
