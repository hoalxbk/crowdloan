import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { TokenType } from '../../../hooks/useTokenDetails';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import ERC20_ABI from '../../../abi/Erc20.json';
import Pool_ABI from '../../../abi/Pool.json';
import { getContractInstance, SmartContractMethod } from '../../../services/web3';

const useTokenSoldProgress = (poolAddress: string, token: TokenType) => {
  const [soldProgress, setSoldProgress] = useState<number>(0);
  const [tokenSold, setTokenSold] = useState<number>(0);
  const [totalSell, setTotalSell] = useState<number>(0);

  const { appChainID }  = useTypedSelector(state  => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;

  useEffect(() => {
    const calSoldProgress = async () => {
      if (ethers.utils.isAddress(poolAddress)) {
        const poolContract = getContractInstance(Pool_ABI, poolAddress, connector, appChainID, SmartContractMethod.Read);
        const tokenContract = getContractInstance(ERC20_ABI, token.address, connector, appChainID, SmartContractMethod.Read);

        if (poolContract && tokenContract) {
          const tokensSold = new BigNumber(await poolContract.methods.tokenSold().call());
          const totalTokens = new BigNumber(await tokenContract.methods.balanceOf(poolAddress).call());

          setTokenSold(tokensSold.div(new BigNumber(10).pow(18)).toNumber());
          setTotalSell(totalTokens.div(new BigNumber(10).pow(18)).toNumber());
          setSoldProgress(tokensSold.div(totalTokens).multipliedBy(100).toNumber());
        }
      }
    }

    poolAddress && token && calSoldProgress();
  }, [poolAddress, token]);
   
  return {
    tokenSold,
    totalSell,
    soldProgress
  }
}


export default useTokenSoldProgress;
