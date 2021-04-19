import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import ModalVerifyEmail from '../ModalVerifyEmail';
import {isWidthDown, isWidthUp, withWidth} from '@material-ui/core';
import { trimMiddlePartAddress } from '../../../utils/accountAddress';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const { classNamePrefix = '', balance = {}, userInfo = {} } = props;
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const { data: data = {}, loading, error } = useFetch<any>(`/user/profile?wallet_address=${connectedAccount}`);
  const [emailVerified, setEmailVeryfied] = useState(false);
  const [email, setEmail] = useState<string>('');

  const handleKYC = () => {
    console.log('hande KYC')
  }

  useEffect(() => {
    data.user && data.user.email && setEmail(data.user.email)
  }, [data]);

  return (
    <div className={`${classNamePrefix}__component`}>
      <h2 className={styles.title}>Account</h2>
      <div className={styles.mainInfomation}>
        <div className={styles.inputGroup}>
          <span>Email</span>
          {isWidthUp('sm', props.width) && data.user?.email !== '' && !emailVerified && <>
            <span>{data.user?.email}</span>
            <button className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>Verify email</button></>}
          {isWidthDown('xs', props.width) && data.user?.email !== '' && emailVerified && <span>{data.user?.email}</span>}
          {data.user?.email === '' && connectedAccount && <span className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>Verify email</span>}
        </div>
        <div className={styles.inputGroup}>
          <span>Your Wallet</span>
          <span>{trimMiddlePartAddress(connectedAccount || '')}</span>
        </div>
        <div className={styles.redKiteInfo}>
          <div className="kyc-info">
            <span>Some pools may require you to be KYC verified</span>
            <button onClick={handleKYC}> KYC for Rekite projects</button>
          </div>
          <div className={styles.walletInfo}>
            <p>Wallet balance</p>
            <span>{ parseFloat(balance.token || 0).toFixed(2) }</span>
            <p>Locked-in </p>
            <span>{ parseFloat(userInfo.staked || 0).toFixed(2) }</span>
          </div>
        </div>
      </div>
      {openModalVerifyEmail && <ModalVerifyEmail
        setOpenModalVerifyEmail={setOpenModalVerifyEmail}
        email={email}
        setEmailVeryfied={setEmailVeryfied}
        setEmail={setEmail}
      />}
    </div>
  );
};

export default withWidth()(AccountInformation);
