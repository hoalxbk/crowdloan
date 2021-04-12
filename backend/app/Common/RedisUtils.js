'use strict'

const Const = use('App/Common/Const');
const Redis = use('Redis');

const logRedisUtil = (message) => {
  console.log(`[RedisUtils] - ${message}`);
};

/**
 * POOL DETAIL
 */
const getRedisKeyPoolDetail = (poolId) => {
  return `public_pool_detail_${poolId}`;
};

const getRedisPoolDetail = async (poolId) => {
  return await Redis.get(getRedisKeyPoolDetail(poolId));
};

const checkExistRedisPoolDetail = async (poolId) => {
  let redisKey = getRedisKeyPoolDetail(poolId);
  logRedisUtil(`checkExistRedisPoolDetail - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisPoolDetail - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisPoolDetail - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisPoolDetail = async (poolId, data) => {
  const redisKey = getRedisKeyPoolDetail(poolId);
  logRedisUtil(`createRedisPoolDetail - Create Cache data with key: ${redisKey}`);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisPoolDetail = (poolId) => {
  let redisKey = getRedisKeyPoolDetail(poolId);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisPoolDetail - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisPoolDetail - not exist key ${redisKey}`);
  return false;
};

/**
 * POOL LIST
 */
const getRedisKeyPoolList = ({
  page = 1, limit = 10, title = 'title',
  start_time = 'start_time', finish_time = 'finish_time', registed_by = 'registed_by',
}) => {
  return `public_pool_list_${page}_${limit}_${title}_${start_time}_${finish_time}_${registed_by}`;
};

const getRedisPoolList = async (params) => {
  return await Redis.get(getRedisKeyPoolList(params));
};

const checkExistRedisPoolList = async (params) => {
  let redisKey = getRedisKeyPoolList(params);
  logRedisUtil(`checkExistRedisPoolList - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisPoolList - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisPoolList - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisPoolList = async (params, data) => {
  const redisKey = getRedisKeyPoolList(params);
  logRedisUtil(`createRedisPoolList - Create Cache data with key: ${redisKey}`);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisPoolList = (params) => {
  let redisKey = getRedisKeyPoolList(params);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisPoolList - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisPoolList - not exist key ${redisKey}`);
  return false;
};


/**
 * TIER LIST
 */
const getRedisKeyTierList = (poolId) => {
  return `tiers_list_${poolId}`;
};

const getRedisTierList = async (poolId) => {
  return await Redis.get(getRedisKeyTierList(poolId));
};

const checkExistRedisTierList = async (poolId) => {
  let redisKey = getRedisKeyTierList(poolId);
  logRedisUtil(`checkExistRedisTierList - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisTierList - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisTierList - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisTierList = async (poolId, data) => {
  const redisKey = getRedisKeyTierList(poolId);
  logRedisUtil(`createRedisTierList - Create Cache data with key: ${redisKey}`);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisTierList = (poolId) => {
  let redisKey = getRedisKeyTierList(poolId);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisTierList - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisTierList - not exist key ${redisKey}`);
  return false;
};

module.exports = {
  // POOL LIST
  checkExistRedisPoolList,
  getRedisKeyPoolList,
  getRedisPoolList,
  createRedisPoolList,
  deleteRedisPoolList,

  // POOL DETAIL
  checkExistRedisPoolDetail,
  getRedisKeyPoolDetail,
  getRedisPoolDetail,
  createRedisPoolDetail,
  deleteRedisPoolDetail,

  // TIER LIST
  checkExistRedisTierList,
  getRedisKeyTierList,
  getRedisTierList,
  createRedisTierList,
  deleteRedisTierList,

};
