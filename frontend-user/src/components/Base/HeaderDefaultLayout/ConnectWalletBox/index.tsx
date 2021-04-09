import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { settingAppNetwork, NetworkUpdateType } from '../../../../store/actions/appNetwork';
import { WalletInfo } from '../../../../constants/connectors';
import { NetworkInfo } from '../../../../constants/network';
import { HeaderContext, HeaderContextType } from '../context/HeaderContext';
import useStyles from './style';

interface ConnectWalletBoxPropsType {
  appNetwork?: NetworkInfo;
  wallet?: WalletInfo;
  isAppNetwork?: boolean;
  handleProviderChosen?: (name: string,  connector: AbstractConnector) => void;
  connectWalletLoading?: boolean,
  walletName?: (string | undefined)[],
  forceEnable?: boolean
}

const ConnectWalletBox: React.FC<ConnectWalletBoxPropsType> = (props: ConnectWalletBoxPropsType) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { appNetwork, isAppNetwork = false, handleProviderChosen, wallet, walletName, connectWalletLoading, forceEnable } = props;
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const { agreedTerms } = useContext<HeaderContextType>(HeaderContext);

  const handleNetworkChange = (appNetwork: boolean, updatedVal: string, agreedTerms: boolean = false) => {
    if (agreedTerms || forceEnable) {
      if (appNetwork) {
        dispatch(settingAppNetwork(NetworkUpdateType.App, updatedVal));
        return;
      }

      wallet && handleProviderChosen && handleProviderChosen(wallet.name, wallet.connector as AbstractConnector);
    }
  }

  const pointerStyle = {
    cursor: `${(agreedTerms || forceEnable) ? 'pointer': 'initial'}`
  }

  const render = () => {
    if (appNetwork) {
      const { name, icon, id, disableIcon } = appNetwork;

      return (
        <div 
          className={`${styles.walletBox}`} 
          onClick={() => 
            handleNetworkChange(isAppNetwork, id as string, agreedTerms)
          }
          style={pointerStyle}
        >
          <div className={styles.walletBoxIconWrap}>
            {
              <img src={`${(agreedTerms || forceEnable) ? icon: disableIcon}`} style={{ width: agreedTerms ? 40: 50 }} alt={name} className={styles.walletBoxIcon} />
            }
            {
              appChainID === id && 
                <img 
                  src={`/images/circle_done.svg`} 
                  style={{ color: '#212a3b' }} 
                  className={styles.walletBoxCheck}
                />
            }
          </div>
          <p className={styles.walletBoxText}>{name}</p>
        </div>
      )
    }

    if (wallet) {
      const { name, icon, disableIcon } = wallet;

      return (
        <div 
          className={`${styles.walletBox}`} 
          onClick={() => 
            handleNetworkChange(isAppNetwork, name, agreedTerms)
          }
          style={pointerStyle}
        >
          <div className={styles.walletBoxIconWrap}>
            {
              connectWalletLoading && walletName && walletName.indexOf(name) >= 0 ? <img src="/images/loading.png" /> 
              :  <img 
                  src={`${agreedTerms ? icon: disableIcon}`} 
                  style={{ width: agreedTerms ? 40: 50 }} 
                  alt={name} 
                  className={styles.walletBoxIcon} 
                />
            }
          </div>
          <p className={styles.walletBoxText}>{name}</p>
        </div>
      )
    }

    return null;
  }

  return (render())
}

export default ConnectWalletBox;
