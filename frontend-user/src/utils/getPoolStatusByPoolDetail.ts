import BigNumber from 'bignumber.js';
import {PoolStatus} from "./getPoolStatus";
import {POOL_TYPE} from "../constants";

export const getPoolStatusByPoolDetail = async (
  // startJoinTime: Date | undefined,
  // endJoinTime: Date | undefined,
  // startBuyTime: Date | undefined,
  // endBuyTime: Date | undefined,
  // releaseTime: Date | undefined,
  // soldProgress: string | undefined,
  // isClaimable: boolean | undefined,
  // poolType: string | undefined
  poolDetails: any,
  tokenSold: any,
) => {
  const startBuyTimeField = () => {
    return poolDetails?.startBuyTime || poolDetails?.start_time;
  };
  const endBuyTimeField = () => {
    return poolDetails?.endBuyTime || poolDetails?.finish_time;
  };
  const startJoinTimeField = () => {
    return poolDetails?.joinTime || poolDetails?.start_join_pool_time;
  };
  const endJoinTimeField = () => {
    return poolDetails?.endJoinTime || poolDetails?.end_join_pool_time;
  };
  const releaseTimeField = () => {
    return poolDetails?.releaseTime || poolDetails?.end_join_pool_time;
  };
  const amountField = () => {
    return poolDetails?.amount || poolDetails?.total_sold_coin;
  };
  const poolTypeField = () => {
    return poolDetails?.type || poolDetails?.pool_type;
  };
  const buyTypeField = () => {
    return poolDetails?.method || poolDetails?.buy_type;
  };

  const startBuyTime = startBuyTimeField() ? new Date(Number(startBuyTimeField()) * 1000): undefined;
  const endBuyTime = endBuyTimeField() ? new Date(Number(endBuyTimeField()) * 1000): undefined;
  const startJoinTime = startJoinTimeField() ? new Date(Number(startJoinTimeField()) * 1000): undefined;
  const endJoinTime = endJoinTimeField() ? new Date(Number(endJoinTimeField()) * 1000): undefined;
  const releaseTime = releaseTimeField() ? new Date(Number(releaseTimeField()) * 1000): undefined;

  const soldProgress = new BigNumber(tokenSold).div(amountField() || 1).toFixed();
  const isClaimable = poolTypeField() !== POOL_TYPE.SWAP;
  const poolType = buyTypeField();

  const today = new Date().getTime();
  const requiredReleaseTime = isClaimable ? !releaseTime: false;

  if ((!startBuyTime || !startJoinTime || !endBuyTime || !endJoinTime || requiredReleaseTime) && poolType === 'whitelist') {
    return PoolStatus.TBA;
  }

  if ((!startBuyTime || !endBuyTime || requiredReleaseTime) && poolType === 'fcfs') {
    return PoolStatus.TBA;
  }

  if (startJoinTime && today < startJoinTime.getTime()) {
    return PoolStatus.Upcoming;
  }

  if (startJoinTime && endJoinTime && today > startJoinTime.getTime() && today < endJoinTime.getTime()) {
    return PoolStatus.Joining;
  }

  if (endJoinTime && startBuyTime && today > endJoinTime.getTime() && today < startBuyTime.getTime()) {
    return PoolStatus.Upcoming;
  }

  if (
    startBuyTime
    && endBuyTime
    && today > startBuyTime.getTime()
    && today < endBuyTime.getTime()
  ) {
    return new BigNumber(soldProgress || 0).multipliedBy(100).gte(99) ?  PoolStatus.Filled: PoolStatus.Progress;
  }

  if (releaseTime && today > releaseTime.getTime() && isClaimable) {
    return PoolStatus.Claimable;
  }

  if (endBuyTime && today > endBuyTime?.getTime()) {
    return PoolStatus.Closed;
  }

  return PoolStatus.Upcoming;
}
