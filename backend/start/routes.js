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

const Const = use('App/Common/Const');

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

  Route.post('mantra-stake/index-stake-info', 'MantraStakeController.indexStakeInfo');
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

  Route.get('my-campaign', 'CampaignController.myCampaign')
  Route.get('my-campaign/:status', 'CampaignController.myCampaign').middleware('checkStatus');
}).middleware(['typeAdmin', 'auth:admin', 'checkAdminJwtSecret']);

Route.group(() => {
  Route.post('/login', 'AuthAdminController.login').validator('Login').middleware('checkSignature');
  Route.post('/register', 'AuthAdminController.adminRegister').validator('Register').middleware('checkSignature');
  Route.get('confirm-email/:token', 'AdminController.confirmEmail'); // Confirm email when register
  Route.post('forgot-password', 'AdminController.forgotPassword').validator('ForgotPassword').middleware('checkSignature');
  Route.get('check-wallet-address', 'AuthAdminController.checkWalletAddress');
  Route.post('check-wallet-address', 'AuthAdminController.checkWalletAddress');
  Route.get('check-token/:token', 'AdminController.checkToken');
  Route.post('reset-password/:token', 'AdminController.resetPassword').validator('ResetPassword').middleware('checkSignature');
  Route.post('upload-avatar', 'FileController.uploadAvatar');

  Route.post('pool/create', 'PoolController.createPool');
  Route.post('pool/:campaignId/update', 'PoolController.updatePool');
  Route.get('pool/:campaignId', 'PoolController.getPoolAdmin');
  Route.post('pool/:campaignId/deploy-success', 'PoolController.updateDeploySuccess');
  Route.post('pool/:campaignId/change-display', 'PoolController.changeDisplay');

  // Participants
  Route.get('pool/:campaignId/participants', 'WhiteListUserController.getParticipants');
  Route.delete('pool/:campaignId/participants/:walletAddress/delete', 'WhiteListUserController.deleteWhiteList');
  Route.post('pool/winner-random/:campaignId/:number', 'WhiteListUserController.getRandomWinners');

  // Winners
  Route.get('pool/:campaignId/winners', 'WinnerListUserController.getWinnerList');
  Route.delete('pool/:campaignId/winners/:walletAddress/delete', 'WinnerListUserController.deleteWinner');
  Route.post('pool/:campaignId/winners/add-to-winner', 'WinnerListUserController.addParticipantsToWinner');

  // Reserve
  Route.get('pool/:campaignId/reserves', 'ReservedListController.getReservedList');
  Route.post('pool/:campaignId/reserves/add', 'ReservedListController.addReserveUser');
  Route.delete('pool/:campaignId/reserves/:walletAddress/delete', 'ReservedListController.deleteReserve');
  Route.post('pool/reserves/update-setting', 'ReservedListController.updateReserveSetting');
  Route.get('pool/reserves/setting', 'ReservedListController.reserveSetting');

  Route.put('active-kyc', 'UserController.activeKyc');//.middleware(['formatEmailAndWallet']);

}).prefix(Const.USER_TYPE_PREFIX.ICO_OWNER).middleware(['typeAdmin', 'checkPrefix', 'formatEmailAndWallet']);

Route.group(() => {
  Route.get('profile', 'AdminController.profile').middleware(['auth:admin', 'checkRole']);
  Route.post('change-password', 'AdminController.changePassword').middleware(['checkSignature', 'auth:admin', 'checkRole']);
  Route.post('update-profile', 'AdminController.updateProfile').middleware(['auth:admin', 'checkRole']).validator('UpdateProfile');
  Route.post('transaction-create', 'TransactionController.transactionAdd').middleware(['auth:admin']);

  Route.get('admins', 'AdminController.adminList').middleware(['auth:admin']);
  Route.get('admins/:id', 'AdminController.adminDetail').middleware(['auth:admin']);
  Route.post('admins', 'AdminController.create').middleware(['auth:admin']);
  Route.put('admins/:id', 'AdminController.update').middleware(['auth:admin']);

}).prefix(Const.USER_TYPE_PREFIX.ICO_OWNER).middleware(['typeAdmin', 'checkPrefix', 'checkAdminJwtSecret']); //user/public







// Investor User
Route.get('campaign-latest-active', 'CampaignController.campaignLatestActive')

Route.group(() => {
  Route.post('/login', 'UserAuthController.login').validator('Login').middleware('checkSignature');
  Route.post('/register', 'UserAuthController.register').validator('Register').middleware('checkSignature');
  Route.post('/register-email', 'UserAuthController.registerVerifyEmail').middleware('checkSignature');

  Route.get('confirm-email/:token', 'UserController.confirmEmail'); // Confirm email when register
  Route.get('check-wallet-address', 'UserAuthController.checkWalletAddress');
  Route.post('check-wallet-address', 'UserAuthController.checkWalletAddress');
  Route.get('check-token/:token', 'UserController.checkToken');
  Route.post('reset-password/:token', 'UserController.resetPassword').validator('ResetPassword').middleware('checkSignature');
  Route.get('profile', 'UserController.profile').middleware(['maskEmailAndWallet']);
  Route.post('check-active', 'UserController.checkUserActive');

  Route.post('join-campaign', 'CampaignController.joinCampaign').middleware(['checkSignature']);
  Route.post('deposit', 'CampaignController.deposit').middleware(['checkSignature']);
  Route.post('claim', 'CampaignController.claim').middleware(['checkSignature']);
  Route.get('whitelist-search/:campaignId', 'WhiteListUserController.search');
  Route.get('winner-random/:campaignId/:number', 'WhiteListUserController.getRandomWinners');
  Route.get('winner-list/:campaignId', 'WinnerListUserController.getWinnerList').middleware(['maskEmailAndWallet']);
  Route.get('winner-search/:campaignId', 'WinnerListUserController.search').middleware(['maskEmailAndWallet']);
  Route.get('counting/:campaignId', 'CampaignController.countingJoinedCampaign');
  Route.get('check-join-campaign/:campaignId', 'CampaignController.checkJoinedCampaign');

}).prefix(Const.USER_TYPE_PREFIX.PUBLIC_USER).middleware(['typeUser',  'checkPrefix', 'formatEmailAndWallet']);// , 'maskEmailAndWallet'

Route.post(':type/check-max-usd', 'UserBuyCampaignController.checkBuy')
  .middleware(['checkPrefix', 'auth', 'checkJwtSecret']);

// Public API:
Route.get('pools', 'PoolController.getPoolList');
Route.get('pools/top-pools', 'PoolController.getTopPools');
Route.get('pools/user/:walletAddress/joined-pools', 'PoolController.getJoinedPools');

Route.get('pool/:campaignId', 'PoolController.getPoolPublic');
Route.get('pool/:campaignId/tiers', 'TierController.getTiers');
Route.get('pool/:campaignId/winners', 'WinnerListUserController.getWinnerAndReserveList');
Route.get('pool/:campaignId/user/:walletAddress/current-tier', 'UserController.getCurrentTier');
Route.post('user/check-email-verified', 'UserController.checkEmailVerified');
Route.get('pool/:campaignId/check-exist-winner', 'WinnerListUserController.checkExistWinner').validator('CheckUserWinnerExist');

// API For Testing
// TODO: Need delete when done
// Route.get('pool/:campaignId/check-exist-reverse', 'WinnerListUserController.checkExistReserve');
// Route.get('pool/:campaignId/participants', 'WhiteListUserController.getPublicParticipants');
// Route.get('pool/:campaignId/reserves', 'WinnerListUserController.getWinnerList');
// Route.post('add-user-whitelist', 'WhiteListUserController.addWhitelistUser');
// Route.post('add-user-winner', 'WinnerListUserController.addWinnerUser');


// API V2
Route.get('dashboard/graph/:campaign', 'RevenueController.getRevenue').middleware(['checkIcoOwner', 'checkJwtSecret', 'auth']);

Route.get('latest-transaction', 'TransactionController.latestTransaction')
Route.get('public-campaign', 'CampaignController.myCampaign')
Route.get('public-campaign/:status', 'CampaignController.myCampaign').middleware('checkPublicStatus')
Route.post('user/change-type', 'UserController.changeType').validator('ChangeUserType')
Route.post('user/buy', 'UserBuyCampaignController.getUserBuy').validator('CheckUserBought')
Route.get('coming-soon', 'ConfigController.getConfig')


