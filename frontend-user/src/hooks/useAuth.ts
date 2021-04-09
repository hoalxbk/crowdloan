import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import { connectorNames } from  '../constants/connectors';
import { WalletConnectionState } from  '../store/reducers/wallet';

type ReturnType = {
  isAuth: boolean,
  connectedAccount: string | null | undefined;
}

const useAuth = (): ReturnType => {
  const { active, account }  = useWeb3React();
  const walletsInfo = useSelector((state: any) => state.wallet).entities;
  const [activeWallet, setActiveWallet] = useState<connectorNames | undefined>(undefined);
  const [isAuth, setIsAuth] = useState(false);

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
    }
  }, [active, activeWallet]);

  return { isAuth, connectedAccount: account };
}

export default useAuth;
