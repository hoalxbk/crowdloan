import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { useTypedSelector } from '../../../hooks/useTypedSelector';
import Pool_ABI from '../../../abi/Pool.json';
import { getContractInstance, SmartContractMethod } from '../../../services/web3';

const DECIMAL_PLACES = 8;

const useTokenSoldProgress = (poolAddress: string | undefined, totalTokens: number | undefined, networkAvailable: string | undefined) => {
  const [soldProgress, setSoldProgress] = useState<string>("0");
  const [tokenSold, setTokenSold] = useState<string>("0");

  const { appChainID }  = useTypedSelector(state  => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;
  let soldProgressInterval = undefined as any;

  useEffect(() => {
    const calSoldProgress = async () => {
      if (poolAddress && networkAvailable && totalTokens && ethers.utils.isAddress(poolAddress)) {
        const poolContract = getContractInstance(
          Pool_ABI, 
          poolAddress, 
          connector, 
          appChainID, 
          SmartContractMethod.Read, 
          networkAvailable === 'eth'
        );

        if (poolContract) {
          const tokensSold = await poolContract.methods.tokenSold().call();

          const tokensSoldCal =
            poolAddress === '0xac3932F8B1fEBA8eBf3A50B16bFb39EF71F1F7d4' ? new BigNumber('500000') :
            new BigNumber(tokensSold).div(new BigNumber(10).pow(18));

          setTokenSold(tokensSoldCal.toFixed(DECIMAL_PLACES));
          setSoldProgress(
            !tokensSoldCal.eq(new BigNumber(0)) ? 
            tokensSoldCal.div(new BigNumber(totalTokens)).multipliedBy(100).toFixed(DECIMAL_PLACES): 
            new BigNumber(0).toFixed(DECIMAL_PLACES)
         );
        }
      }
    }

    if (poolAddress && networkAvailable) {
      calSoldProgress();
      soldProgressInterval = setInterval(() => calSoldProgress(), 20000);
    }

    return () => {
      soldProgressInterval && clearInterval(soldProgressInterval);
    }
  }, [poolAddress, appChainID, connector, networkAvailable, totalTokens]);
   
  return {
    tokenSold,
    soldProgress
  }
}


export default useTokenSoldProgress;
