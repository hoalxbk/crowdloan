#!/bin/sh

cd dist
dockerize \
  node bin/ethlink/${CRAWLER_FILE}.js

# dist/bin/ethlink/CampaignFactoryLogCrawler.js
# dist/bin/ethlink/CampaignLogCrawler.js
# dist/bin/ethlink/ETHLinkEventLogCrawler.js
# dist/bin/ethlink/WebhookWorker.js