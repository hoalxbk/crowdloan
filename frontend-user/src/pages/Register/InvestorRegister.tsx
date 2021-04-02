import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CircularProgress, TextField} from '@material-ui/core';
import {Link, withRouter} from 'react-router-dom';
import {useForm} from 'react-hook-form';

import {alertFailure} from '../../store/actions/alert';
import {connectWallet, register as registerAccount, resetUserState} from '../../store/actions/user';
import Button from '../../components/Base/Button';
import {userAlreadyExists} from '../../utils/user';
import {publicRoute} from "../../utils";
import InvestorLayout from "../InvestorLayout/InvestorLayout";
import TextTitle from "../InvestorLayout/TextTitle";
import ConnectYourWallet from "../InvestorLayout/ConnectYourWallet";

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const InvestorRegister: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();

  const [loadingUserExists, setLoadingUserExists] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [currentPage, setCurrentPage] = useState('walletConnect');
  const { data: ethAddress = '', loading = false } = useSelector((state: any) => state.userConnect);
  const { loading: userRegisterLoading = false, error: errorRegister } = useSelector((state: any) => state.userRegister);
  const { data: loginInvestor, loading: investorLoginLoading, error } = useSelector((state: any) => state.investor);

  const { register, watch, getValues, setValue, errors, handleSubmit } = useForm({
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
    if (error || errorRegister) {
      dispatch(alertFailure(error || errorRegister));
    }
  }, [error, errorRegister]);

  useEffect(() => {
    if (ethAddress) {
      setCurrentPage('signIn');
    } else {
      setCurrentPage('walletConnect');
    }
  }, [ethAddress]);

  useEffect(() => {
    const checkUserExists = async () => {
      if (currentPage === 'signIn') {
        setLoadingUserExists(true);

        const userExists = await userAlreadyExists(ethAddress);
        setLoadingUserExists(false);

        setUserExists(userExists);
      } else setUserExists(false);
    }

    ethAddress && checkUserExists();
  }, [currentPage, ethAddress, loginInvestor]);

  useEffect(() => {
    if (loginInvestor) {
      props.history.push(publicRoute('/'));
    }

    return () => {
      error && dispatch(resetUserState());
    }
  }, [loginInvestor, error]);

  const handleFormSubmit = (data: any) =>  {
    const isInvestor = true;
    dispatch(registerAccount(data, isInvestor));
  }

  const render = () => {
    if (currentPage === 'walletConnect') {
      return (
        <ConnectYourWallet>
          <Button
            label={'Connect Wallet'}
            buttonType="primary"
            loading={loading}
            disabled={loading}
            onClick={handleUserLogin}
          />
        </ConnectYourWallet>
      )
    } else {
      if (loadingUserExists) {
        return (
          <div className="login__user-loading">
            <CircularProgress size={75} thickness={4} value={100} />
            <p className="login__user-loading-text">Loading Ethereum Wallet</p>
          </div>
        );
      } else {
        return (
          <>
            <div className="login__logo-ether-title">
              <TextTitle>
                Create An Account
              </TextTitle>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="login__form">
              <TextField id="standard-secondary" value={ethAddress} label="Current Ethereum Address" color="secondary" className="login__form-field" disabled />

              <>
                <TextField
                  name="username"
                  inputProps={{ minLength: 6, maxLength: 30 }}
                  inputRef={register({
                    required: true ,
                    minLength: {
                      value: 6,
                      message: "Username must have at least 6 characters"
                    },
                  })}
                  onKeyPress={(e: any) => {
                    const VALID_CHAR_REGEX = /[a-zA-Z0-9]/;

                    if (!VALID_CHAR_REGEX.test(e.key)) { return false };
                  }}
                  onBlur={(_: any) => {
                    let value = getValues('username');

                    value = value.replace(/\s/g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');;
                    setValue('username', value);
                  }}
                  label="Username *"
                  color="secondary"
                  className="login__form-field"
                />
                <p className="login__form-error-message">
                  {
                    errors.username && errors.username.type !== 'required' ? errors.username.message: renderErrorRequired(errors, 'username')
                  }
                </p>

                <TextField
                  label="Email *"
                  name="email"
                  inputProps={{ maxLength: 100 }}
                  inputRef={register({
                    required: true,
                    validate: {
                      isValidEmail: value => {
                        if (!EMAIL_REGEX.test(value)) {
                          return 'Invalid email address';
                        }

                        return true;
                      }
                    }
                  })}
                  color="secondary"
                  className="login__form-field"
                />
                <p className="login__form-error-message">
                  {
                    errors.email && errors.email.type !== 'required' ? errors.email.message: renderErrorRequired(errors, 'email')
                  }
                </p>

                <TextField
                  label="Password *"
                  name="password"
                  inputProps={{ maxLength: 255, type: 'password' }}
                  inputRef={register({
                    required: true,
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters"
                    }})}
                  color="secondary" className="login__form-field"
                />
                <p className="login__form-error-message">
                  {
                    errors.password && errors.password.type !== 'required' ? errors.password.message: renderErrorRequired(errors, 'password')
                  }
                </p>

                <TextField
                  label="Password Confirmation *"
                  name="passwordConfirmation"
                  inputProps={{ maxLength: 255, type: 'password' }}
                  inputRef={register({
                    required: true,
                    validate: value => value === password.current || "The passwords do not match"
                  })}
                  color="secondary"
                  className="login__form-field"
                />

                <p className="login__form-error-message">
                  {
                    errors.passwordConfirmation && errors.passwordConfirmation.type !== 'required' ? errors.passwordConfirmation.message: errors.confirmationPassword ? errors.confirmationPassword.message: renderErrorRequired(errors, 'passwordConfirmation')
                  }
                </p>
              </>

              <Link className="login__form-desc login__form-forgot-password" to="/forgot-password/investor">Forgot your password ?</Link>
              <Link className="login__form-desc login__form-forgot-password" to={publicRoute('/login')}>Sign in ?</Link>
              <br/>

              <Button
                label={'Sign up'}
                buttonType="primary"
                className={'login__form-cta'}
                loading={userRegisterLoading || investorLoginLoading}
                disabled={userRegisterLoading || investorLoginLoading}
              />

            </form>
          </>
        )
      }
    }
  }

  const handleUserLogin = () => {
    dispatch(connectWallet());
  };

  return (
    <InvestorLayout>
      {render()}
    </InvestorLayout>
  )
};

export default withRouter(InvestorRegister);
