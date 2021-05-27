import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {Switch} from 'antd';
import {changeDisplayStatus} from "../../../request/pool";
import {alertSuccess} from "../../../store/actions/alert";
import {withRouter} from "react-router";
import {useDispatch} from "react-redux";

function DisplayPoolSwitch(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const dispatch = useDispatch();

  useEffect(() => {
    if (poolDetail && (poolDetail.is_display != undefined)) {
      console.log('poolDetail.is_display: ', poolDetail.is_display);
      setValue('is_display', !!poolDetail.is_display);
    }
  }, [poolDetail]);

  const changeDisplay = async (value: any) => {
    const res = await changeDisplayStatus({
      poolId: poolDetail.id,
      isDisplay: value,
    });
    console.log('Change display: Response: ', res);
    if (res.status === 200) {
      dispatch(alertSuccess('Change display setting successful!'));
    }
    return value;
  };

  return (
    <>
      <div><label className={classes.formControlLabel}>Display</label></div>
      <div style={{color: 'red'}}>Users will not see Campaigns while the campaign is in the hidden state</div>
      <FormControl component="fieldset">
        <Controller
          control={control}
          name="is_display"
          render={(field) => {
            const { value, onChange } = field;
            return (
              <Switch
                onChange={ async (switchValue) => {
                  // eslint-disable-next-line no-restricted-globals
                  if (!confirm('Do you want change display ?')) {
                    return false;
                  }
                  await onChange(switchValue);
                  await changeDisplay(switchValue);
                }}
                checked={value}
                checkedChildren="Display"
                unCheckedChildren="Hidden"
              />
            )
          }}
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

export default withRouter(DisplayPoolSwitch);
