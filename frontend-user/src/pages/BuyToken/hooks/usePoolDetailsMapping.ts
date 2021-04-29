import BigNumber from 'bignumber.js';
import { TokenType } from '../../../hooks/useTokenDetails';
import { numberWithCommas } from '../../../utils/formatNumber';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';
import { convertTimeToStringFormat } from '../../../utils/convertDate';

export enum PoolDetailKey {
  website = 'website',
  swapAmount = 'swapAmount',
  exchangeRate = 'exchangeRate',
  method = 'method',
  type = 'type',
  minTier = 'minTier',
  deposited = 'deposited',
  joinTime = 'joinTime',
  buyTime = 'buyTime'
}

export type poolDetailKey = Extract<
  PoolDetailKey, 
  PoolDetailKey.website | 
  PoolDetailKey.swapAmount | 
  PoolDetailKey.type | 
  PoolDetailKey.method | 
  PoolDetailKey.exchangeRate | 
  PoolDetailKey.minTier | 
  PoolDetailKey.deposited |
  PoolDetailKey.joinTime | 
  PoolDetailKey.buyTime
>

export type PoolDetailMapping = {
  [key in PoolDetailKey]: {
    display: string | number;
    utilIcon?: string;
    reverse?: string;
    label: string,
    image?: string;
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
  joinTime: string;
  endJoinTime: string;
  startBuyTime: string;
  endBuyTime: string;
}


const usePoolDetailsMapping = (poolDetails: PoolDetailMappingProps | undefined): PoolDetailMapping | undefined => {
  if (poolDetails) {
    const { 
      website, 
      amount, 
      ethRate, 
      type, 
      method, 
      tokenDetails, 
      purchasableCurrency, 
      minTier,
      joinTime,
      endJoinTime,
      startBuyTime,
      endBuyTime
  } = poolDetails;

    const joinTimeInDate = new Date(Number(joinTime) * 1000);
    const endJoinTimeInDate = new Date(Number(endJoinTime) * 1000);
    const startBuyTimeInDate = new Date(Number(startBuyTime) * 1000);
    const endBuyTimeInDate = new Date(Number(endBuyTime) * 1000);

    const poolDetailsBasic = {
      [PoolDetailKey.website]: { 
        display: website,
        utilIcon: '/images/hyperlink.svg',
        label: 'Website'
      },
      [PoolDetailKey.swapAmount]: { 
        display: `${numberWithCommas(amount.toString())} ${tokenDetails?.symbol}`,
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
        image: getUserTierAlias(minTier).icon
      },
      [PoolDetailKey.deposited]: {
        display: purchasableCurrency.toUpperCase(),
        label: 'Supported',
        image: `/images/${purchasableCurrency.toUpperCase()}.png`
      },
      [PoolDetailKey.joinTime]: {
        display: `${convertTimeToStringFormat(joinTimeInDate)}  -  ${convertTimeToStringFormat(endJoinTimeInDate)}`,
        label: 'Join Time'
      },
      [PoolDetailKey.buyTime]: {
        display: `${convertTimeToStringFormat(startBuyTimeInDate)}  -  ${convertTimeToStringFormat(endBuyTimeInDate)}`,
        label: 'Buy Time'
      }
    }

    return poolDetailsBasic;
  }
}

export default usePoolDetailsMapping;
