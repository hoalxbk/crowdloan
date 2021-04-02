'use strict'

const AssetTokenModel = use('App/Models/AssetToken');
const AssetTokenService = use('App/Services/AssetTokenService');
const newToken = new AssetTokenService();
const Config = use('Config')
const ErrorFactory = use('App/Common/ErrorFactory');
const HelperUtils = use('App/Common/HelperUtils');

class CampaignController {
  async create ({request}) {
    try {
      const param = request.all();

      if(await newToken.checkTokenIsset(param.token, param.wallet_address))
      {
        return {
          status: 400,
          message: 'Address token already exists!',
        }
      }
      let createAsset = new AssetTokenModel();
      createAsset.token_address = param.token;
      createAsset.symbol_name = param.symbol_name;
      createAsset.wallet_address = param.wallet_address;
      await createAsset.save()
      return {
        status: 200,
        data: createAsset,
      }
    }catch (e){
      console.log(e)
      return ErrorFactory.badRequest('add error!')
    }

  }

  async list({request}){
    const contract = request.params.contract;
    const listdata = await AssetTokenModel.query().where('wallet_address', '=', contract).fetch();
    return {
      status: 200,
      data: listdata,
    }
  }

  async remove({request, auth}){
    try {
      const walletAddress = auth.user.wallet_address
      const tokenAddress = request.params.id
      const findWallet = await AssetTokenModel.query()
        .where('wallet_address', walletAddress)
        .where('id', tokenAddress).delete()
      if (findWallet){
        return HelperUtils.responseSuccess()
      }else
        return HelperUtils.responseBadRequest()
    }catch (e){
      console.error(e)
      return ErrorFactory.badRequest(e.message)
    }
  }
}

module.exports = CampaignController
