'use strict'

const Config = use('Config');
const Helpers = use('Helpers');
const Const = use('App/Common/Const');
const Env = use('Env');
const Hash = use('Hash');
const Event = use('Event')

const ErrorFactory = use('App/Common/ErrorFactory');
const ReservedListService = use('App/Services/ReservedListService');
const UserService = use('App/Services/UserService')
const UserModel = use('App/Models/User');
const TierModel = use('App/Models/Tier');
const WinnerModel = use('App/Models/WinnerListUser');
const PasswordResetModel = use('App/Models/PasswordReset');
const HelperUtils = use('App/Common/HelperUtils');
const randomString = use('random-string');

const SendForgotPasswordJob = use('App/Jobs/SendForgotPasswordJob');

class UserController {
  async profile({ request }) {
    const userService = new UserService();
    const params = request.all();
    const userAuthInfo = {
      wallet_address: params.wallet_address,
    };

    const findedUser = await UserModel.query().where('wallet_address', params.wallet_address).first();
    console.log('[profile] - findedUser', findedUser);
    if (!findedUser) {
      return HelperUtils.responseNotFound();
    }

    return HelperUtils.responseSuccess({
      user: {
        email: findedUser.email,
        id: findedUser.id,
        status: findedUser.status,
        is_kyc: findedUser.is_kyc,
      }
    });
  }

  async updateProfile({ request, auth }) {
    try {
      let user = auth.user;
      const params = request.only(['firstname', 'lastname']);
      const userService = new UserService();
      const userAuthInfo = {
        email: user.email,
        role: user.role,
      };
      user = await userService.findUser(userAuthInfo);
      if (!user) {
        return HelperUtils.responseNotFound('User Not Found');
      }

      const result = await userService.updateUser(params, userAuthInfo);
      if (!result) {
        return HelperUtils.responseErrorInternal('Update Fail');
      }

      return HelperUtils.responseSuccess({
        user: await userService.findUser(userAuthInfo),
      }, 'Update Success');
    } catch (e) {
      console.log(e);
      return ErrorFactory.internal('ERROR: Update profile fail!');
    }
  }

  // async uploadAvatar({request}) {
  //   const validationOptions = {
  //     types: ['image'],
  //     size: Const.FILE_SITE,
  //     extnames: Const.FILE_EXT
  //   };
  //
  //   const profilePic = request.file('avatar', validationOptions);
  //   const timeStamp = Date.now();
  //   const fileName = timeStamp + '_' + (profilePic.clientName || '').replace(/\s/g, '_');
  //   await profilePic.move(Helpers.tmpPath('uploads'), {
  //     name: fileName,
  //     overwrite: true
  //   });
  //   if (!profilePic.moved()) {
  //     return profilePic.error()
  //   }
  //
  //   return HelperUtils.responseSuccess({ fileName });
  // }

  async forgotPassword({request}) {
    const params = request.all();
    const role =  request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
    const userService = new UserService();
    const user = await userService.findUser({
      email: params.email,
      wallet_address: params.wallet_address,
      role,
    });
    if (!user) {
      console.error('user not found.')
      return HelperUtils.responseSuccess();
    }
    const token = await userService.resetPasswordEmail(params.email, role);
    const mailData = {};
    mailData.username = user.username;
    mailData.email = user.email;
    mailData.token = token;

    const isAdmin = request.params.type === Const.USER_TYPE_PREFIX.ICO_OWNER;
    const baseUrl = isAdmin ? Env.get('FRONTEND_ADMIN_APP_URL') : Env.get('FRONTEND_USER_APP_URL');
    mailData.url = baseUrl + '/#/reset-password/' + (isAdmin ? 'user/' : 'investor/') + token;

    SendForgotPasswordJob.doDispatch(mailData);

    return HelperUtils.responseSuccess();
  }

  async checkToken({request}) {
    try {
      const token =  request.params.token;
      const role =  request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ?  Const.USER_ROLE.ICO_OWNER :  Const.USER_ROLE.PUBLIC_USER;
      const userService = new UserService();
      const checkToken = await userService.checkToken(token, role);
      return HelperUtils.responseSuccess({
        data: checkToken,
        status: 200,
      });
    } catch (e) {
      console.log('ERROR: ', e);
      if (e.status === 400) {
        return HelperUtils.responseNotFound(e.message);
      } else {
        return HelperUtils.responseErrorInternal(e.message);
      }
    }
  }

  async resetPassword({request, auth}) {
    try {
      const params = request.all();
      const wallet_address = params.wallet_address;
      const token = request.params.token;
      const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
      const userService = new UserService();
      const checkToken = await userService.checkToken(token, role);

      if (checkToken) {
        const token = randomString({ length: 40 });
        const user = await (new UserService()).findUser({
          email: checkToken.email,
          wallet_address: wallet_address,
          role
        });
        if(user) {
          user.password = params.password;
          user.token_jwt = token;
          await user.save();
          const tokenPassword = await PasswordResetModel.query()
            .where('email', checkToken.email)
            .where('role', role)
            .delete();

          return HelperUtils.responseSuccess()
        }else {
          return ErrorFactory.badRequest('Reset password failed!')
        }
      }

    } catch (e) {
      console.log('ERROR: ', e);
      if (e.status === 400) {
        return HelperUtils.responseBadRequest(e.message);
      } else if (e.status === 404) {
        return HelperUtils.responseNotFound(e.message);
      } else {
        return HelperUtils.responseErrorInternal('Server Error: Reset password fail');
      }
    }
  }

  async changePassword({request, auth}) {
    const param = request.all();
    const passwordOld = param.password_old;
    const passwordNew = param.password_new;
    const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
    const user = auth.user;

    if(await Hash.verify(passwordOld, user.password)) {
      const token = randomString({ length: 40 });
      const userService = new UserService();
      const userFind = await userService.findUser({
        email: user.email,
        role,
      });
      userFind.password = passwordNew;
      userFind.token_jwt = token;
      await userFind.save();

      return {
        status: 200,
        data: userFind,
        message: 'Change password successfully!'
      }
    } else {
      return {
        status: 500,
        data: null,
        message: 'Old password does not match current password.'
      }
    }
  }

  async confirmEmail({request}) {
    try {
      const token = request.params.token;
      // const role = Const.USER_ROLE.PUBLIC_USER;
      const userService = new UserService();
      const checkToken = await userService.confirmEmail(token);
      if (!checkToken) {
        return HelperUtils.responseErrorInternal('Active account link has expried.');
      }
      return HelperUtils.responseSuccess(checkToken);
    } catch (e) {
      console.log('ERROR: ', e);
      if (e.status === 400) {
        return HelperUtils.responseNotFound(e.message);
      } else {
        return HelperUtils.responseErrorInternal(e.message);
      }
    }
  }

  async changeType({request}) {
    const param = request.all();
    if(param.basic_token != process.env.JWT_BASIC_AUTH){
      return  ErrorFactory.unauthorizedInputException('Basic token error!', '401');
    }
    if(param.type == Const.USER_TYPE.WHITELISTED){
      Event.fire('new:createWhitelist', param)
    }
    const type = param.type == Const.USER_TYPE.WHITELISTED ? Const.USER_TYPE.WHITELISTED : Const.USER_TYPE.REGULAR
    const findUser = await UserModel.query()
      .where('email', param.email)
      .where('role', Const.USER_ROLE.PUBLIC_USER)
      .first();
    if (!findUser){
      return HelperUtils.responseSuccess()
    }
    const token = randomString({ length: 40 });
    findUser.type = type
    findUser.token_jwt = token
    await findUser.save();
    return HelperUtils.responseSuccess();
  }

  async checkEmailVerified({request}) {
    const inputParams = request.only(['email']);
    const findUser = await UserModel.query()
      .where('email', inputParams.email)
      .where('status', Const.USER_STATUS.ACTIVE)
      .first();

    if (!findUser) {
      return HelperUtils.responseNotFound('User is unverified !')
    }
    return HelperUtils.responseSuccess('User is verified !');
  }

  async checkUserActive({request}) {
    const params = request.all();
    console.log(`Check user active with params ${params}`);
    const userService = new UserService();
    // get user active by wallet_address
    const user = userService.findUser({'wallet_address': params.wallet_address});
    // check exist user or not and return result
    return HelperUtils.responseSuccess(user == null);
  }

  async getCurrentTier({ request, params }) {
    const { walletAddress, campaignId } = params;
    const filterParams = {
      wallet_address: walletAddress,
      campaign_id: campaignId,
    };
    console.log('[getCurrentTier] - filterParams: ', filterParams);

    // Check user is in reserved list
    const reserve = await (new ReservedListService).buildQueryBuilder(filterParams).first();
    console.log('[getCurrentTier] - isReserve:', !!reserve);
    if (reserve) {
      const tier = {
        min_buy : reserve.min_buy,
        max_buy : reserve.max_buy,
        start_time: reserve.start_time,
        end_time: reserve.end_time,
        level : 0
      }
      console.log('[getCurrentTier] - tier:', JSON.stringify(tier));
      return HelperUtils.responseSuccess(tier);
    } else {
      // Get Tier in smart contract
      const userTier = await HelperUtils.getUserTierSmartContract(walletAddress);
      console.log('[getCurrentTier] - userTier:', userTier);
      const tierDb = await TierModel.query().where('campaign_id', campaignId).where('level', userTier).first();
      // get lottery ticket from winner list
      const winner = await WinnerModel.query().where('campaign_id', campaignId).where('wallet_address', walletAddress).first();
      const tier = {
        min_buy : tierDb.min_buy,
        max_buy : tierDb.max_buy * winner.lottery_ticket,
        start_time: tierDb.start_time,
        end_time: tierDb.end_time,
        level : tierDb.level
      }
      console.log('[getCurrentTier] - tier:', JSON.stringify(tier));
      return HelperUtils.responseSuccess(tier);
    }
  }
}

module.exports = UserController
