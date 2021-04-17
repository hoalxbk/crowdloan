import BigNumber from 'bignumber.js';

export enum PoolStatus {
  Upcoming = "Upcoming",
  Joining = "Joining",
  Closed = "Closed",
  Filled = "Filled",
  Progress = "In-progress"
}

export type poolStatus = Extract<
  PoolStatus, 
  PoolStatus.Progress | 
  PoolStatus.Upcoming | 
  PoolStatus.Joining | 
  PoolStatus.Filled |
  PoolStatus.Closed
>

export const getPoolStatus = (
  startJoinTime: Date | undefined,
  endJoinTime: Date | undefined,
  startBuyTime: Date | undefined,
  endBuyTime: Date | undefined,
  soldProgress: string | undefined
): poolStatus => {
  const today = new Date().getTime();

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
    startJoinTime 
    && endBuyTime 
    && today > startJoinTime.getTime() 
    && today < endBuyTime.getTime() 
  ) {
    return new BigNumber(soldProgress || 0).gte(99) ?  PoolStatus.Filled: PoolStatus.Progress;
  }

  if (endBuyTime && today > endBuyTime?.getTime()) {
    return PoolStatus.Closed;
  }

  return PoolStatus.Upcoming;
}
