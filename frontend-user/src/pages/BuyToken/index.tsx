import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {getCampaignDetail, getLatestActiveCampaign, getLatestCampaign} from '../../store/actions/campaign';
import { getUsdtAllowance } from '../../store/actions/usdt-allowance';
import { buyToken } from '../../store/actions/buy-token';
import { approveUsdt } from '../../store/actions/usdt-approve';
import Form from './Form';
import Campaign from './Campaign';
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

const queryString = require('query-string');
const byTokenLogo = '/images/logo-in-buy-page.png';

const BuyToken = (props: any) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [loadingUserExists, setLoadingUserExists] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const { loading: investorRegisterLoading, error: errorRegister } = useSelector((state: any) => state.investorRegister);
  const { data: loginInvestor, loading: investorLoginLoading, error } = useSelector((state: any) => state.investor);
  const { data: ethAddress = '' } = useSelector((state: any) => state.userConnect);

  const { data: isPurchasable, loading: isPurchasableLoading = false } = useSelector((state: any) => state.buyTokenPurchasable);
  const { data: campaignLatestActive = {}, loading: campaignLatestActiveLoading = false } = useSelector((state: any) => state.campaignLatestActive);
  const { data: campaignDetail = {}, loading: campaignDetailLoading = false } = useSelector((state: any) => state.campaignDetail);

  const { loading: buyLoading } = useSelector((state: any) => state.buyToken);
  const { data: usdtAllowance = false, loading: usdtAllowanceLoading } = useSelector((state: any) => state.usdtAllowance);
  const { loading: usdtApproveLoading = false } = useSelector((state: any) => state.usdtApprove);
  const { data: loginUser = '' } = useSelector((state: any) => state.user);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { data: usdtDetail = {} } = useSelector((state: any) => state.usdtDetail);
  const { history } = props;

  const searchLocation = _.get(props, 'location.search');
  const parsed = queryString.parse(searchLocation);
  const { referral = '', campaignIndex = '' } = parsed;
  const campaignId = parsed.campaignId || (campaignLatestActive && campaignLatestActive.campaign_hash) || '';

  const { register, getValues, setValue, watch, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const password = useRef({});
  password.current = watch("password", "");

  const renderErrorRequired = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required';
      }
    }
  }

  useEffect(() => {
    if (error || errorRegister) {
      dispatch(alertFailure(error || errorRegister));
    }
  }, [error, errorRegister]);

  useEffect(() => {
    const checkUserExists = async () => {
      setLoadingUserExists(true);

      const userExists = await userAlreadyExists(ethAddress, true);
      setLoadingUserExists(false);

      setUserExists(userExists);
    }

    ethAddress && checkUserExists();
  }, [ethAddress, loginInvestor]);

  useEffect(() => {
    loginInvestor && dispatch(isCampaignPurchasable());
  }, [loginInvestor, dispatch]);

  useEffect(() => {
    if (!campaignId) {
      if (!campaignDetail) {
        dispatch(getLatestActiveCampaign());
      }
    } else if (campaignId && loginInvestor) {
      dispatch(getCampaignDetail(campaignId, true));
    }
  }, [campaignId, loginInvestor, dispatch]);

  useEffect(() => {
    if (parsed.campaignId && campaignDetail && campaignDetail.isSuspend) {
      console.log('CAMPAIGN SUSPENDED');
      props.history.push(publicRoute('/buy-token'));
    }
  });

  useEffect(() => {
    if (loginInvestor) {
      dispatch(getBalance(loginInvestor.wallet_address));
    }

    // reset user state when leave component or redirect to other pages
    return () => {
      error && dispatch(resetUserState(true));
    }
  }, [loginInvestor, isPurchasable, error, dispatch]);

  useEffect(() => {
    isPurchasable && dispatch(getUsdtDetail());
  }, [isPurchasable, dispatch]);

  const [prices, setPrices] = useState({});
  const [userBought, setUserBought] = useState({});
  const [isMaxBuy, setIsMaxBuy] = useState(false);

  // console.log('Prices', prices);
  // console.log('Investor', loginInvestor);
  console.log('campaignDetail', campaignDetail);

  const [totalUsdUserBought, setTotalUsdUserBought] = useState(0);
  const getUserBought = async () => {
    const baseRequest = new BaseRequest();
    baseRequest.post(`/user/buy`, {
      address: loginInvestor.wallet_address,
      campaign: campaignDetail.transactionHash
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        setTotalUsdUserBought(res.data && res.data.total_usd)
      }
    });
  };
  useEffect(() => {
    if (loginInvestor && loginInvestor.wallet_address && campaignDetail && campaignDetail.transactionHash) {
      getUserBought();
    }
  }, [loginInvestor, campaignDetail]);

  const [countdown, setCountdown] = useState(null);
  useEffect(() => {
    const getComingSoonTime = async () => {
      const isInvestor = true;
      const baseRequest = new BaseRequest();
      baseRequest.get(`/coming-soon`, isInvestor)
        .then(res => res.json())
        .then(res => {
          if (res.status === 200) {
            setCountdown(res?.data?.value || '');
          }
        });
    };
    getComingSoonTime();
  }, []);

  if (countdown && !parsed.campaignId) {
    const now = unixTimeNow();
    const countdownUnix = moment(countdown).unix();
    // campaignDetail && !campaignLatestActive &&
    // ?campaignId=0x726A13d0da774eF8D4844f2aB93c54254B609824
    if (now < countdownUnix) {
      return (
        <ComingSoon
          countdown={countdown}
          campaignDetail={campaignDetail}
        />
      );
    }
  }

  const checkMaxUsd = async (ethAmount: number, usdtAmount: number) => {
    const baseRequest = new BaseRequest();
    const res = await baseRequest.post(`/public/check-max-usd`, {
      campaign: campaignDetail.transactionHash,
      eth: ethAmount,
      usdt: usdtAmount,
    }, true)
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          console.log('Res /public/check-max-usd', res);
          return res;
        } else {
          dispatch(alertFailure(res.message));
          return null;
        }
      })
      .catch((err) => console.log(err));

    return res;
  };

  const submitBuyToken = (data: any) => {
    const { amount = '', unit = '' } = data;
    const buyUnit = unit || 'eth';

    if (buyUnit === 'usdt' && !usdtAllowance) {
      dispatch(approveUsdt(amount, campaignId));
      return;
    }
    console.log('Call submitBuyToken with data: ', data);
    if (referral) {
      dispatch(buyToken(amount, data.tokenConvert, campaignId, buyUnit, referral, campaignIndex));
    } else {
      dispatch(buyToken(amount, data.tokenConvert, campaignId, buyUnit, '', ''));
    }
  };

  const onUsdtAllowance = (amount: string) => {
    dispatch(getUsdtAllowance(amount, campaignId));
  };

  console.log('loginInvestor: ', loginInvestor);
  if (!loginInvestor) {
    setTimeout(() => {
      history.push(publicRoute('/login'));
    }, 500);

    return (
      <div className={classes.buyToken}>
        <div className={`${classes.buyToken}__wrapper`}>
          <div className={`${classes.buyToken}__loading`}>
            <div className={`${classes.buyToken}__logo`}>
              <img src={byTokenLogo} alt="logo" />
            </div>
            <div className="login__user-loading">
              <CircularProgress size={75} thickness={4} value={100} />
              <p className="login__user-loading-text">Loading Ethereum Wallet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((campaignLatestActiveLoading && campaignLatestActive) || campaignDetailLoading || isPurchasableLoading) {
    return (
      <div className={classes.buyToken}>
        <div className={`${classes.buyToken}__wrapper`}>
          <div className={`${classes.buyToken}__loading`}>
            <CircularProgress />
          </div>
        </div>
      </div>
    )
  }

  if (!campaignDetail) {
    return (
      <div className={classes.buyToken}>
        <div className={`${classes.buyToken}__wrapper`}>
          {
            loginInvestor && <button className={`${classes.buyToken}__logout`} onClick={() => dispatch(logout(true))}>Log out</button>
          }

          <div className={`${classes.buyToken}__logo`}>
            <img src={byTokenLogo} alt="logo" />
          </div>
          <div className={`${classes.buyToken}__campaign-not-found`}>
            <div className="text-center text-danger">
              Campaign not found
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isTokenValid = () => {
    let tokenValid = false;
    const tokenLeft = _.get(campaignDetail, 'tokenLeft', 0);
    const remainToken = getTokenRemainingCanBuy(campaignDetail);
    if (tokenLeft) {
      tokenValid = new BigNumber(remainToken).gt(0);
    }

    return tokenValid;
  };
  const isClaimable = _.get(campaignDetail, 'isClaimable', '');
  const tokenSoldOut = !isTokenValid();
  const isOverBought = totalUsdUserBought >= MAX_BUY_CAMPAIGN;
  const isShowBannerCampaignClosed = !isClaimable && isPurchasable && !isOverBought && tokenSoldOut;

  return (
    <>
    {isShowBannerCampaignClosed &&
      <div className={classes.errorBanner}>
        Thank you for your interest, we have reached the cap and campaign is closed
      </div>
    }
    <div className={classes.buyToken}>

      <div className={`${classes.buyToken}__wrapper`}>

        {
          loginInvestor &&
          <button
            className={`${classes.buyToken}__logout ${isShowBannerCampaignClosed ? classes.loginWithBanner : '' } `}
            onClick={() => dispatch(logout(true))}
          >
            Log out
          </button>
        }
        <div className={`${classes.buyToken}__logo ${isShowBannerCampaignClosed ? classes.withBanner : '' } `}>
          <img src={byTokenLogo} alt="logo" />
        </div>

        <Campaign
          classNamePrefix={classes.buyToken}
          data={campaignDetail}
        />

        <Form
          classNamePrefix={classes.buyToken}
          submitBuyToken={submitBuyToken}
          campaignDetail={campaignDetail}
          buyLoading={buyLoading}
          usdtAllowanceLoading={usdtAllowanceLoading}
          usdtApproveLoading={usdtApproveLoading}
          onUsdtAllowance={onUsdtAllowance}
          usdtAllowance={usdtAllowance}
          balance={balance}
          usdtDetail={usdtDetail}
          totalUsdUserBought={totalUsdUserBought}
          setTotalUsdUserBought={setTotalUsdUserBought}
          isMaxBuy={isMaxBuy}
          setIsMaxBuy={setIsMaxBuy}
          checkMaxUsd={checkMaxUsd}
        />
        <Link className={`login__form-redirect`} to="/change-password/investor">Change password ?</Link>
      </div>
    </div>
    </>

  );
};

export default withRouter(BuyToken);
