/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Campaign extends Model {
  static get table() {
    return 'campaigns';
  }

  transaction() {
    return this.hasMany('App/Models/Transaction', 'id', 'campaign_id');
  }

  affiliateCampaign() {
    return this.hasMany('App/Models/AffiliateCampaign', 'id', 'campaign_id');
  }

  tiers() {
    return this.hasMany('App/Models/Tier')
  }

  winners() {
    return this.hasMany('App/Models/WinnerListUser')
  }

  whitelistUsers() {
    return this.hasMany('App/Models/WhitelistUser')
  }

}

module.exports = Campaign;
