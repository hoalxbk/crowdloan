export const ETH_CHAIN_ID = process.env.REACT_APP_ETH_CHAIN_ID;
export const BSC_CHAIN_ID = process.env.REACT_APP_BSC_CHAIN_ID;

export enum ChainId  {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42
}

export interface NetworkInfo {
  name: string;
  id?: string | undefined;
  icon: string,
  disableIcon: string;
}

export enum APP_NETWORKS_NAME {
  METAMASK = "METAMASK",
  BSC = "BSC"
} 

export type appNetworkType = Extract<APP_NETWORKS_NAME, APP_NETWORKS_NAME.METAMASK | APP_NETWORKS_NAME.BSC>

export const APP_NETWORKS: {[key in APP_NETWORKS_NAME]: NetworkInfo } = {
  [APP_NETWORKS_NAME.METAMASK]: {
    name: 'Ethereum',
    id: ETH_CHAIN_ID,
    icon: "/images/ethereum.svg",
    disableIcon: "/images/ethereum-disabled.png"
  },
  [APP_NETWORKS_NAME.BSC]: {
    name: 'BSC',
    id: BSC_CHAIN_ID ,
    icon: "/images/bsc.svg",
    disableIcon: "/images/binance-disabled.png"
  },
}

export const APP_NETWORKS_ID: (string | undefined)[] = [ETH_CHAIN_ID, BSC_CHAIN_ID];
export const NETWORK_URL = process.env.REACT_APP_NETWORK_URL;
export const FORMATIC_KEY = process.env.REACT_APP_FORMATIC_KEY;
