import { sotaTiersActions } from '../constants/sota-tiers';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getContractInstance, convertFromWei, convertToWei } from '../../services/web3';
import sotaTiersABI from '../../abi/SotaTiers.json';
import { getBalance } from './balance';

import {approve, getAllowance} from './sota-token';

export const getTiers = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.TIERS_LOADING });
    try {
      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      let result = await contract?.methods.getTiers().call();

      result = result.filter((e: any) => e != '0')
      result = result.map((e: any) => {
        return parseFloat(convertFromWei(e))
      })

      console.log('getTiers', result)

      dispatch({
        type: sotaTiersActions.TIERS_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.TIERS_FAILURE,
        payload: error
      });
    }
  }
};

export const getUserTier = (address: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.USER_TIER_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      result = await contract?.methods.getUserTier(address).call();
      console.log('getUserTier', result)

      dispatch({
        type: sotaTiersActions.USER_TIER_SUCCESS,
        payload: result,
      });

    } catch (error) {
      dispatch({
        type: sotaTiersActions.USER_TIER_FAILURE,
        payload: error
      });
    }
  }
};

export const getUserInfo = (address: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.USER_INFO_LOADING });
    try {
      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      let result = await contract?.methods.userInfo(address).call();
      const staked = convertFromWei(result.staked)
      result = {
        ...result,
        staked: staked
      }

      dispatch({
        type: sotaTiersActions.USER_INFO_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.USER_INFO_FAILURE,
        payload: error
      });
    }
  }
};

export const deposit = (address: string, amount: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.DEPOSIT_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      result = await contract?.methods.deposit(convertToWei(amount)).send({from: address})

      dispatch(getBalance(address));
      dispatch(getAllowance(address));
      dispatch(getUserTier(address));
      dispatch(getUserInfo(address));

      dispatch({
        type: sotaTiersActions.DEPOSIT_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: sotaTiersActions.DEPOSIT_FAILURE,
        payload: error
      });
    }
  }
};

export const withdraw = (address: string, amount: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.WITHDRAW_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      result = await contract?.methods.withdraw(convertToWei(amount)).send({from: address})

      dispatch(getBalance(address));
      dispatch(getAllowance(address));
      dispatch(getUserTier(address));
      dispatch(getUserInfo(address));

      dispatch({
        type: sotaTiersActions.WITHDRAW_SUCCESS,
        payload: result,
      });

    } catch (error) {
      dispatch({
        type: sotaTiersActions.WITHDRAW_FAILURE,
        payload: error
      });
    }
  }
};

export const getWithdrawFee = (address: string, amount: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.WITHDRAW_FEE_LOADING });
    try {
      let result = {};

      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      result = await contract?.methods.calculateWithdrawFee(address, convertToWei(amount)).call();
      

      dispatch({
        type: sotaTiersActions.WITHDRAW_FEE_SUCCESS,
        payload: convertFromWei(result),
      });

    } catch (error) {
      dispatch({
        type: sotaTiersActions.WITHDRAW_FEE_FAILURE,
        payload: error
      });
    }
  }
};


export const getWithdrawPercent = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: sotaTiersActions.WITHDRAW_PERCENT_LOADING });
    try {
      let result = {};
      let data = [];

      const contract = getContractInstance(sotaTiersABI.abi, process.env.REACT_APP_SOTATIER as string);

      result = await contract?.methods.withdrawFeePercent(0).call();
      console.log(result)
      data.push(result)
      result = await contract?.methods.withdrawFeePercent(1).call();
      data.push(result)
      result = await contract?.methods.withdrawFeePercent(2).call();
      data.push(result)
      result = await contract?.methods.withdrawFeePercent(3).call();
      data.push(result)
      result = await contract?.methods.withdrawFeePercent(4).call();
      data.push(result)
      result = await contract?.methods.withdrawFeePercent(5).call();
      data.push(result)

      result = {
        ...result,
        penaltiesPercent: data
      }

      dispatch({
        type: sotaTiersActions.WITHDRAW_PERCENT_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.WITHDRAW_PERCENT_FAILURE,
        payload: error
      });
    }
  }
};


