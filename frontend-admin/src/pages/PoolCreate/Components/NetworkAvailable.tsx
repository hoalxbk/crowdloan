import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {
  BSC_NETWORK_ACCEPT_CHAINS,
  CHAIN_ID_NAME_MAPPING,
  ETH_NETWORK_ACCEPT_CHAINS,
  NETWORK_AVAILABLE
} from "../../../constants";
import {useSelector} from "react-redux";

function NetworkAvailable(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail, needValidate,
  } = props;
  const renderError = renderErrorCreatePool;
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;

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
            rules={{
              required: true,
              validate: {
                networkNotMatch: value => {
                  // Validate Only click Deploy button
                  if (!needValidate) return true;
                  let acceptNet = '';
                  if (value === 'eth') {
                    acceptNet = ETH_NETWORK_ACCEPT_CHAINS[currentNetworkId];
                  } else {
                    acceptNet = BSC_NETWORK_ACCEPT_CHAINS[currentNetworkId];
                  }
                  console.log('acceptNet', acceptNet);
                  if (!acceptNet) {
                    console.log('Network Deploy not match!!!');
                    return false;
                  }
                  return true;
                }
              }
            }}
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
            {
              renderError(errors, 'networkNotMatch')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default NetworkAvailable;
