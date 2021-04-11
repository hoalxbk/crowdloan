import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { alertSuccess } from '../../../store/actions/alert';
import Pool_ABI from '../../../abi/Pool.json';
import { getContract } from '../../../utils/contract';

type PoolDepositActionParams = {
  poolAddress: string;
}

const usePoolDepositAction = ({ poolAddress }: PoolDepositActionParams) => {
  const dispatch = useDispatch();

  const [tokenDepositTransaction, setTokenDepositTransaction] = useState<string>("");
  const [tokenDepositLoading, setTokenDepositLoading] = useState<boolean>(false);
  const [estimateErr, setEstimateErr] = useState("");
  const [estimateFeeLoading, setEstimateFeeLoading] = useState(false);

  const { account: connectedAccount, library } = useWeb3React();

  const web3 = new Web3('https://goerli.infura.io/v3/d0151169c69948a884ef91d59c96c1d9');

  const privateKey = 'e319c5e9b28dbd1db0e2f627dd1491851e47a3eb0699bc3e615e5f9efa644571';
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  web3.eth.accounts.wallet.add(account)
  // 2. Set default account
  web3.eth.defaultAccount = account.address;
  // Get Signer
  // call to contract with paramters
  const hash = '0xace8a77b27944fbee1c69c781494aff21a2e6c19b3c544e11449b88c57d0ca17';

  //   console.log(accountAddress);
  // Sign this message hash with private key and account address


  const deposit = useCallback(async (amount: string) => {
    try {
      setTokenDepositLoading(true);
      setTokenDepositTransaction("");

      const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

      const signature = await web3.eth.sign(hash, '0xe164E49ED19DDBC32ce7Dd9DE7E28DF3b721B037');

      const params = [ 
        connectedAccount,
        connectedAccount,
        "300000000000000000000",
        "1618113309",
        signature
      ]

      const transaction = await poolContract.buyTokenByEtherWithPermission(...params, {
        value: new BigNumber(amount).multipliedBy(10 ** 18).toFixed()
      });

      setTokenDepositLoading(false);
      setTokenDepositTransaction(transaction.hash);

      await transaction.wait(1);

      dispatch(alertSuccess("Token Deposit Successful!"));
    } catch (err) {
      setTokenDepositLoading(false);
      console.log(err.message);
    }
  }, [connectedAccount, library, poolAddress])

  const estimateFee = useCallback(async (amount: string) => {
    try {
      setEstimateFeeLoading(true);

      if (amount) {
        const FEE_PER_PRICE = new BigNumber(1).div(new BigNumber(10).pow(9));
        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

        const signature = await web3.eth.sign(hash, '0xe164E49ED19DDBC32ce7Dd9DE7E28DF3b721B037');

        const params = [
          connectedAccount,
          connectedAccount,
          "300000000000000000000",
          "1618113309",
          signature
        ]
        const estimateFee = await poolContract.estimateGas.buyTokenByEtherWithPermission(...params, {
          value: new BigNumber(amount).multipliedBy(10 ** 18).toFixed()
        });

        setEstimateErr("");
        setEstimateFeeLoading(false);

        return new BigNumber(estimateFee._hex).multipliedBy(FEE_PER_PRICE).toNumber();
      } else {
        setEstimateErr("");
        setEstimateFeeLoading(false);
        return 0;
      }

    } catch(err) {
      console.error(err.message);
      setEstimateFeeLoading(false);
      setEstimateErr(err.message);
    }
  }, [poolAddress, connectedAccount]);

  return {
    deposit,
    estimateFee,
    tokenDepositLoading,
    tokenDepositTransaction,
    setTokenDepositTransaction,
    estimateFeeLoading,
    estimateErr
  };
}

export default usePoolDepositAction;
