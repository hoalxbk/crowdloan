'use strict'

const crypto = use('crypto');
const Const = use('App/Common/Const');

/**
 * Generate "random" alpha-numeric string.
 *
 * @param  {int}      length - Length of the string
 * @return {string}   The result
 */
const getRedisKeyPoolDetail = (poolId) => {
  return `public_pool_detail_${poolId}`;
};


module.exports = {
  getRedisKeyPoolDetail,
};
