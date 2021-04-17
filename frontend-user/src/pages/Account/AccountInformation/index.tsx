import { useSelector } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const { classNamePrefix = '', balance = {}, userInfo = {} } = props;
  const { data: loginInvestor } = useSelector((state: any) => state.investor);
  const { isAuth, connectedAccount, wrongChain } = useAuth();

  const handleKYC = () => {
    console.log('hande KYC')
  }

  return (
    <div className={`${classNamePrefix}__component`}>
      <h2 className={styles.title}>Account</h2>
      <div className={styles.mainInfomation}>
        <div className={styles.inputGroup}>
          <span>Email</span>
          <span>{loginInvestor.email}</span>
        </div>
        <div className={styles.inputGroup}>
          <span>Your Wallet</span>
          <span>{connectedAccount}</span>
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

    </div>
  );
};

export default AccountInformation;
