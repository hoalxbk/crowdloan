import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import PreSale_ABI from '../../../abi/PreSalePool.json';
import { getContract } from '../../../utils/contract';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';

const useTokenClaim = (poolAddress: string | undefined) => {
  const { library, account } = useWeb3React();
  const dispatch = useDispatch();

  const [claimTokenSuccess, setClaimTokenSuccess] = useState<boolean>(false);
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const claimToken = useCallback(async () => {
    if (poolAddress) {
      setError("");
      setClaimTokenLoading(true);
      setClaimTokenSuccess(false);

      try {
         const contract = getContract(poolAddress, PreSale_ABI, library, account as string);

         if (contract) {
           const transaction = await contract.claimTokens();

           setClaimTransactionHash(transaction.hash);

           await transaction.wait(1);

           setClaimTokenSuccess(true);
           setClaimTokenLoading(false);
            dispatch(alertSuccess("Token Claim Successful"));
         }
      } catch (err) {
        dispatch(alertFailure(err.message));
        setClaimTokenLoading(false);
        setClaimTokenSuccess(false);
        setError(err.message);
      }
    }
  }, [poolAddress, library, account]);

  return {
    claimToken,
    transactionHash: claimTransactionHash,
    loading: claimTokenLoading,
    setClaimTokenLoading,
    setClaimTransactionHash,
    claimTokenSuccess,
    error
  }
}

export default useTokenClaim;
