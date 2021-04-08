import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const { classNamePrefix = '', balance = {}, userInfo = {} } = props;
  const { data: loginInvestor } = useSelector((state: any) => state.investor);

  useEffect(() => {

  });

  const handleKYC = () => {
    console.log('hande KYC')
  }

  const changePassword = () => {
    console.log('change password')
  }

  return (
    <div className={`${classNamePrefix}__component`}>
      <h2 className={styles.title}>Account</h2>
      <div className={styles.mainInfomation}>
        <div className={styles.inputGroup}>
          <span>Email</span>
          <span>{loginInvestor.email}</span>
          {/* <button onClick={changePassword}>Change Password</button> */}
        </div>
        <div className={styles.inputGroup}>
          <span>Your Wallet</span>
          <span>{loginInvestor.wallet_address}</span>
        </div>
        <div className={styles.redKiteInfo}>
          <div className="kyc-info">
            <span>Some pools may require you to be KYC verified</span>
            <button onClick={handleKYC}> KYC for Rekite projects</button>
          </div>
          <div className={styles.walletInfo}>
            <p>Wallet balance</p>
            <span>{ balance.sota }</span>
            <p>Locked-in </p>
            <span>{ userInfo.staked }</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AccountInformation;
