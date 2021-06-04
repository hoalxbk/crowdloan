import Web3 from 'web3';
import {ACCEPT_CURRENCY, NETWORK_AVAILABLE} from "../constants";

const POOL_ABI = require('../abi/Swap/Campaign.json');
const POOL_PRESALE_ABI = require('../abi/Claim/Campaign.json');
const ERC20_ABI = require('../abi/Erc20.json');

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL || "";
const BSC_NETWORK_URL = process.env.REACT_APP_BSC_RPC_URL || "";

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

export const getContractInstance = (ABIContract: any, contractAddress: string, isEth: boolean = true) => {
  if (isEth) {
    return getContractInstanceWithEthereum(ABIContract, contractAddress);
  } else {
    return getContractInstanceWithBSC(ABIContract, contractAddress);
  }
};

export const getContractInstanceWithEthereum = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    const web3Instance = new Web3(ethereum);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else if (windowObj.web3) {
    const web3Instance = new Web3(windowObj.web3.currentProvider);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else {
    return null;
  }
};

export const getContractInstanceWithBSC = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  const web3Instance = new Web3(ethereum);
  return new web3Instance.eth.Contract(ABIContract, contractAddress);
};

export const getAbiPool = (isClaimable = true) => {
  const ABI = isClaimable ? POOL_PRESALE_ABI : POOL_ABI;
  return ABI;
}

export const getContractInstanceWeb3 = (isEth = true) => {
  let provider = new Web3.providers.HttpProvider(NETWORK_URL);
  if (!isEth) {
    provider = new Web3.providers.HttpProvider(BSC_NETWORK_URL);
  }
  let web3Instance = new Web3(provider);
  return web3Instance;
};

export const getPoolContract = ({ networkAvailable, poolHash, isClaimable = true }: any) => {
  let web3Instance = null;
  const ABI = isClaimable ? POOL_PRESALE_ABI : POOL_ABI;
  if (networkAvailable == NETWORK_AVAILABLE.BSC) {
    web3Instance = getContractInstance(ABI, poolHash, false);
  } else if (networkAvailable == NETWORK_AVAILABLE.ETH) {
    web3Instance = getContractInstance(ABI, poolHash, true);
  }
  return web3Instance;
};

export const getErc20Contract = ({ networkAvailable, erc20TokenAddress }: any) => {
  let web3Instance = null;
  if (networkAvailable == NETWORK_AVAILABLE.BSC) {
    web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, false);
  } else if (networkAvailable == NETWORK_AVAILABLE.ETH) {
    web3Instance = getContractInstance(ERC20_ABI, erc20TokenAddress, true);
  }
  return web3Instance;
};

export const convertFromWei = (value: any, unit = 'ether') => {
  const webInstance = getWeb3Instance();
  // @ts-ignore
  return webInstance.utils.fromWei(value, unit);
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

export const callMultiGetTier = async () => {


}
