import React, {useEffect, useState} from 'react';
import {Grid, Tooltip, Typography} from "@material-ui/core";
import BigNumber from "bignumber.js";
import CurrencyInput from "react-currency-input-field";
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {ACCEPT_CURRENCY} from "../../../constants";
import ExchangeRateUSDTDisplay from "./ExchangeRateUSDTDisplay";
import ExchangeRateETH from "./ExchangeRateETH";
import ExchangeRateDisplayPriceSwitch from "./ExchangeRateDisplayPriceSwitch";

function ExchangeRate(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, errors, control, watch,
    poolDetail,
    token
  } = props;

  return (
    <div className={classes.exchangeRate}>
      <ExchangeRateDisplayPriceSwitch
        poolDetail={poolDetail}
        register={register}
        token={token}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <ExchangeRateETH
        poolDetail={poolDetail}
        register={register}
        token={token}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <ExchangeRateUSDTDisplay
        poolDetail={poolDetail}
        register={register}
        token={token}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <p className={classes.exchangeRateDesc}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
}

export default ExchangeRate;
