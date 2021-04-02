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

      const contract = getContractInstance(erc20ABI, process.env.REACT_APP_SMART_CONTRACT_USDT_ADDRESS as string);
      if (contract) {
        const usdtDecimals = await contract.methods.decimals().call();
        const usdtBalance = await contract.methods.balanceOf(loginUser).call();
        const usdtBalanceConvert = (new BigNumber(usdtBalance)).div(new BigNumber(`1e+${usdtDecimals}`)).toString();
        result = {
          ...result,
          usdt: usdtBalanceConvert,
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