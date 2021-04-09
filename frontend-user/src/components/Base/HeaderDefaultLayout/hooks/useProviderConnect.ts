import { useState, useContext, useEffect, SetStateAction, Dispatch, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { AppContext, AppContextType } from '../../../../AppContext';

import usePrevious from '../../../../hooks/usePrevious';
import { ConnectorNames } from '../../../../constants/connectors';
import { APP_NETWORKS_ID, ETH_CHAIN_ID, BSC_CHAIN_ID } from '../../../../constants/network';
import { requestSupportNetwork } from '../../../../utils/setupNetwork';
import { connectWalletSuccess, disconnectWallet } from '../../../../store/actions/wallet';

import { settingAppNetwork, NetworkUpdateType, settingCurrentConnector } from '../../../../store/actions/appNetwork';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || "";
const ETH_NETWORK_NAME = process.env.REACT_APP_ETH_NETWORK_NAME || "";
const BSC_RPC_URL = process.env.REACT_APP_BSC_RPC_URL || "";

const useProviderConnect = (
  setOpenConnectDialog?: Dispatch<SetStateAction<boolean>>, 
  openConnectDialog?: boolean,
  handleError?: () => void
) => {
  const dispatch = useDispatch();

  const { binanceAvailable } = useContext<AppContextType>(AppContext);
  const { appChainID, walletChainID } = useSelector((state: any) => state.appNetwork).data;
  const [account, setAccount] = useState<string | undefined>(undefined);

  const [appNetworkLoading, setAppNetworkLoading] = useState(false);
  const [walletNameSuccess, setWalletNameSuccess] = useState<string | undefined>(undefined);
  const [walletName, setWalletName] = useState<(undefined | string)[]>([]);
  const [currentConnector, setCurrentConnector] = useState<undefined | AbstractConnector>(undefined);
  const [connectWalletLoading, setConnectWalletLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {activate, active, connector, chainId, error, account: connectedAccount} = useWeb3React();

  console.log(walletNameSuccess);

  const previousAccount = usePrevious(account);
  const activePrevious = usePrevious(active);
  const previousConnector = usePrevious(connector);

  useEffect(() => {
      if (connectWalletLoading && ((active && !activePrevious) || (connector && connector !== previousConnector && !error))) {
        setConnectWalletLoading(false);
        setOpenConnectDialog && setOpenConnectDialog(false);
      }
    }, [
      active,
      connector,
      error,
      previousAccount,
      previousConnector,
      activePrevious,
      connectWalletLoading,
      setOpenConnectDialog,
      setConnectWalletLoading
  ]);

   useEffect(() => {
    const handleWeb3ReactUpdate = (updated: any) => {
      if (updated.account) {
        console.debug('Account changed: ', updated.account);
        setAccount(updated.account);
      }

      if (updated.chainId) {
        const chainId = Number(updated.chainId).toString();

        if (APP_NETWORKS_ID.indexOf(chainId.toString()) >= 0) {
          dispatch(
            settingAppNetwork(
            NetworkUpdateType.App,
            APP_NETWORKS_ID[APP_NETWORKS_ID.indexOf(chainId.toString())] as string
          ));
        }
        
        chainId && dispatch(settingAppNetwork(NetworkUpdateType.Wallet, chainId.toString()))  
      }
    }

    const handleWeb3ReactError = (err: any) => {
      if (err === 'NaN ChainId') {
        dispatch(settingAppNetwork(NetworkUpdateType.Wallet, undefined));
        setLoginError(`App network (${appChainID}) doesn't mach to network selected in wallet: NaN. Learn how to change network in wallet or`);
      }
    }

    if (currentConnector) {
      currentConnector.on('Web3ReactUpdate', handleWeb3ReactUpdate)
      currentConnector.on('Web3ReactError', handleWeb3ReactError);
    }

    return () => {
      if (currentConnector) {
        currentConnector.removeListener('Web3ReactUpdate', handleWeb3ReactUpdate);
        currentConnector.removeListener('Web3ReactError', handleWeb3ReactError);
      }
    }
  }, [currentConnector, connectedAccount]);

  useEffect(() => {
    currentConnector && setAppNetworkLoading(true);
  }, [appChainID]);

  // UseEffect for watching change app network loading
  useEffect(() => {
    if (!appNetworkLoading) {
      setOpenConnectDialog && setOpenConnectDialog(false);
      setConnectWalletLoading(false);
    }
  }, [appNetworkLoading]);

  // UseEffect for trying login after fullfilled app chain id and connector
   useEffect(() => {
      const tryLoginAfterSwitch = async () => {
        currentConnector 
        && appChainID 
        && ((appChainID === BSC_CHAIN_ID && binanceAvailable) || appChainID === ETH_CHAIN_ID) 
        && await tryActivate(currentConnector, appChainID, walletName[walletName.length - 1] as string);
      }

      currentConnector && appChainID && walletName.length > 0 && tryLoginAfterSwitch();
    }, [currentConnector, appChainID, walletName, binanceAvailable]);

    useEffect(() => {
      walletChainID && !openConnectDialog && !appNetworkLoading && switchNetwork(appChainID, walletChainID);
    }, [walletChainID, appNetworkLoading, appChainID, openConnectDialog]);

    // UseEffect for setting wallet id after login success
    useEffect(() => {
      if (!connectWalletLoading) {
        chainId && dispatch(settingAppNetwork(NetworkUpdateType.Wallet, chainId.toString()));
        connectedAccount && setAccount(connectedAccount);
      }
    }, [connectWalletLoading, connectedAccount, chainId])

    // Handle Provider choose
    const handleProviderChosen = (name: string, connector: AbstractConnector) => {
      console.log('Wallet Connected: ', name);
      setCurrentConnector(connector);
      walletName.indexOf(name) < 0 && setWalletName([...walletName, name]); 
    }

  const switchNetwork = (appChainID: string, walletChainID: string) => {
    if (appChainID && walletChainID) {
      console.log('Network Change Detected');
      Number(appChainID) !== Number(walletChainID) ? setLoginError(`App network (${appChainID}) doesn't mach to network selected in wallet: ${Number(walletChainID)}.`) : setLoginError('');
      currentConnector && activate(currentConnector, undefined, true).catch(err =>
        console.log('Fail when switch between network:', err.message)
      );
    }

    return;
  }

  const tryActivate = useCallback(async (connector: AbstractConnector, appChainID: string, wallet: string) => {
      setConnectWalletLoading(true);

      try {
        if (wallet === ConnectorNames.MetaMask || wallet === ConnectorNames.BSC) {
          await requestSupportNetwork(appChainID, wallet);
        }

        if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
          connector.walletConnectProvider = undefined;
        }
        // if (connector && walletName === ConnectorNames.Fortmatic) {

        //   await activate(connector, undefined, true)
        //   .then(() => { 
        //     dispatch(settingCurrentConnector(walletName));
        //     setWalletNameSuccess(walletName);
        //   })
        //   .catch(err => {
        //     if (error instanceof UnsupportedChainIdError) {
        //       activate(connector);
        //     } else {
        //       console.log(err.message);
        //     }
        //   });

        // }

        if (connector && walletName) {
          if (wallet === ConnectorNames.Fortmatic) {
            connector.on("OVERLAY_READY", () => {
              setOpenConnectDialog && setOpenConnectDialog(false);
            });
          }

          await activate(connector, undefined, true)
          .then(() => { 
            dispatch(settingCurrentConnector(wallet));
            setWalletNameSuccess(wallet);
          })
          .catch(error => {
            if (error instanceof UnsupportedChainIdError) {
              console.debug('Error when activate: ', error.message);
              activate(connector);
            } else {
              dispatch(disconnectWallet());
              handleError && handleError();
              setConnectWalletLoading(false);
              setWalletName(walletName.filter(name => wallet !== name));
              console.debug('Error when try to activate: ', error.message);
              return;
            }
          })
        }
      } catch (error) {
        console.log(error.message);
        setLoginError(error.message);
        setCurrentConnector(undefined);
      }

      setAppNetworkLoading(false);
  }, [connector, appChainID, walletName]);

  useEffect(() => {
    const getAccountDetails = async () => {
      if (appChainID && connectedAccount && walletNameSuccess) {
        const exactNetwork = appChainID === walletChainID;

        const provider = 
         appChainID === ETH_CHAIN_ID 
           ? new ethers.providers.InfuraProvider(ETH_NETWORK_NAME, INFURA_KEY)
           : new ethers.providers.JsonRpcProvider(BSC_RPC_URL);

        const accountBalance = exactNetwork 
          ? await provider.getBalance(connectedAccount)
          : { _hex: '0x00' }


        dispatch(
          connectWalletSuccess(
            walletNameSuccess, 
            [connectedAccount], 
            { 
              [connectedAccount]: new BigNumber(accountBalance._hex).div(new BigNumber(10).pow(18)).toFixed(5) 
            }
          )
        )
      }
    }

    getAccountDetails();
  }, [walletNameSuccess, connectedAccount, appChainID, walletChainID, loginError]);

  const handleConnectorDisconnect = useCallback(() => {
    dispatch(disconnectWallet());
    dispatch(settingCurrentConnector(undefined));
    setWalletName([]);
    setCurrentConnector(undefined);
    setWalletNameSuccess(undefined);
    setCurrentConnector(undefined);
    setLoginError('');
  }, []);
  
  return {
    handleProviderChosen,
    setWalletName,
    walletName,
    connectWalletLoading, 
    walletNameSuccess,
    loginError,
    currentConnector,
    appNetworkLoading,
    handleConnectorDisconnect
  }
}

export default useProviderConnect;
