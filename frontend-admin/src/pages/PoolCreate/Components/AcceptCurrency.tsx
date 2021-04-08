import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";

function AcceptCurrency(props: any) {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;

  useEffect(() => {
    if (poolDetail && poolDetail.accept_currency) {
      setValue('acceptCurrency', poolDetail.accept_currency);
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
            defaultValue="eth"
            name="acceptCurrency"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value="eth" control={<Radio />}
                  label="Ether"
                />
                <FormControlLabel
                  value="usdt" control={<Radio />}
                  label="USDT"
                />
                <FormControlLabel
                  value="usdc" control={<Radio />}
                  label="USDC"
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
