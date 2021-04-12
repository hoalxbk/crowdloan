import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { css } from "@emotion/core";
import useStyles from './styles';

import ButtonLink from '../ButtonLink'
import { ETH_CHAIN_ID } from '../../../constants/network'
import AppNetworkSwitch from './AppNetworkSwitch';
import ConnectWalletModal from './ConnectWalletModal';
import WalletDisconnect from './WalletDisconnect';
import { HeaderContext } from './context/HeaderContext'
import { AppContext } from '../../../AppContext';
import { trimMiddlePartAddress } from '../../../utils/accountAddress';
import { connectorsByName, connectorNames } from '../../../constants/connectors';
import { WalletConnectionState } from  '../../../store/reducers/wallet';

const BrightStartIcon = "bright-star.svg";
const WalletIcon = "wallet.svg";
const EthereumIcon = "ethereum.svg";
const BSCIcon = "bsc.svg";

const HeaderDefaultLayout = () => {
  const styles = useStyles();

  const [switchNetworkDialog, setSwitchNetworkDialog] = useState<boolean>(false);
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const walletsInfo = useSelector((state: any) => state.wallet).entities;

  const { 
    handleProviderChosen, 
    currentConnector, 
    walletName, 
    setWalletName, 
    loginError,
    currentConnectedWallet,
    setCurrentConnectedWallet,
    openConnectWallet,
    setOpenConnectWallet,
    connectWalletLoading
  } = useContext(AppContext);

  const currentAccount = currentConnectedWallet && currentConnectedWallet.addresses[0];
  const balance = currentConnectedWallet ? currentConnectedWallet.balances[currentAccount]: 0;

  const handleConnectWalletClose = () => {
    setOpenConnectWallet && setOpenConnectWallet(false);
  }

  const handleConnectWalletOpen = () => {
    setOpenConnectWallet && setOpenConnectWallet(true);
  }

  const handleDisconnectDialogOpen = () => {
    setDisconnectDialog(true);
  }

  useEffect(() => {
    if (walletsInfo && walletName) {
      let currentWalletsName: string[] = [];
      let isFound = false;

      Object.keys(walletsInfo).forEach(key => {
        const wallet = walletsInfo[key];

        if (wallet.addresses.length > 0 && wallet.connectionState === WalletConnectionState.CONNECTED && !isFound) { 
          isFound = true;
          setCurrentConnectedWallet && setCurrentConnectedWallet(wallet);
          currentWalletsName.push(key);
        }
      });

      if (currentWalletsName.length > 0 && walletName.length === 0 && !currentConnector) {
        const chooseWallet = currentWalletsName[0] as connectorNames;

        setWalletName && setWalletName(currentWalletsName);
        handleProviderChosen && handleProviderChosen(chooseWallet, connectorsByName[chooseWallet]);
      }
    } 
  }, [walletsInfo, walletName]);

  return (
    <>
      <div className={styles.navBar}>
        <div>
          <Link to={'/'} className={styles.navbarLink}>
          <img src="/images/logo.svg" className={styles.navbarLogo}/>
          <h1 className={styles.navbarBrand}><strong className={styles.navbarBrandBold}>RED</strong> KITE</h1>
          </Link>
        </div>
        <div className={styles.rightBar}>
        <ButtonLink text="Pool" to={'/'} icon={BrightStartIcon} className={`${styles.btn}`} />
        <button className={`${styles.btn} ${styles.btnNetwork}`} onClick={() => setSwitchNetworkDialog(true)}>
        <img src={`/images/${appChainID === ETH_CHAIN_ID ? EthereumIcon: BSCIcon}`} />
          <span className={styles.btnConnectText}>
            {appChainID === ETH_CHAIN_ID ? 'Ethereum': 'BSC Mainnet'}
          </span>
        </button>
        <button 
          className={`${styles.btn} ${styles.btnConnect}`} 
          onClick={!currentAccount ? handleConnectWalletOpen: handleDisconnectDialogOpen}
        >
          {
            !connectWalletLoading ? (
              <>
                <span>
                {
                  currentAccount && (!loginError ? `${balance} ${appChainID === ETH_CHAIN_ID ? "ETH": "BNB"}`: '0' ) 
                }
                </span>
                {
                  !currentAccount && <img src={ `/images/${WalletIcon}`} />
                }
                <span className={`${styles.btnConnectText} ${currentAccount ? styles.btnAccount: ''}`}>
                {
                  currentAccount && `${trimMiddlePartAddress(currentAccount)}` || "Connect Wallet"
                }
                </span>
              </> 
            ): <BeatLoader color={'white'} css={css`margin-top: 3px`} size={10} />
          }
          </button>
        </div>
        <HeaderContext.Provider value={{ agreedTerms, setAgreedTerms }}>
            <ConnectWalletModal opened={openConnectWallet as boolean} handleClose={handleConnectWalletClose}/>
            <AppNetworkSwitch 
              opened={switchNetworkDialog} 
              handleClose={() => setSwitchNetworkDialog(false)} 
            />
            <WalletDisconnect 
              opened={disconnectDialog} 
              handleClose={() => setDisconnectDialog(false)} 
              currentWallet={currentConnectedWallet}
            />
        </HeaderContext.Provider>
        {
          loginError && (
            <div className={styles.loginErrorBanner}>
              <img src="/images/red-warning.svg" alt="red-warning icon" />
              <span className={styles.loginErrorBannerText}>
                {loginError} Learn how to &nbsp;
                <a href="https://help.1inch.exchange/en/articles/4966690-how-to-use-1inch-on-bsc-binance-smart-chain" target="_blank" className={styles.loginErrorGuide}>
                  change network in wallet 
                </a>
                &nbsp; or &nbsp;
                <button 
                  className={styles.btnChangeAppNetwork} 
                  onClick={() => setSwitchNetworkDialog(true)}
                >
                  Change App Network
                </button>
              </span>
            </div>
          ) 
        }
      </div>
    </>
  );
};

export default HeaderDefaultLayout;
