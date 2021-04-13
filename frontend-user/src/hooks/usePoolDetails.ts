import { useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useFetch from './useFetch';
import useTokenDetails, { TokenType } from './useTokenDetails';

export type PoolDetails = {
  website: string; 
  amount: number;
  ethRate: number;
  method: string;
  type: string;
  tokenDetails: TokenType;
  title: string;
  buyLimit: number[],
  connectedAccountBuyLimit: number,
  poolAddress: string;
  joinTime: string;
  endJoinTime: string;
  id: number;
  purchasableCurrency: string;
}

export type PoolDetailsReturnType ={
  poolDetails: PoolDetails | undefined,
  loading: boolean
}

const usePoolDetails = (poolId : number): PoolDetailsReturnType => {
  const [poolDetailDone, setPoolDetailDone] = useState<boolean>(false);
  const { loading, error, data }  = useFetch<any>(`/pool/${poolId}`);
  const { tokenDetails } = useTokenDetails(data && data.token);
  const { data: connectedAccountTier } = useTypedSelector(state => state.userTier);

  const poolDetails = useMemo(() => {
    if (data && !loading && !error && tokenDetails && poolDetailDone)  {
      const buyLimit = data.tiers.length > 0 ? data.tiers.map((tier: any) => tier.max_buy): [0,0,0,0,0];

      return {
        method: data.buy_type,
        startTime: data.start_join_pool_time,
        token: data.token,
        ethRate: data.ether_conversion_rate,
        type: data.pool_type,
        amount: data.total_sold_coin,
        website: 'http://polkafoundry.com',
        tokenDetails,
        title: data.title,
        buyLimit,
        connectedAccountBuyLimit: buyLimit[Number(connectedAccountTier) || 0],
        poolAddress: data.campaign_hash,
        joinTime: data.start_join_pool_time,
        endJoinTime: data.end_join_pool_time,
        banner: data.token_images,
        purchasableCurrency: data.accept_currency,
        id: data.id
      }
    }

    return;
  }, [data, loading, error, poolDetailDone, tokenDetails]);

  useEffect(() => {
    tokenDetails && setPoolDetailDone(true);
  }, [tokenDetails]);

  return  {
    poolDetails,
    loading: !poolDetailDone
  }
}

export default usePoolDetails;
