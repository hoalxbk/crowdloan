import 'sota-common';
import { prepareEnvironment } from 'wallet-core';
import { WebhookProcessor } from './WebhookProcessor';

prepareEnvironment()
  .then(start)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

function start(): void {
  const worker = new WebhookProcessor();
  worker.start();
}
