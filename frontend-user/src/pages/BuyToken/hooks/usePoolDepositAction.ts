import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import { alertSuccess } from '../../../store/actions/alert';
import Pool_ABI from '../../../abi/Pool.json';
import { getContract } from '../../../utils/contract';

type PoolDepositActionParams = {
  poolAddress?: string;
  poolId?: number;
}

const usePoolDepositAction = ({ poolAddress }: PoolDepositActionParams) => {
  const dispatch = useDispatch();

  const [tokenDepositTransaction, setTokenDepositTransaction] = useState<string>("");
  const [tokenDepositLoading, setTokenDepositLoading] = useState<boolean>(false);
  const [estimateErr, setEstimateErr] = useState("");
  const [estimateFeeLoading, setEstimateFeeLoading] = useState(false);

  // const { loading, data } = useFetch('/deposit')
  const { account: connectedAccount, library } = useWeb3React();

  const deposit = useCallback(async (amount: string) => {
    if (poolAddress) {
      try {
        setTokenDepositLoading(true);
        setTokenDepositTransaction("");

        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

        const signature = '0xe164E49ED19DDBC32ce7Dd9DE7E28DF3b721B037';

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
        throw new Error(err.message);
      }
    }
  }, [connectedAccount, library, poolAddress])

  const estimateFee = useCallback(async (amount: string) => {
    try {
      setEstimateFeeLoading(true);

      if (amount && poolAddress) {
        const FEE_PER_PRICE = new BigNumber(1).div(new BigNumber(10).pow(9));
        const poolContract = getContract(poolAddress, Pool_ABI, library, connectedAccount as string);

        const signature = '0xe164E49ED19DDBC32ce7Dd9DE7E28DF3b721B037';

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
    setTokenDepositLoading,
    estimateFeeLoading,
    estimateErr
  };
}

export default usePoolDepositAction;
