import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { getBalance } from '../../store/actions/balance';
import { getTiers, getUserTier, getUserInfo } from '../../store/actions/sota-tiers';
import { getAllowance } from '../../store/actions/sota-token';
import Tiers from './Tiers'
import DefaultLayout from './../../components/Layout/DefaultLayout'
import AccountInformation from './AccountInformation'
import ManageTier from './ManageTier'
import useStyles from './style'

const Account = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { data: loginInvestor } = useSelector((state: any) => state.investor);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);

  useEffect(() => {
    dispatch(getBalance(loginInvestor.wallet_address));
    dispatch(getUserInfo(loginInvestor.wallet_address));
    dispatch(getTiers());
    dispatch(getUserTier(loginInvestor.wallet_address));
    dispatch(getAllowance(loginInvestor.wallet_address))
  }, [loginInvestor])

  return (
    <DefaultLayout>
      <div className={classes.accountContainer}>
        <div className={classes.leftPanel}>
          <AccountInformation
            classNamePrefix="account-infomation"
            balance={balance}
            userInfo={userInfo}
          ></AccountInformation>
          <Tiers
            showMoreInfomation={false}
          />
        </div>
        <div className={classes.rightPanel}>
          <ManageTier/>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(Account);
