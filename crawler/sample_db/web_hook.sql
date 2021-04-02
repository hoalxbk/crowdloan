INSERT INTO `webhook` (`id`, `contract_name`, `type`, `url`, `created_at`, `updated_at`)
VALUES
	(1, 'Campaign', 'TokenPurchaseByEther', 'http://0.0.0.0:3333/webhook/token-purchase-by-eth', 0, 0),
	(2, 'Campaign', 'TokenPurchaseByToken', 'http://0.0.0.0:3333/webhook/token-purchase-by-token', 0, 0),
	(3, 'CampaignFactory', 'IcoCampaignCreated', 'http://0.0.0.0:3333/webhook/campaign', 0, 0),
	(4, 'Campaign', 'NewCampaign', 'http://0.0.0.0:3333/webhook/affiliate-campaign', 0, 0),
	(5, 'ETHLink', 'ICORegistered', 'http://0.0.0.0:3333/webhook/ico-registered', 0, 0),
	(6, 'ETHLink', 'AffiliateLink', 'http://0.0.0.0:3333/webhook/affiliate-link', 0, 0),
	(7, 'ETHLink', 'PurchaseToken', 'http://0.0.0.0:3333/webhook/purchase-token', 0, 0);
