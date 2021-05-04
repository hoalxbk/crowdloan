import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {withRouter, useParams, Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { alertFailure, alertSuccess } from '../../store/actions/alert';
import { BaseRequest } from '../../request/Request';
import useStyles from './style';
import {adminRoute, apiRoute, publicRoute} from "../../utils";

const MESSAGE_SIGNATURE = process.env.REACT_APP_MESSAGE_SIGNATURE || "";

const getMessageParams = (isInvestor: boolean = false) => {
  const msgSignature = MESSAGE_SIGNATURE;

  return [{
    type: 'string',      // Any valid solidity type
    name: 'Message',     // Any string label you want
    value: msgSignature  // The value to sign
  }]
};

const loginLogo = '/images/login-logo.png';

const ForgotPassword: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: loginUser } = useSelector((state: any) => state.user);
  const { data: ethAddress } = useSelector((state: any) => state.userConnect);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const renderErrorRequired = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required';
      }
    }
  }

  useEffect(() => {
    // If exist User, redirect to Home
    if (loginUser) {
      props.history.push('/');
    }
  }, [loginUser, props.history]);

  const handleFormSubmit = async (data: any) =>  {
    setResetPasswordLoading(true);

    const windowObj = window as any;
    const { ethereum } = windowObj;

     await ethereum.sendAsync({
          method: 'eth_signTypedData',
          params: [getMessageParams(false), ethAddress],
          from: ethAddress,
      }, async function(err: Error, result: any) {
        if (err || result.error) {
           const errMsg = err.message || result.error.message
           dispatch(alertFailure(errMsg));
           setResetPasswordLoading(false);
            return;
        }

        let url = apiRoute('/forgot-password');
        const baseRequest = new BaseRequest();
        const response = await baseRequest.post(url, {
          signature: result.result,
          email: data.email,
          wallet_address: ethAddress,
        }) as any;

        const resObj = await response.json();

       if (resObj?.status !== 200) {
         dispatch(alertFailure(resObj.message));
       } else {
         dispatch(alertSuccess('Request successful, please check your inbox.'));
       }

        setResetPasswordLoading(false);
      })
  }

  const render = () => {
    return (
      <>
        <div className="forgot-ps__title">
          Forgot Password
        </div>
        <p className="forgot-ps__banner">
          Enter your email address below to reset password
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="login__form">
          <TextField name="email" inputRef={register({ required: true })} inputProps={{ maxLength: 255 }} label="Email" color="secondary" className="login__form-field" />
          <p className="login__form-error-message">
          {
            renderErrorRequired(errors, 'email')
          }
          </p>
          <br/>
          <Link className="login-button" to={adminRoute('/login')}>Sign in ?</Link>
          <br/>
          <Link className="login-button" to={adminRoute('/register')}>Sign up ?</Link>
          <button disabled={resetPasswordLoading} type="submit" className="login__form-button">
            Submit
            {
              resetPasswordLoading && <CircularProgress size={20} style={{ marginLeft: 10 }}/>
            }
          </button>
        </form>
      </>
    )
  }

  return (
    <Container fixed>
      <div className={classes.forgotPassword}>
        <span className="forgot-ps__logo">
          <img src={loginLogo} alt="login-logo" />
          <h2 className="forgot-ps__brand">RedKite</h2>
        </span>
        <div className="forgot-ps__wrap">
          {
            render()
          }
        </div>
      </div>
    </Container>
  )
};

export default withRouter(ForgotPassword);
