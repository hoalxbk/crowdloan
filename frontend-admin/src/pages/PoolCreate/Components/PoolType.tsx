import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {POOL_TYPE} from "../../../constants";

function PoolType(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.pool_type) {
      setValue('poolType', poolDetail.pool_type, { shouldValidate: true });
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Pool Type</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue={POOL_TYPE.CLAIMABLE}
            name="poolType"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value={POOL_TYPE.CLAIMABLE} control={<Radio />}
                  label="Claimable"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={POOL_TYPE.SWAP} control={<Radio />}
                  label="Swap"
                  disabled={isDeployed}
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
