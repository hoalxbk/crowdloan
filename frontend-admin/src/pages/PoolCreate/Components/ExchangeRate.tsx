import React, {useEffect} from 'react';
import {Tooltip, Typography} from "@material-ui/core";
import BigNumber from "bignumber.js";
import {
  isNotValidASCIINumber,
  isPreventASCIICharacters,
  trimLeadingZerosWithDecimal
} from "../../../utils/formatNumber";
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";

function ExchangeRate(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();

  const {
    register, setValue, errors,
    poolDetail,
    token
  } = props;

  useEffect(() => {
    if (poolDetail && poolDetail.ether_conversion_rate) {
      setValue('tokenByETH', poolDetail.ether_conversion_rate);
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
            <button className={classes.box}>ETH</button>
          </div>
        </div>
        <img className={classes.formControlIcon} src="/images/icon-exchange.svg" alt="" />
        <div className={classes.formControlFlexBlock}>
          <label className={`${classes.formControlLabel} ${classes.formControlBlurLabel}`}>You get*</label>
          <div className={classes.formControlRate}>
            <input
              type="text"
              name="tokenByETH"
              ref={register({
                required: true,
                validate: {
                  min: (value: any) => new BigNumber(value).comparedTo(0) > 0,
                  maxDecimals: checkMaxEthRateDecimals
                }
              })}
              maxLength={255}
              onKeyDown={(e: any) => isNotValidASCIINumber(e.keyCode, true) && e.preventDefault()}
              onKeyPress={(e: any) => isPreventASCIICharacters(e.key) && e.preventDefault()}
              onBlur={(e: any) => setValue('tokenByETH', trimLeadingZerosWithDecimal(e.target.value))}
              onPaste={(e: any) => {
                const pastedText = e.clipboardData.getData("text");

                if (isNaN(Number(pastedText))) {
                  e.preventDefault();
                }
              }}
              className={`${classes.formInputBox} ${classes.formInputBoxBS}`}
            />
            <Tooltip title={token?.symbol || ""}>
              <button className={`${classes.box} ${classes.boxEther}`}>
                {token?.symbol || ""}
              </button>
            </Tooltip>
            <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
              {
                renderErrorMinMax(errors, 'tokenByETH', 0, 100)
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
