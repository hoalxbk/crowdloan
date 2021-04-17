import { useState, useEffect, useCallback } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useWeb3React } from '@web3-react/core';

import { connectorNames } from  '../constants/connectors';
import { WalletConnectionState } from  '../store/reducers/wallet';

type ReturnType = {
  isAuth: boolean,
  connectedAccount: string | null | undefined;
  wrongChain: boolean
}

const useAuth = (): ReturnType => {
  const { active, account, chainId }  = useWeb3React();
  const [activeWallet, setActiveWallet] = useState<connectorNames | undefined>(undefined);
  const [isAuth, setIsAuth] = useState(false);

  const walletsInfo = useTypedSelector(state => state.wallet).entities;
  const { appChainID } = useTypedSelector((state: any) => state.appNetwork).data;

  const getCurrentActiveWallet = useCallback(() => {
    let isFound = false;

    Object.keys(walletsInfo).forEach(key => {
      const walletNameTemp = key as connectorNames;
      const wallet = walletsInfo[walletNameTemp];

      if (wallet.addresses.length > 0 && wallet.connectionState === WalletConnectionState.CONNECTED && !isFound) { 
        setActiveWallet(walletNameTemp);
        isFound = true;
      }
    });
  }, [])
  
  useEffect(() => {
    if (active) {
      activeWallet ? setIsAuth(true) : getCurrentActiveWallet();
    } else { 
      setIsAuth(false);
      setActiveWallet(undefined);
    }
  }, [active, activeWallet]);

  return { isAuth, connectedAccount: account, wrongChain: appChainID != chainId };
}

export default useAuth;
