import React, {useEffect, useState} from 'react';
import {Tooltip, Typography} from "@material-ui/core";
import BigNumber from "bignumber.js";
import CurrencyInput from "react-currency-input-field";
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {ACCEPT_CURRENCY} from "../../../constants";

function ExchangeRate(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, errors, control, watch,
    poolDetail,
    token
  } = props;
  const [rateValue, setRateValue] = useState(0);

  useEffect(() => {
    if (poolDetail) {
      if (poolDetail.accept_currency === ACCEPT_CURRENCY.ETH) {
        setValue('tokenRate', poolDetail.ether_conversion_rate);
        setRateValue(poolDetail.ether_conversion_rate);
      } else {
        // poolDetail.ether_conversion_rate
        setValue('tokenRate', poolDetail.token_conversion_rate || 1);
        setRateValue(poolDetail.token_conversion_rate || 1);
      }
    }
  }, [poolDetail]);

  const checkMaxEthRateDecimals = (amount: any) => {
    let validMaxAmountDecimals = true;
    const decimalsAmountBuyUnit = 8;
    if (amount.includes('.')) {
      const amountSplit = amount.split('.');
      const amountDecimals = amountSplit.pop();
      if (amountDecimals.length > decimalsAmountBuyUnit) {
        validMaxAmountDecimals = false;
      }
    }

    return validMaxAmountDecimals;
  };

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

  const acceptCurrency = watch('acceptCurrency');
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <div className={classes.exchangeRate}>
      <Typography className={classes.exchangeRateTitle}>Exchange Rates</Typography>
      <div className={classes.formControlFlex}>






        <div className={classes.formControlFlexBlock}>
          <label className={`${classes.formControlLabel} ${classes.formControlBlurLabel}`}>You have</label>


          <div className={classes.formControlRate}>
            <input
              type="number"
              name="ethFor"
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
              disabled={isDeployed}
            />

            <input
              type='hidden'
              name={'tokenRate'}
              value={rateValue}
              ref={register({
                required: true,
                validate: {
                  min: (value: any) => new BigNumber(value).comparedTo(0) > 0,
                  // maxDecimals: checkMaxEthRateDecimals
                }
              })}
              disabled={isDeployed}
            />


            <Tooltip title={(acceptCurrency + '').toUpperCase()}>
              <button className={`${classes.box} ${classes.boxEther}`}>
                {(acceptCurrency + '').toUpperCase()}
              </button>
            </Tooltip>
            <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
              {
                renderErrorMinMax(errors, 'tokenRate', 0, 100)
              }
            </div>
          </div>
        </div>

      </div>









      <p className={classes.exchangeRateDesc}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
}

export default ExchangeRate;
