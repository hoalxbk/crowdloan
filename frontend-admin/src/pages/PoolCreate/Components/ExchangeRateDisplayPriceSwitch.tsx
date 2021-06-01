import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {Switch} from 'antd';
import {changeDisplayStatus} from "../../../request/pool";
import {alertSuccess} from "../../../store/actions/alert";
import {withRouter} from "react-router";
import {useDispatch} from "react-redux";
import {getIconCurrencyUsdt} from "../../../utils/usdt";

function ExchangeRateDisplayPriceSwitch(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control, watch,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const dispatch = useDispatch();

  useEffect(() => {
    if (poolDetail && (poolDetail.display_price_rate != undefined)) {
      setValue('display_price_rate', !!poolDetail.display_price_rate);
    }
  }, [poolDetail]);

  const changeDisplay = async (value: any) => {
    const res = await changeDisplayStatus({
      poolId: poolDetail.id,
      isDisplay: value,
    });
    console.log('Change display: Response: ', res);
    if (res.status === 200) {
      dispatch(alertSuccess('Change display setting successful!'));
    }
    return value;
  };
  const acceptCurrency = watch('acceptCurrency');
  const networkAvailable = watch('networkAvailable');
  let { currencyIcon, currencyName } = getIconCurrencyUsdt({
    purchasableCurrency: acceptCurrency,
    networkAvailable: networkAvailable,
  });

  return (
    <>
      <div style={{
        marginTop: 30,
        // marginBottom: 30,
      }}>
        <div><label className={classes.exchangeRateTitle}>Display {currencyName} Exchange Rate</label></div>
        <FormControl component="fieldset">
          <Controller
            control={control}
            name="display_price_rate"
            render={(field) => {
              const { value, onChange } = field;
              return (
                <Switch
                  onChange={ async (switchValue) => {
                    await onChange(switchValue);
                    // await changeDisplay(switchValue);
                  }}
                  checked={value}
                  checkedChildren="Display"
                  unCheckedChildren="Hidden"
                />
              )
            }}
          />

          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'display_price_rate')
            }
          </p>
        </FormControl>
      </div>
      <br/>
    </>
  );
}

export default withRouter(ExchangeRateDisplayPriceSwitch);
