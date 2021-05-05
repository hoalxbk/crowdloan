import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {Controller, useForm} from "react-hook-form";
import {DatePicker} from 'antd';
import moment from "moment";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import {DATETIME_FORMAT} from "../../../../constants";
import {fieldMustBeGreaterThanZero, renderErrorCreatePool} from "../../../../utils/validate";
import BigNumber from "bignumber.js";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

function UserReserveCreatePopup(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, isEdit,
    handleCreateUpdateData,
  } = props;
  const renderError = renderErrorCreatePool;

  const {
    register, setValue, getValues, clearErrors, errors, handleSubmit, control,
    formState: { touched, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData,
      startTime: isEdit ? moment(editData.startTime, DATETIME_FORMAT) : null,
      endTime: isEdit ? moment(editData.endTime, DATETIME_FORMAT) : null,
    },
  });

  const submitData = (data: any) => {
    handleCreateUpdateData && handleCreateUpdateData(data);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)()
      .then((res) => {
        console.log('Res: ', isValid, errors);
        if (isValid) {
          clearErrors();
        }
      });
  };

  return (
    <>
      <ConfirmDialog
        title={isEdit ? 'Edit' : 'Create'}
        open={isOpenEditPopup}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => { setIsOpenEditPopup(false); clearErrors() }}
      >

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Email</label>
          <input
            type="email"
            name="email"
            ref={register({ required: true })}
            maxLength={255}
            className={classes.formControlInput}
          />
        </div>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'email')
          }
        </p>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Wallet address</label>
          <input
            name="wallet_address"
            ref={register({ required: true })}
            maxLength={255}
            className={classes.formControlInput}
          />
        </div>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'wallet_address')
          }
        </p>

      </ConfirmDialog>

    </>
  );
}

export default UserReserveCreatePopup;
