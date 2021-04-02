import { BaseEventLogCrawler } from './BaseEventLogCrawler';
import { getLogger, implement } from 'sota-common';
import pLimit from 'p-limit';

const logger = getLogger('EventLogCrawlerByWeb3');
const Web3 = require('web3');
const limit = pLimit(5);

export class EventLogCrawlerByWeb3 extends BaseEventLogCrawler {
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
