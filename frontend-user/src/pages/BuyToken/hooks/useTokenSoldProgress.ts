import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { TokenType } from '../../../hooks/useTokenDetails';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import ERC20_ABI from '../../../abi/Erc20.json';
import Pool_ABI from '../../../abi/Pool.json';
import { getContractInstance, SmartContractMethod } from '../../../services/web3';

const DECIMAL_PLACES = 8;

const useTokenSoldProgress = (poolAddress: string | undefined, token: TokenType | undefined, networkAvailable: string | undefined) => {
  const [soldProgress, setSoldProgress] = useState<string>("0");
  const [tokenSold, setTokenSold] = useState<string>("0");
  const [totalSell, setTotalSell] = useState<string>("0");

  const { appChainID }  = useTypedSelector(state  => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;
  let soldProgressInterval = undefined as any;

  useEffect(() => {
    const calSoldProgress = async () => {
      if (poolAddress && token && networkAvailable && ethers.utils.isAddress(poolAddress)) {
        const poolContract = getContractInstance(
          Pool_ABI, 
          poolAddress, 
          connector, 
          appChainID, 
          SmartContractMethod.Read, 
          networkAvailable === 'eth'
        );
        const tokenContract = getContractInstance(
          ERC20_ABI, 
          token.address, 
          connector, 
          appChainID, 
          SmartContractMethod.Read, 
          networkAvailable === 'eth'
        );

        if (poolContract && tokenContract) {
          const tokensSold = await poolContract.methods.tokenSold().call();
          const totalTokens = await tokenContract.methods.balanceOf(poolAddress).call();

          const tokensSoldCal = new BigNumber(tokensSold).div(new BigNumber(10).pow(18));
          const totalTokensCal = new BigNumber(totalTokens).div(new BigNumber(10).pow(18));

          setTokenSold(tokensSoldCal.toFixed(DECIMAL_PLACES));
          setTotalSell(totalTokensCal.toFixed(DECIMAL_PLACES));
          setSoldProgress(
            !tokensSoldCal.eq(new BigNumber(0)) ? 
            tokensSoldCal.div(totalTokensCal).multipliedBy(100).toFixed(DECIMAL_PLACES): 
            new BigNumber(0).toFixed(DECIMAL_PLACES)
         );
        }
      }
    }

    if (poolAddress && token && networkAvailable) {
      soldProgressInterval = setInterval(() => calSoldProgress(), 20000);
    }

    return () => {
      soldProgressInterval && clearInterval(soldProgressInterval);
    }
  }, [poolAddress, token, appChainID, connector, networkAvailable]);
   
  return {
    tokenSold,
    totalSell,
    soldProgress
  }
}


export default useTokenSoldProgress;
