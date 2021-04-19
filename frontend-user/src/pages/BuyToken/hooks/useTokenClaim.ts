import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import ERC20_ABI from '../../../abi/Pool.json';
import { getContract } from '../../../utils/contract';
import { TokenType } from '../../../hooks/useTokenDetails';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';

const useTokenClaim = (token: TokenType | undefined) => {
  const { library, account } = useWeb3React();
  const dispatch = useDispatch();

  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const claimToken = useCallback(async () => {
    if (token) {
      setError("");
      setClaimTokenLoading(true);

      try {
         const contract = getContract(token.address, ERC20_ABI, library, account as string);

         if (contract) {
           const transaction = await contract.claimTokens();

           setClaimTransactionHash(transaction.hash);
           setClaimTokenLoading(false);

           await transaction.wait(1);

            dispatch(alertSuccess("Token Claim Successful"));
         }
      } catch (err) {
        dispatch(alertFailure(err.message));
        setError(err.message);
      }
    }
  }, [token, library, account]);

  return {
    claimToken,
    transactionHash: claimTransactionHash,
    loading: claimTokenLoading,
    setClaimTokenLoading,
    setClaimTransactionHash,
    error
  }
}

export default useTokenClaim;
