import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CircularProgress, TextField} from '@material-ui/core';
import {Link, withRouter} from 'react-router-dom';
import {useForm} from 'react-hook-form';

import {alertFailure} from '../../store/actions/alert';
import {connectWallet, login, resetUserState} from '../../store/actions/user';
import useStyles from './style';
import Button from '../../components/Base/Button';
import {userAlreadyExists} from '../../utils/user';
import {publicRoute} from "../../utils";
import InvestorLayout from "../InvestorLayout/InvestorLayout";
import TextTitle from "../InvestorLayout/TextTitle";
import ConnectYourWallet from "../InvestorLayout/ConnectYourWallet";
import useCommonStyle from '../../styles/CommonStyle'
import Logo from '../InvestorLayout/Logo'
import { settingCurrentConnector } from '../../store/actions/appNetwork'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const InvestorLogin: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const common = useCommonStyle();
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

        const userExists = await userAlreadyExists(ethAddress, true);
        setLoadingUserExists(false);

        setUserExists(userExists);
      // } else {
      //   setUserExists(false);
      }
    }

    ethAddress && checkUserExists();
  }, [currentPage, ethAddress, loginInvestor]);

  useEffect(() => {
    if (loginInvestor) {
      dispatch(settingCurrentConnector('Metamask'))
      props.history.push(publicRoute('/'));
    }

    return () => {
      error && dispatch(resetUserState());
    }
  }, [loginInvestor, error]);

  const handleFormSubmit = (data: any) =>  {
    dispatch(login());

    // if (!userExists) {
    //   dispatch(registerAccount(data));
    // } else {
    //   const { passwordLogin } = data;
    //   dispatch(login(passwordLogin));
    // }
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
            <Logo/>
            <TextTitle>
              Wallet Connected
            </TextTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)} className={classes.loginForm}>
              <TextField id="standard-secondary" value={ethAddress} label="Current Ethereum Address" color="secondary" className="login__form-field" disabled />
              <p className={"login__form-desc login__form-privacy " + common.nnn1424h}>
                By clicking sign in you indicate that you have read and agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>
              </p>

              <Button
                label={'Sign in'}
                buttonType="primary"
                className={'login__form-cta'}
                loading={investorLoginLoading}
                disabled={investorLoginLoading}
              />
              <div className="signup">
                <span>Don't have an account?&nbsp;</span>
                <Link className="login__form-desc login__form-forgot-password" to={publicRoute('/register')}>Sign Up</Link>
              </div>
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

export default withRouter(InvestorLogin);
