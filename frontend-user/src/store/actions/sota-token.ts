import { sotaTokenActions } from '../constants/sota-token';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getContractInstance } from '../../services/web3';
import erc20ABI from '../../abi/Erc20.json';
import { MAX_INT } from './../../services/web3';
import { Web3Provider } from '@ethersproject/providers'
import { getContract } from '../../utils/contract';

export const getAllowance = (owner: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTokenActions.ALLOWANCE_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(erc20ABI, process.env.REACT_APP_PKF as string);

      result = await contract?.methods.allowance(owner, process.env.REACT_APP_TIERS).call();

      dispatch({
        type: sotaTokenActions.ALLOWANCE_SUCCESS,
        payload: result,
      });
    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTokenActions.ALLOWANCE_FAILURE,
        payload: error
      });
    }
  }
};

export const approve = (address: string | null | undefined, library: Web3Provider) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTokenActions.APPROVE_LOADING });
    try {
      let result = {} as any;

      const contract = getContract(process.env.REACT_APP_PKF as string, erc20ABI, library, address || '');
      result = await contract?.approve(process.env.REACT_APP_TIERS, MAX_INT)
      await result.wait(1);
      if(result) {
        dispatch(getAllowance(address || ''));
      }

      dispatch({
        type: sotaTokenActions.APPROVE_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTokenActions.APPROVE_FAILURE,
        payload: error
      });
    }
  }
};
