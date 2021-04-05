'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/', () => 'It\'s working')
Route.get('image/:fileName', 'FileController.getImage');

// Webhook
Route.group(() => {
  Route.post('ico-campaign', 'CampaignController.icoCampaignCreate')
  Route.post('edit-campaign', 'CampaignController.icoCampaignEdit')
  Route.post('campaign-status', 'CampaignController.CampaignEditStatus')
  Route.post('campaign-changed', 'CampaignController.CampaignChanged')
  Route.post('transaction', 'TransactionController.transactionCreate')
  Route.post('transaction-refund', 'TransactionController.transactionRefund')
  Route.post('affiliate-campaign', 'AffiliateCampaignController.affiliateCreate')
  Route.post('token-claimed', 'TransactionController.tokenClaimed')
}).prefix('webhook').middleware('checkJwtWebhook');

// ICO Owner User
Route.group(() => {
  Route.get('/contract/campaign-factories', 'ContractController.campaignFactories')
  Route.get('/contract/campaigns', 'ContractController.campaigns')
  // Route.post('campaign-create', 'CampaignController.campaignCreate')
  Route.get('campaigns', 'CampaignController.campaignList')
  Route.get('campaign-new', 'CampaignController.campaignNew')
  Route.get('campaigns/:campaign', 'CampaignController.campaignShow')
  Route.get('campaign-delete/:walletAddress/:campaign', 'CampaignController.campaignDelete')
  Route.get('transactions', 'TransactionController.transactionList')

  Route.post('asset-tokens', 'AssetTokenController.create')
  Route.get('asset-tokens/:contract', 'AssetTokenController.list')
  Route.delete('asset-tokens/delete/:id', 'AssetTokenController.remove')
  Route.get('affiliate-campaign/:token', 'AffiliateCampaignController.affiliateList')

  // Route.post('user/upload-avatar', 'UserController.uploadAvatar');
  Route.get('my-campaign', 'CampaignController.myCampaign')
  Route.get('my-campaign/:status', 'CampaignController.myCampaign').middleware('checkStatus')
}).middleware(['auth']);

// Investor User
Route.get('campaign-latest-active', 'CampaignController.campaignLastestActive')

Route.group(() => {
  Route.post('/login', 'UserAuthController.login').validator('Login').middleware('checkSignature');
  Route.post('/register', 'UserAuthController.register').validator('Register').middleware('checkSignature');
  Route.get('confirm-email/:token', 'UserController.confirmEmail'); // Confirm email when register
  Route.post('check-wallet-address', 'UserAuthController.checkWalletAddress');
  Route.get('check-token/:token', 'UserController.checkToken');
  Route.post('jwt/verify', 'UserAuthController.verifyJwtToken').middleware(['auth']);
  Route.get('profile', 'UserController.profile').middleware(['auth', 'checkRole']);
  Route.post('update-profile', 'UserController.updateProfile').middleware(['auth', 'checkRole']).validator('UpdateProfile');
  Route.get('my-campaign', 'CampaignController.myCampaign').middleware(['auth']);
  Route.get('my-campaign/:status', 'CampaignController.myCampaign').middleware('auth','checkStatus');
  Route.post('join-campaign', 'CampaignController.joinCampaign').middleware(['auth']);
  Route.get('whitelist/:campaignId', 'WhiteListUserController.getWhiteList').middleware('auth');
  Route.get('winner-list/:campaignId', 'WinnerListUserController.getWinnerList').middleware('auth');
}).prefix(':type').middleware(['checkPrefix']);

Route.get('dashboard/graph/:campaign', 'RevenueController.getRevenue').middleware(['checkIcoOwner', 'auth']);

Route.post(':type/check-max-usd', 'UserBuyCampaignController.checkBuy')
  .middleware(['checkPrefix', 'auth']);


// API V2
Route.get('latest-transaction', 'TransactionController.latestTransaction')
Route.get('public-campaign', 'CampaignController.myCampaign')
Route.get('public-campaign/:status', 'CampaignController.myCampaign').middleware('checkPublicStatus')
// Route.post('user/change-type', 'UserController.changeType').validator('ChangeUserType')
Route.post('user/buy', 'UserBuyCampaignController.getUserBuy').validator('CheckUserBought')
Route.get('coming-soon', 'ConfigController.getConfig')




