'use strict'

const Config = use('Config')
const ErrorFactory = use('App/Common/ErrorFactory');
const AdminService = use('App/Services/AdminService')
const AdminModel = use('App/Models/Admin')
const PasswordResetModel = use('App/Models/PasswordReset')
const Helpers = use('Helpers')
const HelperUtils = use('App/Common/HelperUtils');
const Const = use('App/Common/Const');
const Mail = use('Mail')
const Env = use('Env')
const randomString = use('random-string');
const Hash = use('Hash');
const Event = use('Event')

const SendForgotPasswordJob = use('App/Jobs/SendForgotPasswordJob')

class AdminController {
  async profile({ request, auth }) {
    let user = auth.user;
    const params = request.all();
    const adminService = new AdminService();
    const userAuthInfo = {
      email: user.email,
      username: user.username,
      signature: params.signature,
    };

    return HelperUtils.responseSuccess({
      user: await adminService.findUser(userAuthInfo)
    });
  }

  async updateProfile({ request, auth }) {
    try {
      let user = auth.user;
      const params = request.only(['firstname', 'lastname']);
      const adminService = new AdminService();
      const userAuthInfo = {
        email: user.email,
        role: user.role,
      };
      user = await adminService.findUser(userAuthInfo);
      if (!user) {
        return HelperUtils.responseNotFound('User Not Found');
      }

      const result = await adminService.updateUser(params, userAuthInfo);
      if (!result) {
        return HelperUtils.responseErrorInternal('Update Fail');
      }

      return HelperUtils.responseSuccess({
        user: await adminService.findUser(userAuthInfo),
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
    const adminService = new AdminService();
    const user = await adminService.findUser({
      email: params.email,
      wallet_address: params.wallet_address,
      role,
    });
    if (!user) {
      console.error('user not found.')
      return HelperUtils.responseSuccess();
    }
    const token = await adminService.resetPasswordEmail(params.email, role);
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
      const adminService = new AdminService();
      const checkToken = await adminService.checkToken(token, role);
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
      const adminService = new AdminService();
      const checkToken = await adminService.checkToken(token, role);

      if (checkToken) {
        const token = randomString({ length: 40 });
        const user = await (new AdminService()).findUser({
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

    console.log('fdsadsa');

    const passwordOld = param.password_old;
    const passwordNew = param.password_new;
    const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
    const user = auth.user;

    if(await Hash.verify(passwordOld, user.password)) {
      const token = randomString({ length: 40 });
      const adminService = new AdminService();
      const userFind = await adminService.findUser({
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
      const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
      const adminService = new AdminService();
      const checkToken = await adminService.confirmEmail(token, role);
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
    const findUser = await AdminModel.query()
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
}

module.exports = AdminController
