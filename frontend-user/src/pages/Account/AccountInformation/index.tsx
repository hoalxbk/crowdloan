import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import ModalVerifyEmail from '../ModalVerifyEmail';
import {isWidthDown, isWidthUp, withWidth} from '@material-ui/core';
import { trimMiddlePartAddress } from '../../../utils/accountAddress';
import { USER_STATUS } from '../../../constants';
//@ts-ignore
import AnimatedNumber from "animated-number-react";
import { numberWithCommas } from '../../../utils/formatNumber';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const { classNamePrefix = '', balance = {}, userInfo = {} } = props;
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const { data: data = {}, loading, error } = useFetch<any>(`/user/profile?wallet_address=${connectedAccount}`);
  const [emailVerified, setEmailVeryfied] = useState(0);
  const [email, setEmail] = useState<string>('');

  const handleKYC = () => {
    console.log('hande KYC')
  }

  useEffect(() => {
    data && data.user && data.user.email && setEmail(data.user.email)
    data && data.user && data.user.status && setEmailVeryfied(data.user.status)
  }, [data]);

  const formatValue = (value: string) => parseFloat(value).toFixed(2);

  return (
    <div className={`${classNamePrefix}__component`}>
      <h2 className={styles.title}>Account</h2>
      <div className={styles.mainInfomation}>
        <div className={styles.inputGroup}>
          <span>Email</span>
          {isWidthUp('sm', props.width) && <>
            {email && <span>{email}</span>}
            {(emailVerified == USER_STATUS.UNVERIFIED || !email) &&
              <button className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>
                Verify Email
              </button>}
          </>}
          {isWidthDown('xs', props.width) && <>
            {email && <span>{email}</span>}
            {(emailVerified == USER_STATUS.UNVERIFIED || !email) &&
              <button className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>
                Verify Email
              </button>}
          </>}
          {email === '' && connectedAccount && <span className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>Verify email</span>}
        </div>
        <div className={styles.inputGroup}>
          <span>Your Wallet</span>
          <span>
            {isWidthUp('sm', props.width) && connectedAccount}
            {isWidthDown('xs', props.width) && trimMiddlePartAddress(connectedAccount || '')}
          </span>
        </div>
        <div className={styles.redKiteInfo}>
          <div className="kyc-info">
            <span>Some pools may require you to be KYC verified</span>
            <button onClick={handleKYC}> KYC for Rekite projects</button>
          </div>
          <div className={styles.walletInfo}>
            <p>Wallet balance</p>
            <AnimatedNumber
              value={balance.token}
              formatValue={numberWithCommas}
            />
            <p>Locked-in </p>
            <AnimatedNumber
              value={userInfo.staked}
              formatValue={numberWithCommas}
            />
          </div>
        </div>
      </div>
      {openModalVerifyEmail && <ModalVerifyEmail
        setOpenModalVerifyEmail={setOpenModalVerifyEmail}
        email={email}
        setEmail={setEmail}
      />}
    </div>
  );
};

export default withWidth()(AccountInformation);
