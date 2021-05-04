import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { getBalance } from '../../store/actions/balance';
import { getTiers, getUserTier, getUserInfo } from '../../store/actions/sota-tiers';
import { getAllowance } from '../../store/actions/sota-token';
import Tiers from './Tiers';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import AccountInformation from './AccountInformation';
import ManageTier from './ManageTier';
import useStyles from './style';
import useAuth from '../../hooks/useAuth';
import useTokenDetails from '../../hooks/useTokenDetails';
import useFetch from '../../hooks/useFetch';
import TierInfomation from './TierInfomation';
import { USER_STATUS } from '../../constants';

const TOKEN_ADDRESS = process.env.REACT_APP_PKF || '';
const TOKEN_UNI_ADDRESS = process.env.REACT_APP_UNI_LP || '';
const TOKEN_MANTRA_ADDRESS = process.env.REACT_APP_MANTRA_LP || '';

const iconWarning = "/images/icons/warning.svg";
const iconClose = "/images/icons/close.svg";

const AccountV2 = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { tokenDetails: tokenPKFDetails } = useTokenDetails(TOKEN_ADDRESS, 'eth');
  const { tokenDetails: tokenUniLPDetails } = useTokenDetails(TOKEN_UNI_ADDRESS, 'eth');
  const { tokenDetails: tokenMantraLPDetails } = useTokenDetails(TOKEN_MANTRA_ADDRESS, 'eth');
  const { data: data = {}, loading, error } = useFetch<any>(`/user/profile?wallet_address=${connectedAccount}`);
  const [emailVerified, setEmailVeryfied] = useState(0);
  const [email, setEmail] = useState<string>('');
  const [isKYC, setIsKYC] = useState(false);
  const [showAlertVerifyEmail, setShowAlertVerifyEmail] = useState(true);
  const [listTokenDetails, setListTokenDetails] = useState([]) as any;
  

  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) { 
      dispatch(getBalance(connectedAccount));
      dispatch(getUserInfo(connectedAccount));
      dispatch(getUserTier(connectedAccount));
      dispatch(getAllowance(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount]);

  useEffect(() => {
    setListTokenDetails([tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);
  }, [tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);

  useEffect(() => {
    if(data && data.user && data.user) {
      setEmail(data.user.email)
      setEmailVeryfied(data.user.status)
      setIsKYC(data.user.is_kyc == 1 ? true : false)
    } else {
      setEmail('')
      setEmailVeryfied(USER_STATUS.UNVERIFIED)
    }
  }, [data]);

  return (
    <DefaultLayout>
      {emailVerified == USER_STATUS.UNVERIFIED && !loading && showAlertVerifyEmail && connectedAccount && <div className={classes.alertVerifyEmail}>
        &nbsp;&nbsp;<img src={iconWarning}/>
        <img src={iconClose} className="btn-close" onClick={() => setShowAlertVerifyEmail(false)}/>
        &nbsp;&nbsp;
        <span>Your account has not been verified. To verify your account, please click on Verify Email button.</span>
      </div>}
      <div className={classes.accountContainer}>
        <div className={classes.mainContent}>
          <div className={classes.leftPanel}>
            <AccountInformation
              classNamePrefix="account-infomation"
              balance={balance}
              userInfo={userInfo}
              tokenPKFDetails={tokenPKFDetails}
              email={email}
              emailVerified={emailVerified}
              setEmail={setEmail}
              isKYC={isKYC}
            ></AccountInformation>
            <Tiers
              showMoreInfomation={false}
              tokenSymbol={tokenPKFDetails?.symbol}
            />
            <TierInfomation/>
          </div>
          <div className={classes.rightPanel}>
            <ManageTier listTokenDetails={listTokenDetails} emailVerified={emailVerified}/>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(AccountV2);
