import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import Pool_ABI from '../../../abi/Pool.json';
import { getContract } from '../../../utils/contract';

type PoolDepositActionParams = {
  poolAddress?: string;
  poolId?: number;
  signature?: string;
  deadLine?: string;
  maxBuy?: string;
}

const USDT_ADDRESS = process.env.REACT_APP_USDT_SMART_CONTRACT;
const USDC_ADDRESS = process.env.REACT_APP_USDC_SMART_CONTRACT;

const usePoolDepositAction = ({ poolAddress, signature, deadLine, maxBuy }: PoolDepositActionParams) => {
  const dispatch = useDispatch();

  const [tokenDepositTransaction, setTokenDepositTransaction] = useState<string>("");
  const [tokenDepositLoading, setTokenDepositLoading] = useState<boolean>(false);
  const [estimateErr, setEstimateErr] = useState("");
  const [estimateFeeLoading, setEstimateFeeLoading] = useState(false);

  const { account: connectedAccount, library } = useWeb3React();

  const deposit = useCallback(async (amount: string, acceptCurrency: string) => {
    if (amount && new BigNumber(amount).gt(0) && poolAddress && signature && acceptCurrency && maxBuy) {
      try {
        setTokenDepositLoading(true);
        setTokenDepositTransaction("");

        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

        const method = acceptCurrency === 'ETH' ? 'buyTokenByEtherWithPermission': 'buyTokenByTokenWithPermission';

        const params = acceptCurrency === 'ETH' ? [ 
          connectedAccount,
          connectedAccount,
          maxBuy,
          deadLine,
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
          deadLine,
          signature
        ];

        const transaction = await poolContract[method](...params);

        setTokenDepositLoading(false);
        setTokenDepositTransaction(transaction.hash);

        await transaction.wait(1);

        dispatch(alertSuccess("Token Deposit Successful!"));
      } catch (err) {
        dispatch(alertFailure(err.message));
        setTokenDepositLoading(false);
        throw new Error(err.message);
      }
    }
  }, [connectedAccount, library, poolAddress, signature, deadLine, maxBuy])

  const estimateFee = useCallback(async (amount: string, acceptCurrency: string) => {
    try {
      setEstimateFeeLoading(true);

      if (amount && new BigNumber(amount).gt(0) && poolAddress && signature && acceptCurrency && maxBuy) {
        const gasPrice = await library.getGasPrice();
        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

        const params = acceptCurrency === 'ETH' ? [ 
          connectedAccount,
          connectedAccount,
          maxBuy,
          deadLine,
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
          0,
          signature
        ];

        const method = acceptCurrency === 'ETH' ? 'buyTokenByEtherWithPermission': 'buyTokenByTokenWithPermission';

        const estimateFee = await poolContract.estimateGas[method](...params, {
          gasPrice: new BigNumber(gasPrice._hex).div(new BigNumber(10).pow(18)).toFixed()
        });

        setEstimateErr("");
        setEstimateFeeLoading(false);

        return new BigNumber(estimateFee._hex).toNumber();
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
  }, [poolAddress, connectedAccount, signature, deadLine, maxBuy]);

  return {
    deposit,
    estimateFee,
    tokenDepositLoading,
    tokenDepositTransaction,
    setTokenDepositTransaction,
    setTokenDepositLoading,
    estimateFeeLoading,
    estimateErr
  };
}

export default usePoolDepositAction;
