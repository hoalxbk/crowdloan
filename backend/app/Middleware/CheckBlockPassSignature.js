"use strict";

const ForbiddenException = use('App/Exceptions/ForbiddenException');

class CheckBlockPassSignature {
  async handle({ request }, next) {
    await next();
  }
}

module.exports = CheckBlockPassSignature;
