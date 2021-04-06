import {alertFailure, alertSuccess} from '../../store/actions/alert';
import { userActions } from '../constants/user';
import { alertActions } from '../constants/alert';
import { BaseRequest } from '../../request/Request';
import { getWeb3Instance } from '../../services/web3';
import { AnyAction, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

type UserRegisterProps = {
  username: string;
  email: string;
  password: string;
}

type UserProfileProps = {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  avatar: string;
}

const MESSAGE_INVESTOR_SIGNATURE = process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE || "";

const getMessageParams = () => {
  const msgSignature = MESSAGE_INVESTOR_SIGNATURE;

  return [{
    type: 'string',      // Any valid solidity type
    name: 'Message',     // Any string label you want
    value: msgSignature  // The value to sign
  }]
}

const dispatchErrorWithMsg = (dispatch: Dispatch, action: string, msg: string) => {
  dispatch({
    type: action,
    payload: msg
  })
}

const getCurrentAccount = async () => {
  const web3Instance = getWeb3Instance();
  const accounts = await web3Instance?.eth.getAccounts();

  if (accounts && accounts.length !== 0) {
    return accounts[0];
  }

  return undefined;
}

export const logout = (isInvestor: boolean = false) => {
  isInvestor ? localStorage.removeItem("investor_access_token"): localStorage.removeItem("access_token");

  return {
    type: !isInvestor ? userActions.USER_LOGOUT: userActions.INVESTOR_LOGOUT
  }
}

export const resetUserState = (isInvestor: boolean = false) => {
  return {
    type: !isInvestor ? userActions.USER_PURGE: userActions.INVESTOR_PURGE
  }
}

export const clearUserProfileUpdate = () => {
  return {
    type: userActions.USER_PROFILE_UPDATE_CLEAR_ERROR
  }
}

export const login = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: userActions.INVESTOR_LOGIN_LOADING
      });

      const baseRequest = new BaseRequest();
      const ethAddress = await getCurrentAccount();

      if (ethAddress) {
        const windowObj = window as any;
        const { ethereum } = windowObj;
       await ethereum.sendAsync({
            method: 'eth_signTypedData',
            params: [getMessageParams(), ethAddress],
            from: ethAddress,
        }, async function(err: Error, result: any) {
          if (err || result.error) {
             const errMsg = err.message || result.error.message
              dispatchErrorWithMsg(dispatch, userActions.INVESTOR_LOGIN_FAILURE, errMsg);
          } else {
            const response = await baseRequest.post(`/user/login`, {
              signature: result.result,
              // message: baseRequest.getSignatureMessage(isInvestor),
              wallet_address: ethAddress,
            }) as any;

            const resObj = await response.json();

            if (resObj.status && resObj.status === 200 && resObj.data) {
              const { token, user } = resObj.data;

              localStorage.setItem('investor_access_token', token.token);

              dispatch({
                type: userActions.INVESTOR_LOGIN_SUCCESS,
                payload: user
              });
            }

            if (resObj.status && resObj.status !== 200) {
              if (resObj.status == 404) {
                // redirect to register page
                dispatch(alertFailure(resObj.message));
                dispatchErrorWithMsg(dispatch, userActions.INVESTOR_LOGIN_FAILURE, '');
              } else {
                // show error
                console.log('RESPONSE Login: ', resObj);
                dispatch(alertFailure(resObj.message));
                dispatchErrorWithMsg(dispatch, userActions.INVESTOR_LOGIN_FAILURE, '');
              }
            }
          }
        });
      }
    } catch (error) {
      console.log('ERROR Login: ', error);
      dispatch(alertFailure(error.message));
      dispatchErrorWithMsg(dispatch, userActions.INVESTOR_LOGIN_FAILURE, '');
    }
  }
}

export const register = ({ username, email, password }: UserRegisterProps) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: userActions.INVESTOR_REGISTER_LOADING
    });
    try {
      const baseRequest = new BaseRequest();
      const windowObj = window as any;
      const { ethereum } = windowObj;
      const ethAddress = await getCurrentAccount();

      if (ethAddress) {

       await ethereum.sendAsync({
            method: 'eth_signTypedData',
            params: [getMessageParams(), ethAddress],
            from: ethAddress,
        }, async function(err: Error, result: any) {
          if (err || result.error) {
             const errMsg = err.message || result.error.message
              dispatchErrorWithMsg(dispatch, userActions.INVESTOR_REGISTER_FAILURE, errMsg);

            return;
          }

          const response = await baseRequest.post(`/user/register/`, {
            username,
            email,
            password,
            wallet_address: ethAddress,
            signature: result.result,
            // message: baseRequest.getSignatureMessage(isInvestor),
          }) as any;

          const resObj = await response.json();

          if (resObj.status && resObj.status === 200) {

            if (resObj.data) {
              const { token, user } = resObj.data;

              localStorage.setItem('investor_access_token', token.token);

              dispatch({
                type: alertActions.SUCCESS_MESSAGE,
                payload: 'Register Account Successful'
              });

              dispatch({
                type: userActions.INVESTOR_REGISTER_SUCCESS,
                payload: user
              });

              dispatch({
                type: userActions.INVESTOR_LOGIN_SUCCESS,
                payload: user
              });
            } else {
              dispatch({
                type: alertActions.SUCCESS_MESSAGE,
                payload: resObj.message
              });

              dispatch({
                type: userActions.INVESTOR_REGISTER_SUCCESS,
                payload: resObj.message
              });
            }

          }

          if (resObj.status && resObj.status !== 200) {
            console.log('RESPONSE Register: ', resObj);
            dispatch(alertFailure(resObj.message));
            dispatchErrorWithMsg(dispatch, userActions.INVESTOR_REGISTER_FAILURE, '');
          }
        });
      }
    } catch (error) {
      console.log('ERROR Register: ', error);
      dispatch(alertFailure(error.message));
      dispatchErrorWithMsg(dispatch, userActions.INVESTOR_REGISTER_FAILURE, '');
    }
  }
};

export const connectWallet = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: userActions.USER_CONNECT_WALLET_LOADING });
    try {
      const windowObj = window as any;
      const { ethereum } = windowObj;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const loginUser = accounts.length ? accounts[0] : '';

      if (loginUser) {
        dispatch({
          type: userActions.USER_CONNECT_WALLET_SUCCESS,
          payload: loginUser
        });
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch({
        type: userActions.USER_CONNECT_WALLET_FAILURE,
        payload: error
      });
    }
  }
}

export const getUserDetail = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: userActions.USER_PROFILE_LOADING });
    try {
      const baseRequest = new BaseRequest();

      const response = await baseRequest.get('/user/profile') as any;
      const resObj = await response.json();

      if (resObj.status && resObj.status === 200) {
        dispatch({
          type: userActions.USER_PROFILE_SUCCESS,
          payload: resObj.data.user
        })
      } else {
        dispatch({
          type: userActions.USER_PROFILE_FAILURE,
          payload: resObj.message
        })
      }
    } catch (error) {
      dispatch({
        type: userActions.USER_PROFILE_FAILURE,
        payload: error
      });
    }
  }
}

export const updateUserProfile = (updatedUser: UserProfileProps) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: userActions.USER_PROFILE_UPDATE_LOADING
      });

      const baseRequest = new BaseRequest();
      const ethAddress = await getCurrentAccount();

      if (ethAddress) {
        const windowObj = window as any;
        const { ethereum } = windowObj;
        const { firstName, lastName, avatar } = updatedUser;
       await ethereum.sendAsync({
            method: 'eth_signTypedData',
            params: [getMessageParams(), ethAddress],
            from: ethAddress,
        }, async function(err: Error, result: any) {
          if (err || result.error) {
             const errMsg = err.message || result.error.message
              dispatchErrorWithMsg(dispatch, userActions.USER_PROFILE_UPDATE_FAILURE, errMsg);
          } else {
            const response = await baseRequest.post(`/user/update-profile`, {
              firstname: firstName,
              lastname: lastName,
              avatar,
              signature: result.result
            }) as any;

            const resObj = await response.json();

            if (resObj.status && resObj.status === 200 && resObj.data) {
              const { user } = resObj.data;

              dispatch(alertSuccess('Update profile successful!'));

              dispatch({
                type: userActions.USER_LOGIN_SUCCESS,
                payload: user
              });

              dispatch({
                type: userActions.USER_PROFILE_UPDATE_SUCCESS,
                payload: user
              });
            }

            if (resObj.status && resObj.status !== 200) {
              dispatchErrorWithMsg(dispatch, userActions.USER_PROFILE_UPDATE_FAILURE, resObj.message);
            }
          }
        });
      }
    } catch (error) {
      dispatchErrorWithMsg(dispatch, userActions.USER_PROFILE_UPDATE_FAILURE, error.message);
    }
  }
}
