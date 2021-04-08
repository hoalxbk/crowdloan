import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";

function PoolType(props: any) {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;

  useEffect(() => {
    if (poolDetail && poolDetail.pool_type) {
      setValue('poolType', poolDetail.pool_type);
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Pool Type</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue="swap"
            name="poolType"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value="swap" control={<Radio />}
                  label="Swap"
                />
                <FormControlLabel
                  value="claimable"
                  control={<Radio />}
                  label="Claimable"
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'poolType')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default PoolType;
