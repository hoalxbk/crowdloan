"use strict";

class FormatEmailAndWallet {
  async handle({request}, next) {

    const params = request.all();
    // format email and wallet to lower case
    if (params.email != undefined) {
      params.email = params.email.toLowerCase();
    }
    if (params.wallet_address != undefined) {
      params.wallet_address = params.wallet_address.toLowerCase();
    }
    await next();
  }
}

module.exports = FormatEmailAndWallet;
