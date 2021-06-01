import {BSC_RPC_URL} from '../constants/network';
import {ETH_CHAIN_ID, BSC_CHAIN_ID} from '../constants/network';
import {ConnectorNames} from '../constants/connectors';
import {NETWORK_AVAILABLE} from "../constants";

const BSC_CHAIN_ALIAS = process.env.REACT_APP_BSC_BSC_CHAIN_ALIAS;
const ETH_CHAIN_ALIAS = process.env.REACT_APP_BSC_ETH_CHAIN_ALIAS;
const REACT_APP_NETWORK_BSC_NAME = process.env.REACT_APP_NETWORK_BSC_NAME;
const BSC_ADDRESS = parseInt(process.env.REACT_APP_BSC_CHAIN_ID as string, 10);

export const getEtherscanName = ({networkAvailable}: any) => {
  // console.log('etherscanName', networkAvailable);
  if (networkAvailable === NETWORK_AVAILABLE.BSC) {
    return 'Bscscan';
  } else {
    return 'Etherscan';
  }
};




