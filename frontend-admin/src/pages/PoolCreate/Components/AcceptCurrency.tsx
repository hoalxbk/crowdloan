import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {getTiers} from "../../../request/tier";
import {renderErrorCreatePool} from "../../../utils/validate";
import {NETWORK_AVAILABLE} from "../../../constants";

function AcceptCurrency(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control, watch,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.accept_currency) {
      setValue('acceptCurrency', poolDetail.accept_currency);
    }
  }, [poolDetail]);

  useEffect(() => {
    if (poolDetail && poolDetail.id) {
      getTiers(poolDetail.id)
        .then((res) => {
        });
    }
  }, [poolDetail]);

  const isDeployed = !!poolDetail?.is_deploy;
  const networkAvailable = watch('networkAvailable');
  let isBscNetworks = networkAvailable === NETWORK_AVAILABLE.BSC;
  // console.log('userCurrentNetwork', isBscNetworks);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Accept Currency</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue="usdt"
            name="acceptCurrency"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value="usdt" control={<Radio />}
                  label={isBscNetworks ? 'BUSD' : 'USDT'}
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value="usdc" control={<Radio />}
                  label="USDC"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value="eth" control={<Radio />}
                  label={isBscNetworks ? 'BNB' : 'ETH'}
                  disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'acceptCurrency')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default AcceptCurrency;
