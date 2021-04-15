import React from 'react';
import ConfirmDialog from "../../../components/Base/ConfirmDialog";
import useStyles from "../style";
import {Controller, useForm} from "react-hook-form";
import FormControl from "@material-ui/core/FormControl";
import {DatePicker} from 'antd';
import moment from "moment";
import CurrencyInputWithValidate from "./CurrencyInputWithValidate";
import {DATETIME_FORMAT} from "../../../constants";
import {renderErrorCreatePool} from "../../../utils/validate";

function CreateEditTierForm(props: any) {
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
    const responseData = {
      name: data.name,
      startTime: data.startTime.format(DATETIME_FORMAT),
      endTime: data.endTime.format(DATETIME_FORMAT),
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

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Name</label>
          <input
            type="text"
            name="name"
            ref={register({ required: true })}
            maxLength={255}
            className={classes.formControlInput}
            disabled={true}
          />
        </div>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'name')
          }
        </p>


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
          <label className={classes.formControlLabel}>End Time</label>
          <div >
            <Controller
              control={control}
              rules={{
                required: true,
                validate: {
                  greateOrEqualStartTime: value => {
                    const startTime = getValues('startTime');
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();
                    console.log('Validate Finish Time', valueUnix, startTimeUnix);

                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  }
                }
              }}
              name="endTime"
              render={(field) => {
                return (
                  <DatePicker
                    {...field}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: moment("00:00:00", "HH:mm:ss"),
                      format: "HH:mm"
                    }}
                    minuteStep={15}
                  />
                )
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'endTime')
            }
          </p>
        </div>





        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Max Buy</label>

          <CurrencyInputWithValidate
            register={register}
            setValue={setValue}
            errors={errors}
            clearErrors={clearErrors}
            renderError={renderError}
            control={control}
            initValue={editData.maxBuy}
            controlName={'maxBuy'}
          />


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

        </FormControl>



      </ConfirmDialog>

    </>
  );
}

export default CreateEditTierForm;