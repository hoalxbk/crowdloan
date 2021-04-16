import { useState, useEffect, SetStateAction, Dispatch, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import BigNumber from 'bignumber.js';

import usePrevious from '../../../../hooks/usePrevious';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ConnectorNames } from '../../../../constants/connectors';
import { APP_NETWORKS_ID, ETH_CHAIN_ID, BSC_CHAIN_ID } from '../../../../constants/network';
import { requestSupportNetwork } from '../../../../utils/setupNetwork';
import { connectWalletSuccess, updateWalletBalance, disconnectWallet } from '../../../../store/actions/wallet';
import { TwoFactors } from '../../../../store/reducers/wallet';
import getAccountBalance from '../../../../utils/getAccountBalance';
import { userActions } from '../../../../store/constants/user';

import { settingAppNetwork, NetworkUpdateType, settingCurrentConnector } from '../../../../store/actions/appNetwork';

const useProviderConnect = (
  setOpenConnectDialog?: Dispatch<SetStateAction<boolean>>, 
  openConnectDialog?: boolean,
  handleError?: () => void,
  handleLogout?: () => void,
  binanceAvailable?: boolean
) => {
  const dispatch = useDispatch();

  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const { twoFactor, walletConnect } = useTypedSelector(state => state.wallet);
  const [account, setAccount] = useState<string | undefined>(undefined);

  const [appNetworkLoading, setAppNetworkLoading] = useState(false);
  const [walletNameSuccess, setWalletNameSuccess] = useState<string | undefined>(undefined);
  const [walletName, setWalletName] = useState<(undefined | string)[]>([]);
  const [currentConnector, setCurrentConnector] = useState<undefined | AbstractConnector>(undefined);
  const [connectWalletLoading, setConnectWalletLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const history = useHistory();
  const {activate, active, connector, chainId, error, account: connectedAccount, deactivate } = useWeb3React();

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
      console.log(updated);
      if (updated.account) {
        if (localStorage.getItem("investor_access_token")) {
          localStorage.removeItem("investor_access_token");
          dispatch({ type: userActions.INVESTOR_LOGOUT });
          handleLogout && handleLogout();
          handleConnectorDisconnect();
        } else { 
          console.debug('Account changed: ', updated.account);
          setAccount(updated.account); 
        }
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
        console.log('Remove Connector');
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
      try {
        if (!connectWalletLoading) {
          setConnectWalletLoading(true);

          if (wallet === ConnectorNames.MetaMask || wallet === ConnectorNames.BSC) {
            await requestSupportNetwork(appChainID, wallet);
          }

          if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
            connector.walletConnectProvider = undefined;
          }

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
      const investorToken = localStorage.getItem("investor_access_token") || "";

      if (
        ((appChainID === walletChainID && twoFactor === TwoFactors.Layer2) || !twoFactor) 
          && connectedAccount 
          && walletNameSuccess 
          && !walletConnect
      ) {
        const accountBalance = await getAccountBalance(appChainID, walletChainID, connectedAccount as string, walletNameSuccess);

        setOpenConnectDialog && setOpenConnectDialog(false);
        setConnectWalletLoading(false);

        const dispatchAction = twoFactor === TwoFactors.Layer2 ? updateWalletBalance: connectWalletSuccess;

        dispatch(
          dispatchAction(
            walletNameSuccess, 
            [connectedAccount], 
            { 
              [connectedAccount]: new BigNumber(accountBalance._hex).div(new BigNumber(10).pow(18)).toFixed(5) 
            }
          )
        );

        !investorToken && history.push('/login');
      } 
      else if (twoFactor === TwoFactors.Layer1 && walletNameSuccess && !walletConnect && !investorToken) {
        handleLogout && handleLogout();
        handleConnectorDisconnect();
      }
    } 
    getAccountDetails();
  }, [walletNameSuccess, connectedAccount, appChainID, walletChainID, twoFactor, walletConnect]);

  const handleConnectorDisconnect = useCallback(() => {
    deactivate();
    dispatch(disconnectWallet());
    dispatch(settingCurrentConnector(undefined));
    dispatch(settingAppNetwork(NetworkUpdateType.Wallet, undefined));
    setWalletName([]);
    setWalletNameSuccess(undefined);
    setCurrentConnector(undefined);
    setConnectWalletLoading(false);
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
