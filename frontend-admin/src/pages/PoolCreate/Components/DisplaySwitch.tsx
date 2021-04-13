import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {Switch} from 'antd';

function DisplaySwitch(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, control,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && (poolDetail.is_display != undefined)) {
      console.log('poolDetail.is_display: ', poolDetail.is_display);
      setValue('is_display', !!poolDetail.is_display);
    }
  }, [poolDetail]);

  return (
    <>
      <FormControl component="fieldset">
        <label className={classes.formControlLabel}>Display</label>
        <Controller
          control={control}
          name="is_display"
          render={({ value, onChange }) => (
            <Switch onChange={onChange} checked={value} />
          )}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'is_display')
          }
        </p>
      </FormControl>
      <br/>
    </>
  );
}

export default DisplaySwitch;
