import { EntityManager } from 'typeorm';
import { Webhook, WebhookProgress } from '../entities';
import { getLogger, Utils } from 'sota-common';

const logger = getLogger('rawdb::insertWebhookProgress');

/**
 * Anytime an event happens and need to notify to client, one or some webhook progresses are created
 * There will be a webhook processor, which picks the pending progress records and dispatch them to target urls later
 *
 * @param {EntityManager} manager
 * @param {number} refId - the ID of contract_logs
 * @param {string} type - contract event type
 */
export async function insertWebhookProgress(
  manager: EntityManager,
  refId: number,
  contractName: string,
  type: string
): Promise<void> {
  // Find out all user webhooks first
  const webhooks = await manager.getRepository(Webhook).find({ contractName, type });

  // Construct the records
  const progressRecords = webhooks.map(webhook => {
    const record = new WebhookProgress();
    record.webhookId = webhook.id;
    record.refId = refId;
    record.createdAt = Utils.nowInMillis();
    record.updatedAt = Utils.nowInMillis();
    return record;
  });

  if (progressRecords.length === 0) {
    logger.debug(
      `Webhook is ignored because user does not have webhook registered: contractName=${contractName}, type=${type}`
    );
    return;
  }

  // And persist them to database
  await manager.getRepository(WebhookProgress).save(progressRecords);

  logger.debug(`Created webhook progress: contractName=${contractName}, type=${type}, refId=${refId}`);
  return;
}

export default insertWebhookProgress;
