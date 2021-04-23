import { useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useFetch from './useFetch';
import useTokenDetails, { TokenType } from './useTokenDetails';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export type PoolDetails = {
  id: number;
  website: string; 
  amount: number;
  ethRate: number;
  method: string;
  type: string;
  tokenDetails: TokenType;
  title: string;
  buyLimit: number[],
  connectedAccountBuyLimit: number,
  connectedAccountBuyMinimum: number,
  poolAddress: string;
  joinTime: string;
  endJoinTime: string;
  startBuyTime: string;
  endBuyTime: string;
  releaseTime: string;
  purchasableCurrency: string;
  banner: string;
  networkAvailable: string;
  networkIcon: string;
  minTier: number;
  isDeployed: boolean;
  isDisplay: boolean;
  addressReceiver: string;
  minimumBuy: number[];
  tierStartTime: Date,
  tierEndTime: Date
}

export type PoolDetailsReturnType ={
  poolDetails: PoolDetails | undefined,
  loading: boolean
}

const ETH_ICON = '/images/eth.svg';
const BSC_ICON = '/images/bsc.svg';


const usePoolDetails = (poolId : number): PoolDetailsReturnType => {
  const [poolDetailDone, setPoolDetailDone] = useState<boolean>(false);
  const { loading: fetchPoolLoading, error, data }  = useFetch<any>(`/pool/${poolId}`);
  const { tokenDetails } = useTokenDetails(data?.token, data?.network_available);
  const { data: connectedAccountTier } = useTypedSelector(state => state.userTier);

  const poolDetails = useMemo(() => {
    if (data && !fetchPoolLoading && !error && tokenDetails && poolDetailDone)  {
      const buyLimit = data.tiers.length > 0 ? data.tiers.map((tier: any) => tier.max_buy): [0,0,0,0,0];
      const minimumBuy = data.tiers.length > 0 ? data.tiers.map((tier: any) => tier.min_buy): [0,0,0,0,0];

      return {
        method: data.buy_type,
        startTime: data.start_join_pool_time,
        token: data.token,
        ethRate: data.purchasableCurrency === 'eth' ? data.ether_conversion_rate: data.token_conversion_rate,
        type: data.pool_type,
        amount: data.total_sold_coin,
        website: data.website,
        tokenDetails,
        title: data.title,
        buyLimit,
        minimumBuy,
        connectedAccountBuyLimit: buyLimit[Number(connectedAccountTier) || 0],
        connectedAccountBuyMinimum: minimumBuy[Number(connectedAccountTier) || 0],
        poolAddress: data.campaign_hash,
        joinTime: data.start_join_pool_time,
        endJoinTime: data.end_join_pool_time,
        startBuyTime: data.start_time,
        endBuyTime: data.finish_time,
        purchasableCurrency: data.accept_currency,
        id: data.id,
        banner: `${BASE_URL}/image/${data.token_images}`,
        releaseTime: data.release_time,
        networkAvailable: data.network_available,
        networkIcon: data.network_available === 'eth' ? ETH_ICON: BSC_ICON,
        minTier: data.min_tier,
        isDeployed: data.is_deploy === 1,
        isDisplay: data.is_display === 1,
        addressReceiver: data.address_receiver,
        tierStartTime: data.tiers[Number(connectedAccountTier) || 0].start_time,
        tierEndTime: data.tiers[Number(connectedAccountTier) || 0].end_time
      } 
    }

    return;
  }, [data, fetchPoolLoading, error, poolDetailDone, tokenDetails, connectedAccountTier]);

  useEffect(() => {
    tokenDetails && setPoolDetailDone(true);
  }, [tokenDetails]);

  return  {
    poolDetails,
    loading: fetchPoolLoading || !poolDetailDone
  }
}

export default usePoolDetails;
