import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import useUserPurchaseSignature from '../hooks/useUserPurchaseSignature';
import useWalletSignature from '../../../hooks/useWalletSignature';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import Pool_ABI from '../../../abi/Pool.json';
import { getContract } from '../../../utils/contract';

type PoolDepositActionParams = {
  poolAddress?: string;
  poolId?: number;
  purchasableCurrency: string;
  amount: string
}

const USDT_ADDRESS = process.env.REACT_APP_USDT_SMART_CONTRACT;
const USDC_ADDRESS = process.env.REACT_APP_USDC_SMART_CONTRACT;

const usePoolDepositAction = ({ poolAddress, poolId, purchasableCurrency, amount }: PoolDepositActionParams) => {
  const dispatch = useDispatch();

  const [depositError, setDepositError] = useState("");
  const [tokenDepositTransaction, setTokenDepositTransaction] = useState<string>("");
  const [tokenDepositLoading, setTokenDepositLoading] = useState<boolean>(false);
  const [estimateErr, setEstimateErr] = useState("");
  const [estimateFeeLoading, setEstimateFeeLoading] = useState(false);

  const { account: connectedAccount, library } = useWeb3React();
  const { error, signMessage, signature: authSignature, setSignature } = useWalletSignature();
  const { signature, minBuy, maxBuy, error: buyError } = useUserPurchaseSignature(connectedAccount, poolId, authSignature);
  console.log(authSignature, signature);

  useEffect(() => {
    poolAddress && 
    purchasableCurrency && 
    signature &&
    minBuy &&
    maxBuy &&
    tokenDepositLoading &&
    authSignature &&
    depositWithSignature(poolAddress, purchasableCurrency, amount, signature, `${minBuy}`, maxBuy);
  }, [signature, authSignature, poolAddress, purchasableCurrency, amount, minBuy, maxBuy, tokenDepositLoading]);

  useEffect(() => {
    if (error || buyError) {
      setDepositError(error);
      setTokenDepositLoading(false);
    }
  }, [error, buyError]);

  const depositWithSignature = useCallback(async (
    poolAddress: string, 
    acceptCurrency: string, 
    amount: string, 
    signature: string,
    minBuy: string,
    maxBuy: string
  ) => {
    try {
      if (minBuy && maxBuy && signature && amount) {
        console.log('run');
        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

        const method = acceptCurrency === 'ETH' ? 'buyTokenByEtherWithPermission': 'buyTokenByTokenWithPermission';

        const params = acceptCurrency === 'ETH' ? [ 
          connectedAccount,
          connectedAccount,
          maxBuy,
          minBuy,
          signature,
          {
            value: new BigNumber(amount).multipliedBy(10 ** 18).toFixed()
          }
        ]: [
          connectedAccount,
          acceptCurrency ===  "USDT" ? USDT_ADDRESS: USDC_ADDRESS,
          new BigNumber(amount).multipliedBy(10 ** 18).toFixed(),
          connectedAccount,
          maxBuy,
          minBuy,
          signature
        ];

        const transaction = await poolContract[method](...params);

        setSignature("");
        setTokenDepositLoading(false);
        setTokenDepositTransaction(transaction.hash);

        await transaction.wait(1);

        dispatch(alertSuccess("Token Deposit Successful!"));
      }
    } catch (err) {
      dispatch(alertFailure(err.message));
      setTokenDepositLoading(false);
      setSignature("");
      setDepositError(err.message);
    }
  }, [minBuy, maxBuy, signature, poolAddress]);

  const deposit = useCallback(async () => {
    if (amount && new BigNumber(amount).gt(0) && poolAddress) {
      try {
        setTokenDepositLoading(true);
        setTokenDepositTransaction("");
        setDepositError("");

        await signMessage();
      } catch (err) {
        dispatch(alertFailure(err.message));
        setSignature("");
        setTokenDepositLoading(false);
        throw new Error(err.message);
      }
    }
  }, [connectedAccount, library, poolAddress, amount])

  const estimateFee = useCallback(async (amount: string, acceptCurrency: string) => {
    try {
      setEstimateFeeLoading(true);

      if (amount && new BigNumber(amount).gt(0) && poolAddress && acceptCurrency) {
        const gasPrice = await library.getGasPrice();
        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);
        const gasPriceCal = new BigNumber(gasPrice._hex).div(new BigNumber(10).pow(18));

        const params = acceptCurrency === 'ETH' ? [ 
          connectedAccount,
          connectedAccount,
          "100000000000",
          "100000000000",
          "0x450859e7066471c9e38a481908e3547240285db6af24eed2615a3d825f043e5052bffc0815e98b6a4365526307e2f18b9552bb747739789d624ea666e4fb87ea1b",
          {
            value: new BigNumber(amount).multipliedBy(10 ** 18).toFixed()
          }
        ]: [
          connectedAccount,
          acceptCurrency ===  "USDT" ? USDT_ADDRESS: USDC_ADDRESS,
          new BigNumber(amount).multipliedBy(10 ** 18).toFixed(),
          connectedAccount,
          "100000000000",
          "299999999990",
          "0x450859e7066471c9e38a481908e3547240285db6af24eed2615a3d825f043e5052bffc0815e98b6a4365526307e2f18b9552bb747739789d624ea666e4fb87ea1b"
        ];

        console.log(params);

        const method = acceptCurrency === 'ETH' ? 'buyTokenByEtherWithPermission': 'buyTokenByTokenWithPermission';

        const estimateFee = await poolContract.estimateGas[method](...params);

        setEstimateErr("");
        setEstimateFeeLoading(false);

        return new BigNumber(estimateFee._hex).multipliedBy(gasPriceCal).toNumber();
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
    setTokenDepositLoading,
    estimateFeeLoading,
    estimateErr,
    depositError
  };
}

export default usePoolDepositAction;
