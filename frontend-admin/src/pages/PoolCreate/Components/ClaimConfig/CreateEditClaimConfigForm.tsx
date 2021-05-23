import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {Controller, useForm} from "react-hook-form";
import {DatePicker} from 'antd';
import moment from "moment";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import {DATETIME_FORMAT} from "../../../../constants";
import {fieldMustBeGreaterThanZero, renderErrorCreatePool} from "../../../../utils/validate";
import BigNumber from 'bignumber.js';
import TableCell from "@material-ui/core/TableCell";

function CreateEditClaimConfigForm(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, isEdit,
    handleCreateUpdateData,
  } = props;
  const renderError = renderErrorCreatePool;
  console.log('editData', editData);
  const {
    register, setValue, getValues, clearErrors, errors, handleSubmit, control,
    formState: { touched, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData,
      startTime: isEdit ? moment(editData.startTime, DATETIME_FORMAT) : null,
      // endTime: isEdit ? moment(editData.endTime, DATETIME_FORMAT) : null,
    },
  });

  const submitData = (data: any) => {
    const responseData = {
      startTime: data.startTime.format(DATETIME_FORMAT),
      // endTime: data.endTime.format(DATETIME_FORMAT),
      // minBuy: data.minBuy,
      maxBuy: data.maxBuy,
    };
    handleCreateUpdateData && handleCreateUpdateData(responseData);
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
        // btnLoading={true}
      >

        {/*{isEdit &&*/}
        {/*  <div className={classes.formControl}>*/}
        {/*    <label className={classes.formControlLabel}>Record No.</label>*/}
        {/*    <input*/}
        {/*      type="text"*/}
        {/*      value={editData.id}*/}
        {/*      className={classes.formControlInput}*/}
        {/*      disabled={true}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*}*/}


        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Start Time</label>
          <div >
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="startTime"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm"
                    }}
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    minuteStep={15}
                  />
                )
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'startTime')
            }
          </p>
        </div>


        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Max Percent Claim</label>
          <div>
            <CurrencyInputWithValidate
              register={register}
              errors={errors}
              initValue={editData.maxBuy}
              controlName={'maxBuy'}
              validateRule={{
                required: true,
                validate: {
                  maxBuyGreaterThanZero: fieldMustBeGreaterThanZero
                },
              }}
            />
          </div>

          {/*<CurrencyInput*/}
          {/*  placeholder="Please enter a number"*/}
          {/*  value={maxBuy}*/}
          {/*  decimalsLimit={2}*/}
          {/*  onValueChange={(value: any, name: any) => {*/}
          {/*    setMaxBuy(value);*/}
          {/*  }}*/}
          {/*  className={`${classes.formInputBox}`}*/}
          {/*/>*/}
          {/*<input*/}
          {/*  type='hidden'*/}
          {/*  name="maxBuy"*/}
          {/*  value={maxBuy || ''}*/}
          {/*  ref={register({ required: true })}*/}
          {/*/>*/}

          {/*<p className={classes.formErrorMessage}>*/}
          {/*  {*/}
          {/*    renderError(errors, 'maxBuy')*/}
          {/*  }*/}
          {/*</p>*/}
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'maxBuyGreaterThanZero')
            }
          </p>
        </div>


      </ConfirmDialog>

    </>
  );
}

export default CreateEditClaimConfigForm;
