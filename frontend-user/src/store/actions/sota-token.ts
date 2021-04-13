import { sotaTokenActions } from '../constants/sota-token';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getContractInstance, convertToWei } from '../../services/web3';
import erc20ABI from '../../abi/Erc20.json';
import { convertFromWei } from './../../services/web3'
import BigNumber from 'bignumber.js'

export const getAllowance = (owner: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTokenActions.ALLOWANCE_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(erc20ABI, process.env.REACT_APP_SOTA as string);

      result = await contract?.methods.allowance(owner, process.env.REACT_APP_SOTATIER).call();
      console.log('getAllowance', result)

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

export const approve = (address: string, amount: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTokenActions.APPROVE_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(erc20ABI, process.env.REACT_APP_SOTA as string);

      result = await contract?.methods.approve(process.env.REACT_APP_SOTATIER, convertToWei(amount)).send({from: address})
      console.log('approve', result)

      // dispatch(getAllowance(address));

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
