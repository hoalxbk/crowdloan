import React, {useEffect, useState} from 'react';
import useStyles from "./style";
import {useCommonStyle} from "../../styles";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {CircularProgress, Grid} from "@material-ui/core";
import {getTokenInfo, TokenType} from "../../utils/token";
import {isFactorySuspended} from "../../utils/campaignFactory";
import {createPool, updatePool} from "../../request/pool";
import {alertFailure, alertSuccess} from "../../store/actions/alert";
import {withRouter} from "react-router-dom";
import {deployPool} from "../../store/actions/campaign";
import {adminRoute} from "../../utils";
import {ACCEPT_CURRENCY} from "../../constants";

import PoolBanner from "./Components/PoolBanner";
import TokenAddress from "./Components/TokenAddress";
import TotalCoinSold from "./Components/TotalCoinSold";
import TokenLogo from "./Components/TokenLogo";
import DurationTime from "./Components/DurationTimes";
import MinTier from "./Components/MinTier";
import TierTable from "./Components/Tier/TierTable";
import BuyType from "./Components/BuyType";
import PoolType from "./Components/PoolType";
import NetworkAvailable from "./Components/NetworkAvailable";
import AcceptCurrency from "./Components/AcceptCurrency";
import PoolDescription from "./Components/PoolDescription";
import AddressReceiveMoney from "./Components/AddressReceiveMoney";
import ExchangeRate from "./Components/ExchangeRate";
import DisplayPoolSwitch from "./Components/DisplayPoolSwitch";
import PoolHash from "./Components/PoolHash";
import PoolName from "./Components/PoolName";
import UserJoinPool from "./Components/UserJoinPool";
import PoolWebsite from "./Components/PoolWebsite";
import moment from "moment";
import ClaimConfigTable from "./Components/ClaimConfig/ClaimConfigTable";

function PoolForm(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();
  const history = props.history;

  const { data: loginUser } = useSelector(( state: any ) => state.user);

  const { isEdit, poolDetail } = props;
  const [isSuspend, setIsSuspend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingDeploy, setLoadingDeploy] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [token, setToken] = useState<TokenType | null>(null);
  const [needValidate, setNeedValidate] = useState(false);

  useEffect(() => {
    const checkCampaignFactorySuspended = async () => {
      const isSuspended = await isFactorySuspended();
      setIsSuspend(isSuspended);
    }
    checkCampaignFactorySuspended();
  }, []);

  const { register, setValue, getValues, clearErrors, errors, handleSubmit, control, watch } = useForm({
    mode: "onChange",
    defaultValues: poolDetail,
    reValidateMode: 'onChange',
  });

  const createUpdatePool = async (data: any) => {
    // Format Tiers
    const minTier = data.minTier;
    let tierConfiguration = data.tierConfiguration || '[]';
    tierConfiguration = JSON.parse(tierConfiguration);
    tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
      const item = {
        ...currency,
        currency: data.acceptCurrency,
      };
      if (index < minTier) {
        item.maxBuy = 0;
        item.minBuy = 0;
      }

      item.startTime = item.startTime ? (moment(item.startTime).unix() || null) : null;
      item.endTime = item.endTime ? (moment(item.endTime).unix() || null) : null;
      return item;
    });

    // Format Claim Config
    let campaignClaimConfig = data.campaignClaimConfig || '[]';
    campaignClaimConfig = JSON.parse(campaignClaimConfig);
    campaignClaimConfig = campaignClaimConfig.map((item: any, index: number) => {
      item.startTime = item.startTime ? (moment(item.startTime).unix() || null) : null;
      item.endTime = item.endTime ? (moment(item.endTime).unix() || null) : null;
      return item;
    });

    const tokenInfo = await getTokenInforDetail(data.token);
    if (!tokenInfo?.symbol) {
      throw Error('Token Information has not been loaded !!!');
      dispatch(alertFailure('Token Information has not been loaded !!!'))
      return false;
    }

    const isAcceptEth = data.acceptCurrency === ACCEPT_CURRENCY.ETH;
    const submitData = {
      registed_by: loginUser?.wallet_address,
      is_display: data.is_display,

      // Pool general
      title: data.title,
      website: data.website,
      banner: data.banner,
      description: data.description,
      address_receiver: data.addressReceiver,

      // Token
      token: data.token,
      token_images: data.tokenImages,
      total_sold_coin: data.totalSoldCoin,

      token_by_eth: data.tokenRate,
      token_conversion_rate: data.tokenRate,
      price_usdt: data.price_usdt,
      display_price_rate: data.display_price_rate,

      // TokenInfo
      tokenInfo,

      // Time
      start_time: data.start_time ? data.start_time.unix() : null,
      finish_time: data.finish_time ? data.finish_time.unix() : null,
      release_time: data.release_time ? data.release_time.unix() : null,
      start_join_pool_time: data.start_join_pool_time ? data.start_join_pool_time.unix() : null,
      end_join_pool_time: data.end_join_pool_time ? data.end_join_pool_time.unix() : null,

      // Types
      accept_currency: data.acceptCurrency,
      network_available: data.networkAvailable,
      buy_type: data.buyType,
      pool_type: data.poolType,

      // Tier
      min_tier: data.minTier,
      tier_configuration: tierConfiguration,

      // Claim Configuration
      claim_configuration: campaignClaimConfig,

      // Wallet
      wallet: isEdit ? poolDetail?.wallet : {},
    };

    console.log('[createUpdatePool] - Submit with data: ', submitData);

    let response = {};
    if (isEdit) {
      response = await updatePool(submitData, poolDetail.id);
    } else {
      response = await createPool(submitData);
    }

    return response;
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await createUpdatePool(data);
      if (response?.status === 200) {
        dispatch(alertSuccess('Successful!'));
        history.push(adminRoute('/campaigns'));
      } else {
        dispatch(alertFailure('Fail!'));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERROR: ', e);
    }
  };

  // Update After Deploy
  const updatePoolAfterDeloy = async (data: any) => {
    // Format Claim Config
    let campaignClaimConfig = data.campaignClaimConfig || '[]';
    campaignClaimConfig = JSON.parse(campaignClaimConfig);
    campaignClaimConfig = campaignClaimConfig.map((item: any, index: number) => {
      item.startTime = item.startTime ? (moment(item.startTime).unix() || null) : null;
      item.endTime = item.endTime ? (moment(item.endTime).unix() || null) : null;
      return item;
    });

    // Only allow update informations:
    // name
    // website
    // banner
    // total coin sold
    // token image
    // about pool
    // list user join (hiển nhiên)
    const submitData = {
      // Pool general
      title: data.title,
      website: data.website,
      banner: data.banner,
      description: data.description,

      // USDT Price
      price_usdt: data.price_usdt,
      display_price_rate: data.display_price_rate,

      // Token
      token_images: data.tokenImages,
      total_sold_coin: data.totalSoldCoin,

      // Claim Configuration
      claim_configuration: campaignClaimConfig,

    };

    console.log('[updatePoolAfterDeloy] - Submit with data: ', submitData);

    let response = await updatePool(submitData, poolDetail.id);

    return response;
  };

  const handleUpdateAfterDeloy = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await updatePoolAfterDeloy(data);
      if (response?.status === 200) {
        dispatch(alertSuccess('Successful!'));
        history.push(adminRoute('/campaigns'));
      } else {
        dispatch(alertFailure('Fail!'));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERROR: ', e);
    }
  };

  // Create / Update Pool (Before Deploy)
  const handleCampaignCreateUpdate = () => {
    setNeedValidate(false);
    setTimeout(() => {
      if (poolDetail?.is_deploy) {
        handleSubmit(handleUpdateAfterDeloy)();
      } else {
        handleSubmit(handleFormSubmit)();
      }
    }, 100);
  };

  const getTokenInforDetail = async (token: string) => {
    const erc20Token = await getTokenInfo(token);
    let tokenInfo: any = {};
    if (erc20Token) {
      const { name, symbol, decimals, address } = erc20Token;
      tokenInfo = { name, symbol, decimals, address };
    }
    return tokenInfo;
  }

  // Deploy Pool And Update
  const handleDeloySubmit = async (data: any) => {
    if (poolDetail.is_deploy || deployed) {
      alert('Pool is deployed !!!');
      return false;
    }
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('The system will store the latest pool information.\n' +
     'Are you sure you want to deploy?')) {
      setNeedValidate(false);
      return false;
    }

    setLoadingDeploy(true);
    try {
      // Save data before deploy
      const response = await createUpdatePool(data);
      const tokenInfo = await getTokenInforDetail(data.token);

      const history = props.history;
      const minTier = data.minTier;
      let tierConfiguration = data.tierConfiguration || '[]';
      tierConfiguration = JSON.parse(tierConfiguration);
      tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
        const item = {
          ...currency,
          currency: data.acceptCurrency,
        };
        if (index < minTier) {
          item.maxBuy = 0;
          item.minBuy = 0;
        }
        return item;
      });

      const isAcceptEth = data.acceptCurrency === ACCEPT_CURRENCY.ETH;
      const submitData = {
        id: poolDetail.id,
        registed_by: loginUser?.wallet_address,

        // Pool general
        title: data.title,
        website: data.website,
        banner: data.banner,
        description: data.description,
        address_receiver: data.addressReceiver,

        // Token
        token: data.token,
        token_images: data.tokenImages,
        total_sold_coin: data.totalSoldCoin,

        // Rate
        token_by_eth: data.tokenRate,
        token_conversion_rate: data.tokenRate,

        // USDT Price
        price_usdt: data.price_usdt,
        display_price_rate: data.display_price_rate,

        // TokenInfo
        tokenInfo,

        // Time
        start_time: data.start_time ? data.start_time.unix() : null,
        finish_time: data.finish_time ? data.finish_time.unix() : null,
        release_time: data.release_time ? data.release_time.unix() : null,
        start_join_pool_time: data.start_join_pool_time ? data.start_join_pool_time.unix() : null,
        end_join_pool_time: data.end_join_pool_time ? data.end_join_pool_time.unix() : null,

        // Types
        accept_currency: data.acceptCurrency,
        network_available: data.networkAvailable,
        buy_type: data.buyType,
        pool_type: data.poolType,

        // Tier
        min_tier: data.minTier,
        tier_configuration: tierConfiguration,

        // Wallet
        wallet: isEdit ? poolDetail?.wallet : {},
      };

      console.log('[handleDeloySubmit] - Submit with data: ', submitData);

      await dispatch(deployPool(submitData, history));
      setLoadingDeploy(false);
      setDeployed(true);
      window.location.reload();
    } catch (e) {
      setLoadingDeploy(false);
      console.log('ERROR: ', e);
    }
  };

  const handlerDeploy = () => {
    setNeedValidate(true);
    setTimeout(() => {
      handleSubmit(handleDeloySubmit)();
    }, 100);
  };

  const watchBuyType = watch('buyType');
  console.log('errors==========>', errors);

  return (
  <>
    <div className="contentPage">
      <Grid container spacing={2}>
        <Grid item xs={6}>


          <div className="">
            <div className={classes.exchangeRate}>
              {!!poolDetail?.id &&
                <DisplayPoolSwitch
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  control={control}
                />
              }

              <PoolName
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <PoolHash poolDetail={poolDetail} />
              {/*{!!poolDetail?.is_deploy &&*/}
              {/*  <PoolHash poolDetail={poolDetail} />*/}
              {/*}*/}
              <PoolBanner
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <PoolWebsite
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

            </div>

            <div className={classes.exchangeRate}>
              <BuyType
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
              />

              <PoolType
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
              />

              <NetworkAvailable
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
                needValidate={needValidate}
              />

              <AcceptCurrency
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
                watch={watch}
              />

            </div>

            <div className={classes.exchangeRate}>
              <ClaimConfigTable
                poolDetail={poolDetail}
                register={register}
                watch={watch}
              />
            </div>



          </div>
        </Grid>

        <Grid item xs={6}>
          <div className={classes.exchangeRate}>
            <TokenAddress
              poolDetail={poolDetail}
              register={register}
              token={token}
              setToken={setToken}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              watch={watch}
            />

            <AddressReceiveMoney
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <TotalCoinSold
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <TokenLogo
              poolDetail={poolDetail}
              register={register}
              errors={errors}
            />

          </div>

          <div className={classes.exchangeRate}>
            <DurationTime
              poolDetail={poolDetail}
              register={register}
              token={token}
              setToken={setToken}
              setValue={setValue}
              errors={errors}
              control={control}
              getValues={getValues}
              watch={watch}
              needValidate={needValidate}
            />
          </div>


          <ExchangeRate
            poolDetail={poolDetail}
            register={register}
            token={token}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

        </Grid>

      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.exchangeRate}>
            <PoolDescription
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />
          </div>
        </Grid>
      </Grid>


      <Grid container spacing={2}>
        <Grid item xs={12}>

          <div className={classes.exchangeRate}>
            <MinTier
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
            />

            <TierTable
              poolDetail={poolDetail}
              register={register}
              watch={watch}
            />

          </div>


        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>

          {isEdit && poolDetail?.id && watchBuyType === 'whitelist' &&
          <div className={classes.exchangeRate}>
            <UserJoinPool
              poolDetail={poolDetail}
            />
          </div>
          }

          <button
            disabled={!isEdit || !poolDetail?.id || poolDetail?.is_deploy || loading || loadingDeploy || deployed }
            className={(!isEdit || poolDetail?.is_deploy || deployed) ? classes.formButtonDeployed : classes.formButtonDeploy}
            onClick={handlerDeploy}
          >
            {loadingDeploy && <CircularProgress size={25} />}
            {!loadingDeploy && 'Deploy'}
          </button>

          <button
            disabled={loading || loadingDeploy}
            className={classes.formButtonUpdatePool}
            onClick={handleCampaignCreateUpdate}
          >
            {
              (loading || loadingDeploy) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')
            }
          </button>

          {/* Button Update with disable after deploy */}
          {/*<button*/}
          {/*  disabled={loading || loadingDeploy || poolDetail?.is_deploy}*/}
          {/*  className={poolDetail?.is_deploy ? classes.formButtonDeployed : classes.formButtonUpdatePool}*/}
          {/*  onClick={handleCampaignCreateUpdate}*/}
          {/*>*/}
          {/*  {*/}
          {/*    (loading || loadingDeploy) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')*/}
          {/*  }*/}
          {/*</button>*/}

        </Grid>
      </Grid>




    </div>

  </>
  );
}

export default withRouter(PoolForm);
