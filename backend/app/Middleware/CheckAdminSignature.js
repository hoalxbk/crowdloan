"use strict";

const ForbiddenException = use('App/Exceptions/ForbiddenException');
const sigUtil = require('eth-sig-util')
const Web3 = require('web3')
const Const = use('App/Common/Const');

class CheckAdminSignature {
  async handle({ request, }, next) {
    try {
      const params = request.all();
      const type = request.params.type;

      console.log('Check Signature with: ', params);

      const signature = params.signature
      const wallet_address = Web3.utils.toChecksumAddress(params.wallet_address)
      const message = process.env.MESSAGE_SIGNATURE;
      console.log('Message: ', message);

      const mes = [
        {
          type: 'string',
          name: 'Message',
          value: message,
        }
      ];
      const recover = await sigUtil.recoverTypedSignatureLegacy({data: mes, sig: signature})
      const recoverConvert = Web3.utils.toChecksumAddress(recover)

      console.log('recoverConvert: ', recoverConvert, wallet_address);

      if (recoverConvert && recoverConvert === wallet_address) {
        await next();
      } else {
        throw new ForbiddenException('Unauthorized!');
      }
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('Unauthorized!');
    }
  }
}

module.exports = CheckAdminSignature;
