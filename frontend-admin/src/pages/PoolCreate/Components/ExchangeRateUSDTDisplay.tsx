import React, {useEffect, useState} from 'react';
import {Tooltip, Typography} from "@material-ui/core";
import BigNumber from "bignumber.js";
import CurrencyInput from "react-currency-input-field";
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {ACCEPT_CURRENCY} from "../../../constants";

function ExchangeRateUSDTDisplay(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, errors, control, watch,
    poolDetail,
    token
  } = props;
  const [rateValue, setRateValue] = useState('0');

  useEffect(() => {
    if (poolDetail) {
      const price_usdt = new BigNumber(poolDetail?.price_usdt || 0).toFixed();
      setValue('price_usdt', price_usdt);
      setRateValue(price_usdt);
    }
  }, [poolDetail]);

  const renderErrorMinMax = (errors: any, prop: string, min: number, max: number = 100) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required';
      } else if (errors[prop].type === "min") {
        return `This field must be greater than ${min}`;
      } else if (errors[prop].type === "max") {
        return `This field must be less than ${max}`;
      } else if (errors[prop].type === 'maxDecimals') {
        return `Decimals can not greater than 8`;
      }
    }
  };

  // const isDeployed = !!poolDetail?.is_deploy;

  return (
    <div style={{
      paddingTop: 30,
    }}>
      <Typography className={classes.exchangeRateTitle}>USD Display Rate</Typography>
      <div className={classes.formControlFlex}>

        <div className={classes.formControlFlexBlock}>
          <label className={`${classes.formControlLabel} ${classes.formControlBlurLabel}`}>You have</label>

          <div className={classes.formControlRate}>
            <input
              type="number"
              name="usdtFor"
              disabled={true}
              value={1}
              className={`${classes.formInputBox} ${classes.formInputBoxEther}`}
            />
            <button className={classes.box}>{token?.symbol || ""}</button>
          </div>
        </div>




        <img className={classes.formControlIcon} src="/images/icon-exchange.svg" alt="" />
        <div className={classes.formControlFlexBlock}>
          <label className={`${classes.formControlLabel} ${classes.formControlBlurLabel}`}>You get*</label>
          <div className={classes.formControlRate}>
            <CurrencyInput
              value={rateValue}
              decimalsLimit={6}
              maxLength={25}
              onValueChange={(value: any, name: any) => {
                setRateValue(value);
              }}
              className={`${classes.formInputBox} ${classes.formInputBoxBS}`}
              // disabled={isDeployed}
            />

            <input
              type='hidden'
              name={'price_usdt'}
              value={rateValue}
              ref={register({
                // required: true,
                validate: {
                  min: (value: any) => new BigNumber(value).comparedTo(0) > 0,
                }
              })}
              // disabled={isDeployed}
            />


            <Tooltip title={'USDT'}>
              <button className={`${classes.box} ${classes.boxEther}`}>
                USD
              </button>
            </Tooltip>
            <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
              {
                renderErrorMinMax(errors, 'price_usdt', 0, 100000000)
              }
            </div>
          </div>
        </div>

      </div>



    </div>
  );
}

export default ExchangeRateUSDTDisplay;
