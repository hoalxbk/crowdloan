import Web3 from 'web3';

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

export const getContractInstance = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    const web3Instance = new Web3(ethereum);
    return new web3Instance.eth.Contract(
      ABIContract,
      contractAddress,
    );
  } else if (windowObj.web3) {
    const web3Instance = new Web3(windowObj.web3.currentProvider);
    return new web3Instance.eth.Contract(
      ABIContract,
      contractAddress,
    );
  } else {
    return null;
  }
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
