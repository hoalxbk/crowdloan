const ErrorFactory = use('App/Common/ErrorFactory');
const AuthService = use('App/Services/AuthService');
const UserService = use('App/Services/UserService');
const HelperUtils = use('App/Common/HelperUtils');
const Const = use('App/Common/Const');
const Config = use('Config');
const Web3 = require('web3')
const UserModel = use('App/Models/User');

class UserAuthController {

  async verifyJwtToken({ request, auth }) {
    try {
      const isValid = await auth.check();
      const authUser = await auth.jwtPayload.data;
      const dbUser = await (new UserService).findUser(authUser);
      if (isValid && authUser && dbUser && dbUser.type === Const.USER_TYPE.WHITELISTED) {
        return HelperUtils.responseSuccess({
          msgCode: 'TOKEN_IS_VALID'
        }, 'Token is valid');
      }

      if (dbUser && dbUser.type === Const.USER_TYPE.REGULAR) {
        return HelperUtils.responseSuccess({
          msgCode: 'USER_IS_NOT_IN_WHITELISTED'
        },'User is not in white list');
      }

      return HelperUtils.responseSuccess({
        msgCode: 'TOKEN_IS_INVALID'
      }, 'Token is invalid');
    } catch (e) {
      console.log('ERROR: ', e);
      return HelperUtils.responseErrorInternal({
        msgCode: 'TOKEN_IS_INVALID'
      }, 'ERROR: Token is invalid');
    }
  }

  async checkWalletAddress({ request, params }) {
    try {
      const inputs = request.all();
      const walletAddress = HelperUtils.checkSumAddress(inputs.wallet_address || ' ');
      const userService = new UserService();

      console.log('Wallet: ', walletAddress);
      console.log('Check Wallet: ', inputs, params);
      const user = await userService.findUser({
        wallet_address: walletAddress,
        // role: params.type === Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER,
      });

      if (!user) {
        return HelperUtils.responseNotFound('Not exist !')
      }

      return HelperUtils.responseSuccess({
        walletAddress,
        user: {
          id: user.id
        },
      });
    } catch (e) {
      console.log('ERROR: ', e);
      return HelperUtils.responseErrorInternal('ERROR: Wallet address is invalid');
    }
  }

  async login({ request, auth, params }) {
    const type = params.type;
    if (type !== Const.USER_TYPE_PREFIX.ICO_OWNER && type !== Const.USER_TYPE_PREFIX.PUBLIC_USER) {
      return HelperUtils.responseNotFound('Not valid !');
    }
    const param = request.all();
    const wallet_address = Web3.utils.toChecksumAddress(param.wallet_address)
    const filterParams = {
      'wallet_address': wallet_address
    };
    try {
      const authService = new AuthService();
      const user = await authService.login({
        ...filterParams
      });

      const token = await auth.generate(user, true);
      return HelperUtils.responseSuccess({
        user,
        token,
      });
    } catch(e) {
      console.log('ERROR: ', e);
      return HelperUtils.responseNotFound(e.message, e.msgCode);
    }
  }

  async register({ request, auth, params }) {
    try {
      const param = request.only(['email', 'username', 'signature', 'password', 'wallet_address'])
      const wallet_address = Web3.utils.toChecksumAddress(request.input('wallet_address'));
      console.log(111, wallet_address)
      const type = params.type;
      const role = type === Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;

      const authService = new AuthService();
      let user = await authService.checkIssetUser({ email: param.email, role });
      console.log(user)
      if(!user) {
        user = await authService.checkWalletUser({wallet_address, role});
        if(user){
          return HelperUtils.responseNotFound('The current ethereum address has been used.');
        }
        user = await authService.createUser({
          ...param,
          role,
        });
      } else {
        return HelperUtils.responseNotFound(' Email address has been used.');
      }
      user.confirmation_token = await HelperUtils.randomString(50);
      user.save();
      await authService.sendConfirmEmail({ role, type, user });

      return HelperUtils.responseSuccess(null, 'Success! Please confirm email to complete.');
    } catch(e) {
      console.log('ERROR: ', e);
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

  async registerVerifyEmail({ request, params }) {
    try {
      const param = request.only(['email', 'signature', 'wallet_address']);
      const role = Const.USER_ROLE.PUBLIC_USER; // Only public user verify email
      const wallet_address = Web3.utils.toChecksumAddress(param.wallet_address);

      console.log('[registerVerifyEmail]: Wallet Address: ', wallet_address);
      let user = await UserModel.query().where('wallet_address', wallet_address).first();
      console.log('[registerVerifyEmail]: User:  ', user);

      if (!user) {
        console.log('[registerVerifyEmail]: Create User:  ');
        user = new UserModel;
        user.email = param.email;
        user.username = param.email;
        user.password = param.email;
        user.wallet_address = wallet_address;
        user.signature = param.email;
        user.status = Const.USER_STATUS.UNVERIFIED; // Not verify email
        console.log('user.status', user.status);

        await user.save();
      }
      if (user.is_active === Const.USER_STATUS.ACTIVE) {
        return HelperUtils.responseBadRequest('User is actived!');
      }

      user.email = param.email;
      user.confirmation_token = await HelperUtils.randomString(50);
      await user.save();

      console.log('[registerVerifyEmail]: SendEmail:  ', param);
      const authService = new AuthService();
      await authService.sendNewVerifyEmail({ user });

      return HelperUtils.responseSuccess(null, 'Success! Register email success');
    } catch(e) {
      console.log('ERROR: ', e);
      return HelperUtils.responseErrorInternal(e.message);
    }
  }

}

module.exports = UserAuthController;
