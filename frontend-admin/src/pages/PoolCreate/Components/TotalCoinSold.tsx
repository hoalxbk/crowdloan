import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
// @ts-ignore
import CurrencyInput from 'react-currency-input-field';
import {fieldMustBeGreaterThanZero, renderErrorCreatePool} from "../../../utils/validate";
import BigNumber from "bignumber.js";

function TotalCoinSold(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors,
    poolDetail
  } = props;
  const [totalSoldCoin, setTotalSoldCoin] = useState('');
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.total_sold_coin) {
      setTotalSoldCoin(poolDetail.total_sold_coin);
    }
  }, [poolDetail]);

  const handleChange = (value: any, name: any) => {
    setTotalSoldCoin(value);
    setValue('totalSoldCoin', value, { shouldValidate: true })
  };
  // const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <br/>
      <FormControl component="fieldset">

        <label className={classes.formControlLabel}>Total Sold Coin</label>
        <CurrencyInput
          id="totalSoldCoin"
          placeholder="Please enter a number"
          value={totalSoldCoin}
          decimalsLimit={2}
          onValueChange={handleChange}
          className={`${classes.formInputBox}`}
          // disabled={isDeployed}
        />
        <input
          type='hidden'
          name="totalSoldCoin"
          value={totalSoldCoin || ''}
          ref={register({
            required: true,
            validate: {
              totalSoldCoinGreaterThanZero: fieldMustBeGreaterThanZero
            }
          })}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'totalSoldCoin')
          }
        </p>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'totalSoldCoinGreaterThanZero')
          }
        </p>

      </FormControl>
    </>
  );
}

export default TotalCoinSold;
