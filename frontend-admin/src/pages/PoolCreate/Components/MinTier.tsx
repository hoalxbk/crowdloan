import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import { Controller, useForm } from "react-hook-form";
import { TextField, Select, RadioGroup, Radio, MenuItem } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {imageRoute} from "../../../utils";
import {renderErrorCreatePool} from "../../../utils/validate";

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
          defaultValue={0}
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
                [1,2,3,4,5].map((value, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={index}
                    >
                      {'Tier ' + value}
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
