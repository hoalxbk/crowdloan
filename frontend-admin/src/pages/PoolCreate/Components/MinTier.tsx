import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import { Controller, useForm } from "react-hook-form";
import { TextField, Select, RadioGroup, Radio, MenuItem } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {imageRoute} from "../../../utils";

function MinTier(props: any) {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;

  useEffect(() => {
    if (poolDetail && poolDetail.min_tier) {
      setValue('minTier', poolDetail.min_tier);
    }
  }, [poolDetail]);

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
            >
              {
                [1,2,3,4,5].map((value, index) => {
                  return (
                    <MenuItem
                      key={value}
                      value={value}
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
