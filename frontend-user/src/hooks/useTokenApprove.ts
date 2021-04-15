import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { alertSuccess, alertFailure } from '../store/actions/alert';
import { getContract } from '../utils/contract';
import { TokenType } from '../hooks/useTokenDetails';

import ERC20_ABI from '../abi/Erc20.json';

const APPROVE_AMOUNT = '999999999999999999999';

const useTokenAllowance = (
  token: TokenType | undefined, 
  owner: string | null | undefined, 
  spender: string | null | undefined
) => {
  const [tokenApproveLoading, setTokenApproveLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

    const approveToken = useCallback(async () => {
      setTransactionHash("");

      try {
        if (token && spender && owner   
            && ethers.utils.isAddress(owner) 
            && ethers.utils.isAddress(spender) 
            && ethers.utils.isAddress(token.address)
           ) {
             setTokenApproveLoading(true);

             const contract = getContract(token.address, ERC20_ABI, library, account as string);

             if (contract) {
               const transaction = await contract.approve(spender, APPROVE_AMOUNT);
               console.log('Approve Token', transaction);

              setTransactionHash(transaction.hash);
               setTokenApproveLoading(false);

               await transaction.wait(1);
                dispatch(alertSuccess("Token Approve Successful!"));
             }
           }
      } catch (err) {
        dispatch(alertFailure(err.message));
        setTokenApproveLoading(false);
        throw new Error(err.message);
      }
  }, [owner, spender, token]);

  return {
    tokenApproveLoading,
    approveToken,
    setTokenApproveLoading,
    transactionHash
  }
}

export default useTokenAllowance;
