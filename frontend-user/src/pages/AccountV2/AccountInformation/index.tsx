import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import ModalVerifyEmail from '../ModalVerifyEmail';
import {isWidthDown, isWidthUp, withWidth} from '@material-ui/core';
import { trimMiddlePartAddress } from '../../../utils/accountAddress';
import { USER_STATUS } from '../../../constants';
import { TIERS } from '../../../constants';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const { classNamePrefix = '', balance = {}, userInfo = {} } = props;
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const { data: userTier = '0' } = useSelector((state: any) => state.userTier);

  const handleKYC = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeV_Sman6oEZ3UzNvgly_I-hxNMyGbS4WFhudCzcbDTc4Gaqg/viewform', '_blank');
  }

  const {
    email,
    setEmail,
    emailVerified,
    isKYC
  } = props;

  useEffect(() => {
    console.log(connectedAccount, emailVerified, USER_STATUS.UNVERIFIED, email)
  })

  return (
    <div className={`${classNamePrefix}__component`} style={{marginBottom: '65px'}}>
      <h2 className={styles.title}>Account</h2>
      <div className={styles.mainInfomation}>
        <div className={styles.inputGroup}>
          <span>Email</span>
          {isWidthUp('sm', props.width) && <>
            {email && emailVerified != USER_STATUS.UNVERIFIED && <span>{email}</span>}
            {(emailVerified == USER_STATUS.UNVERIFIED || !email) && connectedAccount &&
              <button className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>
                Verify Email
              </button>}
          </>}
          {isWidthDown('xs', props.width) && <div className="email-xs">
            {email && emailVerified != USER_STATUS.UNVERIFIED && <span>{email}</span>}
            {(emailVerified == USER_STATUS.UNVERIFIED || !email) && connectedAccount &&
              <button className="verify-email" onClick={() => setOpenModalVerifyEmail(true)}>
                Verify Email
              </button>}
          </div>}
        </div>
        <div className={styles.inputGroup}>
          <span>Your Wallet</span>
          <span>
            {isWidthUp('sm', props.width) && connectedAccount}
            {isWidthDown('xs', props.width) && connectedAccount && trimMiddlePartAddress(connectedAccount || '')}
          </span>
        </div>
        <div className={styles.inputGroup}>
          <span>Your Tier</span>
          <span>
            {_.isEmpty(userTier) ? TIERS[0].name : TIERS[userTier]?.name}
          </span>
        </div>
        <div className={styles.inputGroup}>
          <span>KYC for Redkite</span>
          {connectedAccount && <>
            <span>{isKYC ? 'Verified' : 'Unverified'}</span>
            {!isKYC && <button className="verify-email" onClick={handleKYC}>
              Register KYC
            </button>}
          </>}
        </div>
        <div className={styles.redKiteInfo}>
          {/* <div className={styles.walletInfo}>
            <p>Wallet balance</p>
            {!_.isEmpty(balance) && !_.isEmpty(userInfo) && <span>
              <AnimatedNumber
                value={(wrongChain || !isAuth) ? 0 : balance.token}
                formatValue={numberWithCommas}
              />&nbsp;{tokenDetails?.symbol}
            </span>}
            {(_.isEmpty(balance) || _.isEmpty(userInfo)) && <span>
              0&nbsp;{tokenDetails?.symbol}
            </span>}
            <p>Locked-in </p>
            {!_.isEmpty(balance) && !_.isEmpty(userInfo) && <span>
              <AnimatedNumber
                value={(wrongChain || !isAuth) ? 0 : userInfo.staked}
                formatValue={numberWithCommas}
              />&nbsp;{tokenDetails?.symbol}
            </span>}
            {(_.isEmpty(balance) || _.isEmpty(userInfo)) && <span>
              0&nbsp;{tokenDetails?.symbol}
            </span>}
          </div> */}
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
