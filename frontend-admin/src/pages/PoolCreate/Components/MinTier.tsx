import React, {useEffect} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {MenuItem, Select} from "@material-ui/core";
import {renderErrorCreatePool} from "../../../utils/validate";
import {TIERS} from "../../../constants";

function MinTier(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.min_tier) {
      setValue('minTier', poolDetail.min_tier);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <FormControl component="fieldset">
        <label className={classes.formControlLabel}>Min Tier</label>
        <Controller
          rules={{ required: true }}
          control={control}
          defaultValue={1}
          name="minTier"
          as={
            <Select
              labelId="minTier"
              id="minTier"
              name="minTier"
              // onChange={handleChange}
              disabled={isDeployed}
            >
              {
                TIERS.map((value, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={index}
                    >
                      {value}
                    </MenuItem>
                  )
                })
              }
            </Select>
          }
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'minTier')
          }
        </p>
      </FormControl>
      <br/>
    </>
  );
}

export default MinTier;
