import { TokenType } from '../../../hooks/useTokenDetails';

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
    label: string
  }
};

export type PoolDetailMappingProps = {
  website: string; 
  amount: number;
  ethRate: number;
  method: string;
  type: string;
  tokenDetails: TokenType
}


const usePoolDetailsMapping = (poolDetails: PoolDetailMappingProps | undefined): PoolDetailMapping | undefined => {
  if (poolDetails) {
    const { website, amount, ethRate, type, method, tokenDetails } = poolDetails;
    const poolDetailsBasic = {
      [PoolDetailKey.website]: { 
        display: website,
        utilIcon: '/images/hyperlink.svg',
        label: 'Website'
      },
      [PoolDetailKey.swapAmount]: { 
        display: `${amount} Tokens`,
        val: amount,
        label: 'Swap Amount'
      },
      [PoolDetailKey.exchangeRate]: { 
        display: `1 ${tokenDetails.symbol} = ${ethRate} Tokens`,
        val: 10,
        utilIcon: '/images/swap.svg',
        label: 'Exchange Rate'
      },
      [PoolDetailKey.method]: { 
        display: method === 'whitelist' ? 'Whitelist/Lottery - FCFS': '',
        label: 'Method'
      },
      [PoolDetailKey.type]: { 
        display: type ===  'swap' ? 'Swap - Claimable': '',
        label: 'Type'
      }
    }

    return poolDetailsBasic;
  }
}

export default usePoolDetailsMapping;
