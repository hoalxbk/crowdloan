const BaseService = use('App/Services/BaseService');
const Const = use('App/Common/Const');
const ErrorFactory = use('App/Common/ErrorFactory');
const UserModel = use('App/Models/User');
const WhitelistUser = use('App/Models/WhitelistUser');
const UserService = use('App/Services/UserService')
const Hash = use('Hash')
const Env = use('Env')
const HelperUtils = use('App/Common/HelperUtils');
const SendConfirmationEmailJob = use('App/Jobs/SendConfirmationEmailJob')

class AuthService extends BaseService {

  async login(params) {
    const userService = new UserService();
    const filterParams = {
      wallet_address: params.wallet_address,
      role: params.role,
    };
    console.log('Login with filterParams: ', filterParams);

    const user = await userService.findUser(filterParams);
    if (!user) {
      ErrorFactory.unauthorizedInputException('The current ethereum address has not been signed up on the system !', Const.ERROR_CODE.AUTH_ERROR.ADDRESS_NOT_EXIST);
    }

    const isMatchPassword = await Hash.verify(params.password, user.password);

    if (!isMatchPassword) {
      ErrorFactory.unauthorizedInputException('Incorrect password !', Const.ERROR_CODE.AUTH_ERROR.PASSWORD_NOT_MATCH);
    }
    return user;
  }

  async checkIssetUser({ email, role }) {
    const user = await UserModel.query()
      .where('role', role)
      .where('email', email)
      .where('is_active', Const.USER_ACTIVE)
      .first();
    return user;
  }

  async checkWalletUser({wallet_address, role}) {
    const user = await UserModel.query()
      .where('role', role)
      .where('wallet_address', wallet_address)
      .where('is_active', Const.USER_ACTIVE)
      .first();
    return user;
  }

  async checkExistWhitelistUser({ email }) {
      const whitelistUser = await WhitelistUser.query().where('email', email).first();
      return whitelistUser;
  }

  async createUser({email, username, signature, password, wallet_address, type, role}) {
    const isExistWhitelistUser = await this.checkExistWhitelistUser({ email });
    const userType = isExistWhitelistUser ? Const.USER_TYPE.WHITELISTED : Const.USER_TYPE.REGULAR;
    try {
      const user = new UserModel;
      user.email = email;
      user.username = username;
      user.password = password;
      user.wallet_address = wallet_address;
      user.signature = signature;
      user.role = role || Const.USER_ROLE.ICO_OWNER;
      user.type = userType;
      await user.save();
      return user;
    } catch (e) {
      console.error(e)
      return ErrorFactory.internal('error')
    }
  }

  async sendConfirmEmail(params) {
    const { role, user, type } = params;
    const mailData = {};
    mailData.username = user.username;
    mailData.email = user.email;

    const isAdmin = type === Const.USER_TYPE_PREFIX.ICO_OWNER;
    const baseUrl = isAdmin ? Env.get('FRONTEND_ADMIN_APP_URL') : Env.get('FRONTEND_USER_APP_URL');
    mailData.url = baseUrl + '/#/confirm-email/' +
        (isAdmin ? 'user/' : 'investor/') +
        user.confirmation_token;

    SendConfirmationEmailJob.doDispatch(mailData);

    return true;
  }
}

module.exports = AuthService;
