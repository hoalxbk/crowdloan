import { useState } from 'react';

export enum PoolDetailKey {
  website = 'website',
  swapAmount = 'swapAmount',
  exchangeRate = 'exchangeRate',
  method = 'method',
  type = 'type'
}

export type poolDetailKey = Extract<
  PoolDetailKey, 
  PoolDetailKey.website | PoolDetailKey.swapAmount | PoolDetailKey.type | PoolDetailKey.method | PoolDetailKey.exchangeRate
>

export type PoolDetailMapping = {
  [key in PoolDetailKey]: {
    display: string | number;
    utilIcon?: string;
  }
}

const usePoolDetails = (): PoolDetailMapping => {
  const poolDetailsBasic = {
    [PoolDetailKey.website]: { 
      display: 'http://polkafoundry.com',
      utilIcon: '/images/hyperlink.svg'
    },
    [PoolDetailKey.swapAmount]: { 
      display: 600000000 
    },
    [PoolDetailKey.exchangeRate]: { 
      display: 10,
      utilIcon: '/images/swap.svg'
    },
    [PoolDetailKey.method]: { 
      display: 'Whitelist/Lottery - FCFS'
    },
    [PoolDetailKey.type]: { 
      display: 'Swap - Claimable' 
    }
  }

  return poolDetailsBasic;
}

export default usePoolDetails;
