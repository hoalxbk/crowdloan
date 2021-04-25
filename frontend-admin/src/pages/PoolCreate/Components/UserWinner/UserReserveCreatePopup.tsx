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



        <Grid container spacing={3}>
          <Grid item xs={6}>
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

          </Grid>

          <Grid item xs={6}>
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
                  renderError(errors, 'endTime')
                }
              </p>
            </div>

          </Grid>
        </Grid>



        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Min Buy</label>
          <div>
            <CurrencyInputWithValidate
              register={register}
              errors={errors}
              initValue={editData.minBuy}
              controlName={'minBuy'}
              validateRule={{
                required: true,
                validate: {
                  minBuyGreaterMaxBuy: (value: any) => {
                    const maxBuy = getValues('maxBuy');
                    const maxBuyBigNumber = (new BigNumber(maxBuy));
                    return maxBuyBigNumber.comparedTo(value) > 0;
                  },
                  greaterThanZero: fieldMustBeGreaterThanZero,
                },
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'minBuyGreaterMaxBuy')
            }
          </p>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'greaterThanZero')
            }
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Max Buy</label>
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
        </div>



      </ConfirmDialog>

    </>
  );
}

export default UserReserveCreatePopup;
