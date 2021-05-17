import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {NETWORK_AVAILABLE} from "../../../constants";

function NetworkAvailable(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.network_available) {
      setValue('networkAvailable', poolDetail.network_available);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Network Available</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue="eth"
            name="networkAvailable"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value={NETWORK_AVAILABLE.ETH} control={<Radio />}
                  label="Ether"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.BSC} control={<Radio />}
                  label="BSC"
                  disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'networkAvailable')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default NetworkAvailable;
