import React, {useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import {useDispatch} from 'react-redux';
import {TextField} from '@material-ui/core';
import {Link, withRouter} from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { useTypedSelector } from '../../hooks/useTypedSelector';
import { disconnectWalletLayer2 } from '../../store/actions/wallet';
import { login } from '../../store/actions/user';
import useStyles from './style';
import Button from '../../components/Base/Button';
import {userAlreadyExists} from '../../utils/user';
import {publicRoute} from "../../utils";
import InvestorLayout from "../InvestorLayout/InvestorLayout";
import TextTitle from "../InvestorLayout/TextTitle";
import useCommonStyle from '../../styles/CommonStyle'
import Logo from '../InvestorLayout/Logo'

const InvestorLogin: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const common = useCommonStyle();
  const dispatch = useDispatch();
  const history = useHistory();

  const [loadingUserExists, setLoadingUserExists] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const { loading: investorLoginLoading, data: investor } = useTypedSelector(state => state.investor);
  const { account:  connectedAccount, library } = useWeb3React();

  useEffect(() => {
    const checkUserExists = async () => {
      if (connectedAccount) {
        setLoadingUserExists(true);

        const userExists = await userAlreadyExists(connectedAccount, true);
        setLoadingUserExists(false);

        setUserExists(userExists);
      }     
    } 

    connectedAccount && checkUserExists(); 

    return () => { 
      !localStorage.getItem("investor_access_token") && dispatch(disconnectWalletLayer2()); 
    }
  }, [connectedAccount, investor]);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    connectedAccount && library && dispatch(login(connectedAccount, library, history));
  }

  const render = () => {
    if (loadingUserExists) {
      return (
        <div className="login__user-loading" style={{ height: 660, maxHeight: 660, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <HashLoader color={'#3232DC'} />
          <p className="login__user-loading-text" style={{ textAlign: 'center', color: '#999999' }}>Loading Ethereum Wallet</p>
        </div>
       );
    } else {
      return (
        <>
          <Logo/>
          <TextTitle>
            Wallet Connected
          </TextTitle>
          <form onSubmit={handleFormSubmit} className={classes.loginForm}>
            <TextField id="standard-secondary" value={connectedAccount} label="Current Ethereum Address" color="secondary" className="login__form-field" disabled />
            <p className={"login__form-desc login__form-privacy " + common.nnn1424h}>
              By clicking sign in you indicate that you have read and agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>
            </p>
            <Button
              label={'Sign in'}
              buttonType="primary"
              className={'login__form-cta'}
              loading={investorLoginLoading}
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

  return (
    <InvestorLayout>
      {render()}
    </InvestorLayout>
  )

};

export default withRouter(InvestorLogin);
