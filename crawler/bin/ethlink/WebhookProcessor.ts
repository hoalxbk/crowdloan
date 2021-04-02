import fetch from 'node-fetch';
import { EntityManager, getConnection, LessThan } from 'typeorm';
import { BaseIntervalWorker, getLogger, Utils } from 'sota-common';
import { Webhook, WebhookProgress } from './entities';
import * as rawdb from './rawdb';
import { ContractLog } from './entities';
import { Const } from './Const';

const logger = getLogger('WebhookProcessor');

export class WebhookProcessor extends BaseIntervalWorker {
  protected _nextTickTimer: number = 10000;

  protected async prepare(): Promise<void> {
    // Nothing to do...
  }

  protected async doProcess(): Promise<void> {
    return getConnection().transaction(async manager => {
      try {
        await this._doProcess(manager);
      } catch (e) {
        logger.error(`WebhookProcessor do process failed with error`);
        logger.error(e);
      }
    });
  }

  private async _doProcess(manager: EntityManager): Promise<void> {
    const progressRecord = await manager.getRepository(WebhookProgress).findOne(
      { isProcessed: false, tryNum: LessThan(Const.WEBHOOK.MAX_TRY_NUM) },
      {
        order: { updatedAt: 'ASC' },
      }
    );
    if (!progressRecord) {
      logger.debug(`No pending webhook to call. Let's wait for the next tick...`);
      return;
    }
    const now = Utils.nowInMillis();
    if (progressRecord.tryNum > 0 && now < progressRecord.retryAt) {
      progressRecord.updatedAt = now;
      manager.getRepository(WebhookProgress).save(progressRecord);
      return;
    }

    const webhookId = progressRecord.webhookId;
    const webhookRecord = await manager.getRepository(Webhook).findOne(webhookId);
    if (!webhookRecord) {
      throw new Error(`Progress <${progressRecord.id}> has invalid webhook id: ${webhookId}`);
    }

    const url = webhookRecord.url;
    if (!url) {
      logger.error(`Webhook <${webhookId}> has invalid url: ${url}`);
      return;
    }

    const refId = progressRecord.refId;
    const data = await this._getRefData(manager, refId);

    // Call webhook
    const method = 'POST';
    const body = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`,
      WebhookToken: `${process.env.WEBHOOK_API_TOKEN}`,
    };

    console.log('WebhookProcessor: WEBHOOK Header:', headers);

    const timeout = 5000;
    let status: number;
    let msg: string;

    try {
      const resp = await fetch(url, { method, body, headers, timeout });
      status = resp.status;
      msg = resp.statusText || JSON.stringify(resp.json());

      progressRecord.tryNum += 1;
      if (status === 200) {
        progressRecord.isProcessed = true;
      } else {
        progressRecord.isProcessed = false;
        progressRecord.retryAt = now + Const.WEBHOOK.WAIT_TIME_FOR_RETRY;
      }
      logger.debug(`Progress <${progressRecord.id}> status:${status}`);
    } catch (err) {
      status = 0;
      msg = err.toString();
      progressRecord.isProcessed = false;
      logger.debug(`Progress <${progressRecord.id}> err:${msg}`);
    }

    progressRecord.updatedAt = now;

    // Update progress & store log record
    await Utils.PromiseAll([
      rawdb.insertWebhookLog(manager, progressRecord.id, url, body, status, msg),
      manager.getRepository(WebhookProgress).save(progressRecord),
    ]);

    return;
  }

  private async _getRefData(manager: EntityManager, refId: number): Promise<object> {
    const data = await manager.getRepository(ContractLog).findOne(refId);
    if (!data) {
      throw new Error(`Could not find deposit id=${refId}`);
    }
    return {
      event: data.event,
      params: JSON.parse(data.returnValues),
      txHash: data.transactionHash,
    };
  }
}
