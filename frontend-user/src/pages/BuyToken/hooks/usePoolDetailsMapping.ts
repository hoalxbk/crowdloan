import BigNumber from 'bignumber.js';
import { TokenType } from '../../../hooks/useTokenDetails';
import { numberWithCommas } from '../../../utils/formatNumber';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';

export enum PoolDetailKey {
  website = 'website',
  swapAmount = 'swapAmount',
  exchangeRate = 'exchangeRate',
  method = 'method',
  type = 'type',
  minTier = 'minTier'
}

export type poolDetailKey = Extract<
  PoolDetailKey, 
  PoolDetailKey.website | PoolDetailKey.swapAmount | PoolDetailKey.type | PoolDetailKey.method | PoolDetailKey.exchangeRate | PoolDetailKey.minTier
>

export type PoolDetailMapping = {
  [key in PoolDetailKey]: {
    display: string | number;
    utilIcon?: string;
    reverse?: string;
    label: string
  }
};

export type PoolDetailMappingProps = {
  website: string; 
  amount: number;
  ethRate: number;
  method: string;
  type: string;
  tokenDetails: TokenType;
  purchasableCurrency: string;
  minTier: number;
}


const usePoolDetailsMapping = (poolDetails: PoolDetailMappingProps | undefined): PoolDetailMapping | undefined => {
  if (poolDetails) {
    const { website, amount, ethRate, type, method, tokenDetails, purchasableCurrency, minTier } = poolDetails;
    const poolDetailsBasic = {
      [PoolDetailKey.website]: { 
        display: website,
        utilIcon: '/images/hyperlink.svg',
        label: 'Website'
      },
      [PoolDetailKey.swapAmount]: { 
        display: `${numberWithCommas(amount.toString())} ${tokenDetails?.name}`,
        val: amount,
        label: 'Swap Amount'
      },
      [PoolDetailKey.exchangeRate]: { 
        display: `1 ${tokenDetails.symbol} = ${ethRate} ${purchasableCurrency.toUpperCase()}`,
        reverse: `1 ${purchasableCurrency.toUpperCase()} = ${new BigNumber(1).div(ethRate).toNumber()} ${tokenDetails?.symbol}`,
        val: 10,
        utilIcon: '/images/swap.svg',
        label: 'Exchange Rate',
      },
      [PoolDetailKey.method]: { 
        display: method === 'whitelist' ? 'Whitelist/Lottery': 'FCFS',
        label: 'Method'
      },
      [PoolDetailKey.type]: { 
        display: type ===  'swap' ? 'Swap': 'Claimable',
        label: 'Type'
      },
      [PoolDetailKey.minTier]: {
        display: getUserTierAlias(minTier).text,
        label: 'Min Tier',
        utilIcon: getUserTierAlias(minTier).icon
      }
    }

    return poolDetailsBasic;
  }
}

export default usePoolDetailsMapping;
