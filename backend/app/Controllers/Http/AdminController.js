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

  async adminList({request}) {
    const params = request.only(['limit', 'page']);
    const searchQuery = request.input('searchQuery');
    const limit = params.limit || Const.DEFAULT_LIMIT;
    const page = params.page || 1;

    const adminService = new AdminService();
    let adminQuery = adminService.buildQueryBuilder(params);
    if (searchQuery) {
      adminQuery = adminService.buildSearchQuery(adminQuery, searchQuery);
    }
    const admins = await adminQuery.paginate(page, limit);
    return HelperUtils.responseSuccess(admins);
  }

  async adminDetail({ request, params }) {
    const id = params.id;
    const adminService = new AdminService();
    const admins = await adminService.findUser({ id });
    return HelperUtils.responseSuccess(admins);
  }

  async create({ request }) {
    try {
      const inputs = request.only(['email', 'username', 'wallet_address', 'firstname', 'lastname']);
      inputs.password = request.input('password');
      console.log('Create Admin with params: ', inputs);

      const adminService = new AdminService();
      const isExistUser = await adminService.findUser({
        wallet_address: inputs.wallet_address,
      });
      if (isExistUser) {
        return HelperUtils.responseBadRequest('Wallet is used');
      }

      const admin = new AdminModel();
      admin.fill(inputs);
      admin.signature = randomString(15);  // TODO: Fill any string
      admin.is_active = Const.USER_ACTIVE;
      const res = await admin.save();

      return HelperUtils.responseSuccess(res);
    } catch (e) {
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

  async update({ request, params }) {
    try {
      const inputs = request.only(['email', 'username', 'wallet_address', 'firstname', 'lastname']);
      const password = request.input('password');
      console.log('Update Admin with params: ', params.id, inputs);

      const adminService = new AdminService();
      const admin = await adminService.findUser({ id: params.id });
      if (!admin) {
        return HelperUtils.responseNotFound();
      }

      const updateInputs = inputs;
      if (password) {
        updateInputs.password = await Hash.make(password);
      }
      await adminService.buildQueryBuilder({id: params.id}).update(updateInputs);

      return HelperUtils.responseSuccess();
    } catch (e) {
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

}

module.exports = AdminController
