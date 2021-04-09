import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";

function NetworkAvailable(props: any) {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;

  useEffect(() => {
    if (poolDetail && poolDetail.network_available) {
      setValue('networkAvailable', poolDetail.network_available);
    }
  }, [poolDetail]);

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
                  value="eth" control={<Radio />}
                  label="Ether"
                />
                <FormControlLabel
                  value="bsc" control={<Radio />}
                  label="BSC"
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
