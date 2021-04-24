"use strict";

class MaskEmailAndWallet {
  async handle({ request, response, view }, next) {
    await next();
    // get response data
    const data = response._lazyBody.content.data;
    this.doMask(data,['email','wallet']);
  }

  doMask(obj, fields) {
    for(const prop in obj) {
      if(!obj.hasOwnProperty(prop)) continue;
      if(fields.indexOf(prop)!=-1) {
        obj[prop] = this.maskEmail(obj[prop]);
      } else if(typeof obj[prop]==='object') {
        this.doMask(obj[prop], fields);
      }
    }
  }

  maskEmail(email) {
    console.log(`Email before mask is ${email}`);
    const preEmailLength = email.split("@")[0].length;
    // get number of word to hide, half of preEmail
    const hideLength = ~~(preEmailLength / 2);
    console.log(hideLength);
    // create regex pattern
    const r = new RegExp(".{"+hideLength+"}@", "g")
    // replace hide with ***
    email = email.replace(r, "***@");
    console.log(`Email after mask is ${email}`);
    return email;
  }
}

module.exports = MaskEmailAndWallet;
