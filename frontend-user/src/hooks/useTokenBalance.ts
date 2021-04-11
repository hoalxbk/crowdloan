import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { TokenType } from '../hooks/useTokenDetails';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { getContractInstance, SmartContractMethod } from '../services/web3';

import ERC20_ABI from '../abi/Erc20.json';

const useTokenBalance = (token: TokenType | undefined, userAddress: string | null | undefined) => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState<boolean>(false);

  const { appChainID }  = useSelector((state: any) => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;

  useEffect(() => {
    const fetchTokenBalance = async (address: string, userAddress: string) => {
      setTokenBalanceLoading(true);

      const web3 = new Web3('https://goerli.infura.io/v3/d0151169c69948a884ef91d59c96c1d9');

      const privateKey = 'e319c5e9b28dbd1db0e2f627dd1491851e47a3eb0699bc3e615e5f9efa644571';
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accountAddress = account.address;

      web3.eth.accounts.wallet.add(account)
        // 2. Set default account
        web3.eth.defaultAccount = account.address;
      // Get Signer
        // call to contract with paramters
        const hash = '0x98f7c4a42df74440d8ef7f3fbcf4012f85338d2049b3f7b6b5bb3dfe27dc75ce';

      //   console.log(accountAddress);
        // Sign this message hash with private key and account address
        const signature = await web3.eth.sign(hash, '0xe164E49ED19DDBC32ce7Dd9DE7E28DF3b721B037');

      const contract = getContractInstance(ERC20_ABI, address, connector, appChainID, SmartContractMethod.Read);

      if (contract) {
        const balance = await contract.methods.balanceOf(userAddress).call();
        const balanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number)).toNumber();

        setTokenBalance(balanceReturn);
      }
    }

    token 
      && userAddress 
      && ethers.utils.isAddress(userAddress) 
      && ethers.utils.isAddress(token.address) 
      && fetchTokenBalance(token.address, userAddress);
  }, [userAddress, token]);

  return {
    tokenBalance,
    tokenBalanceLoading
  }
}

export default useTokenBalance;
