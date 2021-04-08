import { balanceActions } from '../constants/balance';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { convertFromWei, getContractInstance, getWeb3Instance } from '../../services/web3';
import erc20ABI from '../../abi/Erc20.json';
import BigNumber from "bignumber.js";

export const getBalance = (loginUser: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: balanceActions.BALANCE_LOADING });
    try {
      const web3Instance = getWeb3Instance();
      let result = {};
      if (web3Instance) {
        const ethBalance = await web3Instance.eth.getBalance(loginUser);
        result = {
          ...result,
          eth: convertFromWei(ethBalance),
        }
      }

      const sotaContract = getContractInstance(erc20ABI, process.env.REACT_APP_SOTA as string);
      if (sotaContract) {
        const sotaDecimals = await sotaContract.methods.decimals().call();
        const sotaBalance = await sotaContract.methods.balanceOf(loginUser).call();
        const sotaBalanceConvert = (new BigNumber(sotaBalance)).div(new BigNumber(`1e+${sotaDecimals}`)).toString();
        result = {
          ...result,
          sota: sotaBalanceConvert,
        };
      }

      dispatch({
        type: balanceActions.BALANCE_SUCCESS,
        payload: result,
      });

    } catch (error) {
      dispatch({
        type: balanceActions.BALANCE_FAILURE,
        payload: error
      });
    }
  }
};