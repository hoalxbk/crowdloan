import React, {useEffect, useState} from 'react';
import useStyles from "./style";
import {useCommonStyle} from "../../styles";
import {useForm} from "react-hook-form";

import {useDispatch, useSelector} from "react-redux";
import PoolBanner from "./Components/PoolBanner";
import TokenAddress from "./Components/TokenAddress";
import TotalCoinSold from "./Components/TotalCoinSold";
import TokenLogo from "./Components/TokenLogo";
import DurationTime from "./Components/DurationTimes";
import MinTier from "./Components/MinTier";
import TierTable from "./Components/TierTable";
import BuyType from "./Components/BuyType";
import PoolType from "./Components/PoolType";
import NetworkAvailable from "./Components/NetworkAvailable";
import AcceptCurrency from "./Components/AcceptCurrency";
import PoolDescription from "./Components/PoolDescription";
import AddressReceiveMoney from "./Components/AddressReceiveMoney";
import ExchangeRate from "./Components/ExchangeRate";
import {CircularProgress, Grid} from "@material-ui/core";
import {TokenType} from "../../utils/token";
import {isFactorySuspended} from "../../utils/campaignFactory";
import {createPool, updatePool} from "../../request/pool";
import {alertFailure, alertSuccess} from "../../store/actions/alert";
import {adminRoute} from "../../utils";
import {withRouter} from "react-router-dom";
import PoolName from "./Components/PoolName";
import UserJoinPool from "./Components/UserJoinPool";
import {renderErrorCreatePool} from "../../utils/validate";

function PoolForm(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();

  const { isEdit, poolDetail } = props;
  const [isSuspend, setIsSuspend] = useState(true);
  // const { loading } = useSelector(( state: any ) => state.campaignCreate);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<TokenType | null>(null);

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
  });

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const history = props.history;
      let tierConfiguration = data.tierConfiguration || '[]';
      tierConfiguration = JSON.parse(tierConfiguration);
      tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
        return {
          ...currency,
          currency: data.acceptCurrency,
        };
      });
      const submitData = {
        register_by: '',

        // Pool general
        title: data.title,
        banner: data.banner,
        description: data.description,
        address_receiver: data.addressReceiver,

        // Token
        token: data.token,
        token_by_eth: data.tokenByETH,
        token_images: data.tokenImages,
        total_sold_coin: data.totalSoldCoin,

        // Time
        start_time: data.start_time && data.start_time.unix(),
        finish_time: data.finish_time && data.finish_time.unix(),
        release_time: data.release_time && data.release_time.unix(),
        start_join_pool_time: data.start_join_pool_time && data.start_join_pool_time.unix(),
        end_join_pool_time: data.end_join_pool_time && data.end_join_pool_time.unix(),

        // Types
        accept_currency: data.acceptCurrency,
        network_available: data.networkAvailable,
        buy_type: data.buyType,
        pool_type: data.poolType,

        // Tier
        min_tier: data.minTier,
        tier_configuration: tierConfiguration,

      };

      let response;
      if (isEdit) {
        response = await updatePool(submitData, poolDetail.id);
      } else {
        response = await createPool(submitData);
      }
      setLoading(false);

      if (response?.status === 200) {
        dispatch(alertSuccess('Successful!'));
        history.push(adminRoute('/campaigns'));
      } else {
        dispatch(alertFailure('Fail!'));
      }
    } catch (e) {
      setLoading(false);
      console.log('ERROR: ', e);
    }
  };

  const handleCampaignCreate = () => {
    handleSubmit(handleFormSubmit)();
  };

  const renderError = renderErrorCreatePool;

  console.log('errors==========>', errors);

  return (
  <>
    <div className="contentPage">
      <Grid container spacing={2}>
        <Grid item xs={6}>


          <div className="">
            <div className={classes.exchangeRate}>
              <PoolName
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />
              <PoolBanner
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />
            </div>

            <div className={classes.exchangeRate}>
              <TokenAddress
                poolDetail={poolDetail}
                register={register}
                token={token}
                setToken={setToken}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                watch={watch}
              />

              <TotalCoinSold
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

              <TokenLogo
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

              <AddressReceiveMoney
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
              />

            </div>

            <div className={classes.exchangeRate}>
              <BuyType
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

              <PoolType
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

              <NetworkAvailable
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

              <AcceptCurrency
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
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
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
                getValues={getValues}
              />
            </div>


            <div className={classes.exchangeRate}>
              <MinTier
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

              <TierTable
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                // renderError={renderError}
                control={control}
              />
            </div>




            <div className={classes.exchangeRate}>
              <PoolDescription
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                renderError={renderError}
                control={control}
              />

            </div>


            <ExchangeRate
              poolDetail={poolDetail}
              register={register}
              token={token}
              setValue={setValue}
              errors={errors}
              clearErrors={clearErrors}
            />


            <button disabled={loading} className={classes.formButton} onClick={handleCampaignCreate}>
              {
                loading ? <CircularProgress size={25} />: "Create New"
              }
            </button>

          </div>


        </Grid>

        <Grid item xs={6}>
          {isEdit && poolDetail && poolDetail.buy_type === 'whitelist' &&
            <div className={classes.exchangeRate}>
              <UserJoinPool
                poolDetail={poolDetail}
                register={register}
                token={token}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
                control={control}
              />
            </div>
          }
        </Grid>

      </Grid>
    </div>

  </>
  );
}

export default withRouter(PoolForm);
