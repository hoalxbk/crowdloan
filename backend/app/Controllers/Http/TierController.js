'use strict'

const Tier = use('App/Models/Tier');
// const Const = use('App/Common/Const');
// const Common = use('App/Common/Common');
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');
const TierService = use('App/Services/TierService')

class TierController {
  async getTiers({ request, params }) {
    const campaignId = params.campaignId;
    try {
      let redisKey = `public_tiers_${campaignId}`;
      console.log('redisKey', redisKey);

      const isExistRedisData = await Redis.exists(redisKey);
      if (isExistRedisData) {
        const cachedTiers = await Redis.get(redisKey);
        console.log('Exist cache data Public Tiers: ', cachedTiers);
        return HelperUtils.responseSuccess(JSON.parse(cachedTiers));
      }

      console.log('Not exist Redis cache');
      const query = (new TierService).buildQueryBuilder({
        campaign_id: campaignId,
      }).orderBy('level', 'desc');
      const tiers = await query.fetch();

      // Cache data
      await Redis.set(redisKey, JSON.stringify(tiers));

      return HelperUtils.responseSuccess(tiers);
    } catch (e) {
      console.log(e)
    }
  }

}

module.exports = TierController;
