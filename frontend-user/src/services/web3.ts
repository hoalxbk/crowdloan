import Web3 from 'web3';
import { connectorNames, ConnectorNames, connectorsByName } from '../constants/connectors';
import { ETH_CHAIN_ID } from '../constants/network';

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL || "";
const BSC_NETWORK_URL = process.env.REACT_APP_BSC_RPC_URL || "";
export const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export enum SmartContractMethod {
  Write = "Write",
  Read = "Read"
}

type smartContractMethod = Extract<SmartContractMethod, SmartContractMethod.Write | SmartContractMethod.Read>

export const getWeb3Instance = () => {
  const windowObj = window as any;
  const { ethereum, web3 } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    return new Web3(ethereum);
  }
  if (web3) {
    return new Web3(web3.currentProvider);
  }
  return null;
};

export const isMetaMaskInstalled = () => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  return ethereum && ethereum.isMetaMask;
};


export const getProviderByNetwork = (
  networkName: connectorNames, 
  appChainID: string, 
  typeMethod: smartContractMethod,
  forceUsingEther: boolean
) => {
  if (forceUsingEther) {
      return new Web3.providers.HttpProvider(NETWORK_URL);
  }

  if (appChainID && typeMethod === SmartContractMethod.Read) {
      return new Web3.providers.HttpProvider(appChainID === ETH_CHAIN_ID ? NETWORK_URL: BSC_NETWORK_URL);
  }  

  const provider = (connectorsByName[networkName as connectorNames] as any);
  return provider;
}

export const getContractInstance = 
  (ABIContract: any, 
   contractAddress: string, 
   networkName: connectorNames = ConnectorNames.MetaMask, 
   appChainID: string = ETH_CHAIN_ID as string, 
   typeMethod: smartContractMethod = SmartContractMethod.Read,
   forceUsingEther: boolean = false
  ) => {
  const provider = getProviderByNetwork(networkName as connectorNames, appChainID, typeMethod, forceUsingEther);

  if (provider) {
    const web3Instance = new Web3(provider);

    return new web3Instance.eth.Contract(
      ABIContract,
      contractAddress,
    );
  }

  return;
};

export const convertFromWei = (value: any, unit = 'ether') => {
  return Web3.utils.fromWei(value);
};

export const convertToWei = (value: any, unit = 'ether') => {
  const webInstance = getWeb3Instance();
  // @ts-ignore
  return webInstance.utils.toWei(value, unit);
};

export const isValidAddress = (address: string) => {
  return Web3.utils.isAddress(address);
}

export const getETHBalance = async (loginUser: string) => {
  const web3 = getWeb3Instance() as any;
  if (web3) {
    const balance = await web3.eth.getBalance(loginUser);

    return web3.utils.fromWei(balance);
  };

  return 0;
}

export const convertToBN = (number: string) => {
  return Web3.utils.toBN(number)
}
