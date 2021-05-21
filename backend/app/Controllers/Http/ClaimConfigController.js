'use strict'

const ReservedListService = use('App/Services/ReservedListService')
const HelperUtils = use('App/Common/HelperUtils');
const ReservedListModel = use('App/Models/ReservedList');
const UserModel = use('App/Models/User');
const TierModel = use('App/Models/Tier');
const ConfigModel = use('App/Models/Config');
const BigNumber = use('bignumber.js')
const moment = require('moment')

const Redis = use('Redis');

class ClaimConfigController {

}

module.exports = ClaimConfigController
