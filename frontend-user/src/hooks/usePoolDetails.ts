import { useEffect, useMemo, useState } from 'react';
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
}

export type PoolDetailsReturnType ={
  poolDetails: PoolDetails | undefined,
  loading: boolean
}

const usePoolDetails = (poolId : number): PoolDetailsReturnType => {
  const [poolDetailDone, setPoolDetailDone] = useState<boolean>(false);
  const { loading, error, data }  = useFetch<any>(`/pool/${poolId}`);
  const { tokenDetails } = useTokenDetails(data ? data.token: '');

  const poolDetails = useMemo(() => {
    if (data && !loading && !error && tokenDetails && poolDetailDone)  {
      return {
        method: data.buy_type,
        startTime: data.start_join_pool_time,
        token: data.token,
        ethRate: data.ether_conversion_rate,
        type: data.pool_type,
        amount: data.total_sold_coin,
        website: 'http://polkafoundry.com',
        tokenDetails,
        title: data.title
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
