import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {withRouter, useParams, Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { alertFailure, alertSuccess } from '../../store/actions/alert';
import { BaseRequest } from '../../request/Request';
import useStyles from './style';
import {adminRoute, apiRoute, publicRoute} from "../../utils";

const MESSAGE_SIGNATURE = process.env.REACT_APP_MESSAGE_SIGNATURE || "";

const msgParams = [
  {
    type: 'string',      // Any valid solidity type
    name: 'Message',     // Any string label you want
    value: MESSAGE_SIGNATURE  // The value to sign
 },
];

const loginLogo = '/images/login-logo.png';

const ResetPassword: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const baseRequest = new BaseRequest();

  const { token } = useParams() as any;
  const { data: loginInvestor } = useSelector((state: any) => state.investor);
  const { data: loginUser } = useSelector((state: any) => state.user);
  const { data: ethAddress } = useSelector((state: any) => state.userConnect);
  const [isAvailableLoading, setIsAvailableLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const { register, watch, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const password = useRef({});
  password.current = watch("password", "");

  const renderErrorRequired = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required';
      }
    }
  }

  useEffect(() => {
    const dataLoginUser = _.cloneDeep(loginUser);
    if (!!dataLoginUser) {
      props.history.push(adminRoute('/'));
    }
  }, [loginUser]);

  useEffect(() => {
    const isAvailableToken = async () => {
      setIsAvailableLoading(true);

      const response = await baseRequest.get(apiRoute(`/check-token/${token}`)) as any;
      const resObj = await response.json();

      if (resObj?.status !== 200 || resObj?.data.status !== 200) {
        dispatch(alertFailure('Forgot password link has expired'));
        props.history.push(adminRoute('/login'));
        return;
      }
      setIsAvailableLoading(false);
      setIsAvailable(true);
    }

    if (!loginUser) {
      isAvailableToken();
    }
  }, [token]);

  const handleFormSubmit = async (data: any) =>  {
     try {
      setResetPasswordLoading(true);

      const windowObj = window as any;
      const { ethereum } = windowObj;

      await ethereum.sendAsync({
        method: 'eth_signTypedData',
        params: [msgParams, ethAddress],
        from: ethAddress,
      }, async function(err: Error, result: any) {
        if (err || result.error) {
          const errMsg = err.message || result.error.message
          dispatch(alertFailure(errMsg));
          setResetPasswordLoading(false);
          return;
        }

        const response = await baseRequest.post(apiRoute(`/reset-password/${token}`), {
          password: data.password,
          signature: result.result,
          wallet_address: ethAddress,
        }) as any;

        const resObj = await response.json();

        if (resObj?.status !== 200) {
          dispatch(alertFailure(resObj.message));
        } else {
          dispatch(alertSuccess('Reset password successful!'));
        }
        setResetPasswordLoading(false);

        const redirectUrl = adminRoute('/login');
        props.history.push(redirectUrl);
      })
    } catch (err) {
      dispatch(alertFailure(err.message));
      setResetPasswordLoading(false);
    }
  }

  const render = () => {
    if (isAvailableLoading) {
      return <div style={{ textAlign: 'center' }}><CircularProgress size={70} /></div>
    } else if (!isAvailableLoading && isAvailable) {
    return (
      <>
        <div className="forgot-ps__title">
          Reset Password
        </div>
        <p className="forgot-ps__banner">
          Enter your new password below to reset password
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="login__form">
          <TextField name="password" inputRef={register({
            required: true ,
            minLength: {
              value: 8,
              message: "Password must have at least 8 characters"
            }})} inputProps={{ maxLength: 255, type: 'password' }} label="Password *" color="secondary" className="login__form-field" />
          <p className="login__form-error-message">
          {
            errors.password && errors.password.type !== 'required' ? errors.password.message: renderErrorRequired(errors, 'password')
          }
          </p>
          <TextField name="passwordConfirmation" inputRef={register({
            required: true,
            validate: value => value === password.current || "The passwords do not match"
          })} inputProps={{ maxLength: 255, type: 'password' }} label="Password Confirmation *" color="secondary" className="login__form-field" />
          <p className="login__form-error-message">
          {
            errors.passwordConfirmation && errors.passwordConfirmation.type !== 'required' ? errors.passwordConfirmation.message: errors.confirmationPassword ? errors.confirmationPassword.message: renderErrorRequired(errors, 'passwordConfirmation')
          }
          </p>

          <br/>
          <Link className="login-button" to={adminRoute('/login')}>Sign in ?</Link>
          <br/>
          <Link className="login-button" to={adminRoute('/register')}>Sign up ?</Link>

          <button disabled={resetPasswordLoading} type="submit" className="login__form-button">
            Reset Password
            {
              resetPasswordLoading && <CircularProgress size={20} style={{ marginLeft: 10 }}/>
            }
          </button>
        </form>
      </>
      )
    }
  }

  return (
    <Container fixed>
      <div className={classes.forgotPassword}>
        <span className="forgot-ps__logo">
          <img src={loginLogo} alt="login-logo" />
          <h2 className="forgot-ps__brand">SotatekStarter</h2>
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

export default withRouter(ResetPassword);
