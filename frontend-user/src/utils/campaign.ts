import _ from "lodash";
import moment from "moment";
import BigNumber from 'bignumber.js';
import {BUY_TYPE, POOL_IS_PRIVATE} from "../constants";

export const checkIsFinishTime = (campaignDetail: any): boolean => {

  console.log('campaignDetail', campaignDetail);

  const closeTime = _.get(campaignDetail, 'closeTime', '');
  let isFinish = false;
  if (closeTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const currentDate = new Date();
    if (currentDate >= closeTimeDate) {
      isFinish = true;
    }
  }

  return isFinish;
};

export const getTokenRemainingCanBuy = (campaignDetail: any): string => {
  if (!campaignDetail) return '0';
  const tokenLeft = _.get(campaignDetail, 'tokenLeft', 0);
  const tokenClaimed = _.get(campaignDetail, 'tokenClaimed', 0);
  let remainTokenAvailable = new BigNumber(tokenLeft).plus(tokenClaimed);

  return remainTokenAvailable.toFixed();
};

export const checkIsBetweenCloseTimeAndReleaseTime = (campaignDetail: any): boolean => {
  const closeTime = _.get(campaignDetail, 'closeTime', '');
  const releaseTime = _.get(campaignDetail, 'releaseTime', '');

  let isBetween = false;
  if (closeTime && releaseTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const releaseTimeDate = moment.unix(parseInt(releaseTime)).toDate();
    const currentDate = new Date();
    if (closeTimeDate <= currentDate && currentDate < releaseTimeDate) {
      isBetween = true;
    }
  }

  return isBetween;
};

export const getAccessPoolText = (pool: any) => {
  const isPrivate = pool?.is_private || pool?.isPrivate;
  const buyType = pool?.buy_type || pool?.buyType;
  if (isPrivate == POOL_IS_PRIVATE.PRIVATE) {
    return 'Private';
  }
  return ((buyType + '').toLowerCase() == BUY_TYPE.WHITELIST_LOTTERY ? "Whitelist/Lottery" : BUY_TYPE.FCFS.toUpperCase());
};
