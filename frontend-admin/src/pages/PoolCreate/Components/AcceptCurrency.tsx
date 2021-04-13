import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {getParticipantUser} from "../../../request/participants";
import {getTiers} from "../../../request/tier";
import {renderErrorCreatePool} from "../../../utils/validate";

function AcceptCurrency(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
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
          // setPartipants(res.data);
        });
    }
  }, [poolDetail]);

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
                  label="USDT"
                />
                <FormControlLabel
                  value="usdc" control={<Radio />}
                  label="USDC"
                />
                <FormControlLabel
                  value="eth" control={<Radio />}
                  label="Ether"
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
