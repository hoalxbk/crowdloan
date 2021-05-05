import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import useUserClaimSignature from '../hooks/useUserClaimSignature';
import useWalletSignature from '../../../hooks/useWalletSignature';
import PreSale_ABI from '../../../abi/PreSalePool.json';
import { getContract } from '../../../utils/contract';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';

const useTokenClaim = (poolAddress: string | undefined, poolId: number | undefined) => {
  const { library, account } = useWeb3React();
  const dispatch = useDispatch();

  const [claimTokenSuccess, setClaimTokenSuccess] = useState<boolean>(false);
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
  const [claimError, setClaimError] = useState<string>("");

  const { error, signMessage, signature: authSignature, setSignature } = useWalletSignature();
  const { signature, amount, error: claimSignError, setSignature: setUserClaimSignature } = useUserClaimSignature(account, poolId, authSignature);

  useEffect(() => {
    poolAddress && 
    signature &&
    amount &&
    !claimError &&
    claimTokenWithSignature(signature, amount);
  }, [signature, poolAddress, amount, claimError]);

  useEffect(() => {
    if (error || claimSignError) {
      const errorMessage = error || claimSignError;
      setClaimError(errorMessage as string);
      setClaimTokenLoading(false);
      setSignature("");
      setUserClaimSignature("");
    }
  }, [error, claimSignError]);

  const claimTokenWithSignature = useCallback(
    async (signature: string, amount: string) => {
    if (poolAddress && signature && amount && account) {
      try {
         const contract = getContract(poolAddress, PreSale_ABI, library, account as string);

         if (contract) {
           const transaction = await contract.claimTokens(account, amount, signature);

           setSignature("");
           setUserClaimSignature("");
           setClaimTransactionHash(transaction.hash);

           await transaction.wait(1);

           setClaimTokenSuccess(true);
           setClaimTokenLoading(false);
            dispatch(alertSuccess("Token Claim Successful"));
         }
      } catch (err) {
        dispatch(alertFailure(err.message));
        setClaimTokenLoading(false);
        setClaimError(err.message);
        setSignature("");
        setUserClaimSignature("");
      }
    }
  }, [poolAddress, library, account, amount, signature]);

  const claimToken = useCallback(async () => {
    if (poolAddress) {
      try {
        setClaimTransactionHash("");
        setClaimError("");
        setClaimTokenLoading(true);
        setClaimTokenSuccess(false);

        await signMessage();
      } catch (err) {
        dispatch(alertFailure(err.message));
        setClaimTokenLoading(false);
        setClaimError(err.message);
        setSignature("");
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
    error: claimError
  }
}

export default useTokenClaim;
