import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";

function BuyType(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.buy_type) {
      setValue('buyType', poolDetail.buy_type);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Buy Type</label>
          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue="whitelist"
            name="buyType"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value="whitelist" control={<Radio />}
                  label="Whitelist Lottery"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value="fcfs" control={<Radio />}
                  label="FCFS"
                  disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'buyType')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default BuyType;
