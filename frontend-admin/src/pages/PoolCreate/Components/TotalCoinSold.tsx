import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
// @ts-ignore
import CurrencyInput from 'react-currency-input-field';

function TotalCoinSold(props: any) {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;
  const [totalSoldCoin, setTotalSoldCoin] = useState('');

  useEffect(() => {
    if (poolDetail && poolDetail.total_sold_coin) {
      setTotalSoldCoin(poolDetail.total_sold_coin);
    }
  }, [poolDetail]);

  // const handleChange = (event: any, maskedvalue: any, floatvalue: any) => {
  //   setTotalSoldCoin(maskedvalue);
  // };

  return (
    <>
      <FormControl component="fieldset">

        <label className={classes.formControlLabel}>Total Sold Coin</label>
        <CurrencyInput
          id="totalSoldCoin"
          placeholder="Please enter a number"
          value={totalSoldCoin}
          decimalsLimit={2}
          onValueChange={(value: any, name: any) => {
            setTotalSoldCoin(value);
            setValue('totalSoldCoin', value, { shouldValidate: true })
          }}
          className={`${classes.formInputBox}`}
        />
        <input
          type='hidden'
          name="totalSoldCoin"
          value={totalSoldCoin || ''}
          ref={register({ required: true })}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'totalSoldCoin')
          }
        </p>

      </FormControl>
    </>
  );
}

export default TotalCoinSold;
