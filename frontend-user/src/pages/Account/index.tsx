import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {getCampaignDetail, getLatestActiveCampaign, getLatestCampaign} from '../../store/actions/campaign';
import { getUsdtAllowance } from '../../store/actions/usdt-allowance';
import { buyToken } from '../../store/actions/buy-token';
import { approveUsdt } from '../../store/actions/usdt-approve';
import _ from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { login, register as registerAccount, logout, resetUserState } from '../../store/actions/user';
import { getBalance } from '../../store/actions/balance';
import { getUsdtDetail } from '../../store/actions/usdt-detail';
import { isCampaignPurchasable } from '../../store/actions/buy-token';
import { userAlreadyExists } from '../../utils/user';
import { alertFailure } from '../../store/actions/alert';
import useStyles from './style';
import {adminRoute, publicRoute} from "../../utils";
import {BaseRequest} from "../../request/Request";
import {MAX_BUY_CAMPAIGN} from "../../constants";
import BigNumber from "bignumber.js";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {getTokenRemainingCanBuy} from "../../utils/campaign";
import ComingSoon from "../ComingSoon/ComingSoon";
import moment from "moment";
import {unixTimeNow} from "../../utils/convertDate";
import {getTiers, getUserTier, getUserInfo, deposit, withdraw, getWithdrawPercent} from '../../store/actions/sota-tiers';
import {approve, getAllowance} from '../../store/actions/sota-token';
import Tiers from './Tiers'
import DefaultLayout from './../../components/Layout/DefaultLayout'
import AccountInformation from './AccountInformation'
import ManageTier from './ManageTier'

const queryString = require('query-string');
const byTokenLogo = '/images/logo-in-buy-page.png';

const Account = (props: any) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [loadingUserExists, setLoadingUserExists] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const { data: loginUser = '' } = useSelector((state: any) => state.user);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { data: loginInvestor, loading: investorLoginLoading, error } = useSelector((state: any) => state.investor);
  const { data: isPurchasable, loading: isPurchasableLoading = false } = useSelector((state: any) => state.buyTokenPurchasable);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userTier = {} } = useSelector((state: any) => state.userTier);
  const { data: allowance = {} } = useSelector((state: any) => state.allowance);
  const { data: approved = {} } = useSelector((state: any) => state.approved);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);



  // useEffect(() => {
  //   if (loginInvestor) {
  //     dispatch(getBalance(loginInvestor.wallet_address));
  //   } 
  //   // dispatch(approve(loginInvestor.wallet_address, '100005'));

  //   // dispatch(getAllowance(loginInvestor.wallet_address))
  //   // dispatch(getUserTier(loginInvestor.wallet_address));
  //   dispatch(getAllowance(loginInvestor.wallet_address))
  //   // dispatch(balanceOf(loginInvestor.wallet_address));
  //   // dispatch(deposit(loginInvestor.wallet_address, '10000'));
  //   // dispatch(withdraw(loginInvestor.wallet_address, '100'));
  //   // dispatch(getUserInfo(loginInvestor.wallet_address));

  //   // reset user state when leave component or redirect to other pages
  //   return () => {
  //     error && dispatch(resetUserState(true));
  //   }
  // }, [loginInvestor]);

  useEffect(() => {
    dispatch(getAllowance(loginInvestor.wallet_address))
  }, [approved])

  useEffect(() => {
    dispatch(getBalance(loginInvestor.wallet_address));
    dispatch(getUserInfo(loginInvestor.wallet_address));
    dispatch(getTiers());
    dispatch(getUserTier(loginInvestor.wallet_address));
    // dispatch(getWithdrawPercent(loginInvestor.wallet_address, withdrawAmount));
  }, [loginInvestor])

  const onApprove = () => {
    dispatch(approve(loginInvestor.wallet_address, '1000000000'));
  }

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
            classNamePrefix="tiers"
            tiers={tiers}
            userTier={userTier}
            userInfo={userInfo}
            showMoreInfomation={false}
          />
        </div>
        <div className={classes.rightPanel}>
          <ManageTier
            classNamePrefix="change-tier"
            balance={balance}
            allowance={allowance}
            onApprove={onApprove}
            deposit={deposit}
            withdraw={withdraw}
            userInfo={userInfo}
          ></ManageTier>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(Account);
