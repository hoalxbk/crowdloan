import { sotaTiersActions } from '../constants/sota-tiers';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getContractInstance, convertFromWei, convertToWei, SmartContractMethod } from '../../services/web3';
import { getContract } from '../../utils/contract';
import RedKite from '../../abi/RedKiteTiers.json';
import { getBalance } from './balance';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

import {approve, getAllowance} from './sota-token';

export const resetTiers = () => {
  return {
    type: sotaTiersActions.USER_TIER_RESET
  }
}

export const getTiers = (forceUsingEther?: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.TIERS_LOADING });
    try {
      const { appChainID } = getState().appNetwork.data;
      const connector  = getState().connector.data;

      const contract = getContractInstance(
        RedKite.abi,
        process.env.REACT_APP_TIERS as string,
        connector, 
        appChainID,
        SmartContractMethod.Read,
        forceUsingEther === 'eth'
      );

      let result = await contract?.methods.getTiers().call();

      result = result.filter((e: any) => e != '0')
      result = result.map((e: any) => {
        return parseFloat(convertFromWei(e))
      })

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

export const getUserTier = (address: string, forceUsingEther?: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.USER_TIER_LOADING });
    try {
      const { appChainID } = getState().appNetwork.data;
      const connector = getState().connector.data;
      let result = {};

      const contract = getContractInstance(
        RedKite.abi, 
        process.env.REACT_APP_TIERS as string, 
        connector, 
        appChainID,
        SmartContractMethod.Read,
        forceUsingEther === 'eth'
      );

      result = await contract?.methods.getUserTier(address).call();

      dispatch({
        type: sotaTiersActions.USER_TIER_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.USER_TIER_FAILURE,
        payload: error
      });
    }
  }
};

export const getUserInfo = (address: string, forceUsingEther?: string, tokenAddress: string = '') => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.USER_INFO_LOADING });
    try {
      const { appChainID } = getState().appNetwork.data;
      const { connector } = getState().connector.data;
      const contract = getContractInstance(
        RedKite.abi,
        process.env.REACT_APP_TIERS as string,
        connector,
        appChainID,
        SmartContractMethod.Read,
        forceUsingEther === 'eth'
      );

      let result = {};

      const resultPkf = await contract?.methods.userInfo(address, process.env.REACT_APP_PKF).call();
      const stakedPkf = convertFromWei(resultPkf.staked)

      const resultUni = await contract?.methods.userInfo(address, process.env.REACT_APP_UNI_LP).call();
      const stakedUni = convertFromWei(resultUni.staked)

      const resultMantra = await contract?.methods.userInfo(address, process.env.REACT_APP_MANTRA_LP).call();
      const stakedMantra = convertFromWei(resultMantra.staked)

      const resultStaked = await contract?.methods.userExternalStaked(address).call();
      const totalStaked = parseFloat(stakedPkf) + parseFloat(convertFromWei(resultStaked))
      console.log(totalStaked, "toe")

      result = {
        ...result,
        resultPkf: resultPkf,
        pkfStaked: stakedPkf,
        resultUni: resultUni,
        uniStaked: stakedUni,
        resultMantra: resultMantra,
        mantraStaked: stakedMantra,
        totalStaked: totalStaked
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

export const deposit = (address: string | null | undefined, amount: string, library: Web3Provider, tokenAddress: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.DEPOSIT_LOADING });
    try {
      let result = {} as any;

      const contract = getContract(process.env.REACT_APP_TIERS as string, RedKite.abi, library, address || '');
      result = await contract?.depositERC20(tokenAddress, convertToWei(amount))
      await result.wait(1);
      if(result) {
        dispatch(getBalance(address || ''));
        dispatch(getAllowance(address || ''));
        dispatch(getUserTier(address || ''));
        dispatch(getUserInfo(address || ''));
      }

      dispatch({
        type: sotaTiersActions.DEPOSIT_SUCCESS,
        payload: result,
      });
    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.DEPOSIT_FAILURE,
        payload: error
      });
    }
  }
};

export const withdraw = (address: string | null | undefined, amount: string, library: Web3Provider, tokenAddress: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.WITHDRAW_LOADING });
    try {
      let result = {} as any;

      const contract = getContract(process.env.REACT_APP_TIERS as string, RedKite.abi, library, address || '');

      result = await contract?.withdrawERC20(tokenAddress, convertToWei(amount));
      await result.wait(1);
      if(result) {
        dispatch(getBalance(address || ''));
        dispatch(getAllowance(address || ''));
        dispatch(getUserTier(address || ''));
        dispatch(getUserInfo(address || ''));
      }

      dispatch({
        type: sotaTiersActions.WITHDRAW_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.WITHDRAW_FAILURE,
        payload: error
      });
    }
  }
};

export const getWithdrawFee = (address: string | null | undefined, amount: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.WITHDRAW_FEE_LOADING });
    try {
      const { appChainID } = getState().appNetwork.data;
      const connector = getState().connector.data;
      let data = {};
      const contract = getContractInstance(RedKite.abi, process.env.REACT_APP_TIERS as string, connector, appChainID);

      data = await contract?.methods.calculateWithdrawFee(address, process.env.REACT_APP_PKF, convertToWei(amount)).call();
      
      const fee = convertFromWei(data);
      const feePercent = parseFloat(fee || '0')*100/parseFloat(amount || '0')

      const result = {
        fee: fee,
        feePercent: feePercent
      }

      dispatch({
        type: sotaTiersActions.WITHDRAW_FEE_SUCCESS,
        payload: result,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: sotaTiersActions.WITHDRAW_FEE_FAILURE,
        payload: error
      });
    }
  }
};


export const getWithdrawPercent = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.WITHDRAW_PERCENT_LOADING });
    try {
      const { appChainID } = getState().appNetwork.data;
      const { connector } = getState().connector.data || "Metamask";
      let result = {};
      let data = [];
      const contract = getContractInstance(RedKite.abi, process.env.REACT_APP_TIERS as string, connector, appChainID);
 
     result = await contract?.methods.withdrawFeePercent(0).call();
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


