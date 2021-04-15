import {BscConnector} from '@binance-chain/bsc-connector'
import {WalletConnectConnector} from '@web3-react/walletconnect-connector'
import {InjectedConnector} from '@web3-react/injected-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import {FortmaticConnector} from '../connectors/Fortmatic';
import {ETH_CHAIN_ID} from './network';

import {FORMATIC_KEY, NETWORK_URL, APP_NETWORKS_NAME } from './network';

export const bscConnector = new BscConnector({}) as any;
export const injected = new InjectedConnector({});

const originalChainIdChangeHandler = bscConnector.handleChainChanged;

//@ts-ignore
bscConnector.handleChainChanged = (chainId: string) => {
  const chainIdNum = Number(chainId);
  console.debug("Handling 'chainChanged' event with payload", chainId, isNaN(chainIdNum));
  if (isNaN(chainIdNum)) {
    bscConnector.emitError('NaN ChainId');
    return;
  }
  //@ts-ignore
  originalChainIdChangeHandler(chainId)
}

// mainnet only
export const walletConnect = new WalletConnectConnector({
  rpc: {[Number(ETH_CHAIN_ID)]: NETWORK_URL as string},
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
});

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  // iconName: string
  description: string
  href: string | null
  // color: string
  primary?: true
  mobile?: true
  mobileOnly?: true,
  disableIcon: string;
  icon: string 
}

export enum ConnectorNames {
  MetaMask = "MetaMask",
  BSC = "BSC Wallet",
  WalletConnect = "WalletConnect",
  Fortmatic = 'Fortmatic'
}

export type connectorNames = Extract<ConnectorNames, ConnectorNames.MetaMask | ConnectorNames.BSC | ConnectorNames.WalletConnect | ConnectorNames.Fortmatic>;

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: ConnectorNames.MetaMask,
    icon: '/images/metamask.svg',
    disableIcon: '/images/metamask-disabled.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: ConnectorNames.WalletConnect,
    icon: '/images/WalletConnect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    disableIcon: '/images/wallet-connect-disabled.svg',
    href: null,
    mobile: true
  },
  BSC_WALLET: {
    connector: bscConnector,
    name: ConnectorNames.BSC,
    icon: '/images/injected-binance.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    disableIcon: '/images/injected-binance-disabled.svg',
    href: null,
  },
  FORTMATIC: {
    connector: fortmatic,
    name: ConnectorNames.Fortmatic,
    icon: '/images/fortmatic.svg',
    description: 'Login using Fortmatic hosted wallet',
    disableIcon: '/images/fortmatic-disabled.svg',
    href: null,
    mobile: true
  },
}


export const connectorsByName: { [key in ConnectorNames]: AbstractConnector } = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.WalletConnect]: walletConnect
}

export const connectorsSupportByNetwork: {[key: string]: { [key:string]: WalletInfo }  } = {
  [APP_NETWORKS_NAME.METAMASK]: SUPPORTED_WALLETS,
  [APP_NETWORKS_NAME.BSC]: Object.assign({}, {
    METAMASK: SUPPORTED_WALLETS.METAMASK,
    BSC_WALLET: SUPPORTED_WALLETS.BSC_WALLET
  })
}
