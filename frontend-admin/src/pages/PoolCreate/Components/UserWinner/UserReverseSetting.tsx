import React, {useState} from 'react';
import {useCommonStyle} from "../../../../styles";
import {withRouter} from "react-router";
import {fieldMustBeGreaterThanZero, renderErrorCreatePool} from "../../../../utils/validate";
import {Controller, useForm} from "react-hook-form";
import moment from "moment";
import {DATETIME_FORMAT} from "../../../../constants";
import Grid from "@material-ui/core/Grid";
import {DatePicker} from "antd";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import useStyles from "../../style";
import Button from "@material-ui/core/Button";
import {CircularProgress} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {updateReserveSetting} from "../../../../request/participants";

function UserReverseSetting(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const commonStyle = useCommonStyle();
  const renderError = renderErrorCreatePool;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const {
    poolDetail, initTier,
  } = props;

  const [defaultSetting, setDefaultSetting] = useState({
    ...initTier,
    startTime: moment.unix(initTier.start_time).format(DATETIME_FORMAT),
    start_time: moment.unix(initTier.start_time).format(DATETIME_FORMAT),
    endTime: moment.unix(initTier.end_time).format(DATETIME_FORMAT),
    end_time: moment.unix(initTier.end_time).format(DATETIME_FORMAT),
    minBuy: initTier.min_buy,
    maxBuy: initTier.max_buy,
  });

  const {
    register, setValue, getValues, clearErrors, errors, handleSubmit, control,
    formState: { touched, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...defaultSetting,
      startTime: moment(defaultSetting.startTime, DATETIME_FORMAT),
      endTime: moment(defaultSetting.endTime, DATETIME_FORMAT),
    },
  });

  const submitData = (data: any) => {
    const submitData = {
      ...data,
      startTime: data.startTime.format(DATETIME_FORMAT),
      endTime: data.endTime.format(DATETIME_FORMAT),
    };
    updateReserveSetting(submitData)
      .then((res) => {
        console.log('updateTierSetting: ', res);
        if (res && res.status !== 200) {
          console.log('Error: ', res);
          dispatch(alertFailure('Update setting Fail'));
          return false;
        }
        dispatch(alertSuccess(res.message || 'Successful'));
      })
      .catch(e => {
        console.log('Error: ', e);
        dispatch(alertFailure('Update setting Fail'));
      });
  };

  const onConfirm = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want save setting ?')) {
      return true;
    }
    setConfirmLoading(true);
    return handleSubmit(submitData)()
      .then((res) => {
        console.log('Res: ', isValid, errors);
        if (isValid) {
          clearErrors();
        }
        setConfirmLoading(false);
      })
      .catch(e => {
        console.log('Error: ', e);
        setConfirmLoading(false);
      });
  };

  const [showNumberInput, setShowNumberInput] = useState(true);
  const onCancel = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want reset setting ?')) {
      return true;
    }

    setValue('startTime', moment(initTier.start_time));
    setValue('endTime', moment(initTier.end_time));
    setShowNumberInput(false);
    setTimeout(() => {
      setValue('minBuy', initTier.min_buy);
      setValue('maxBuy', initTier.max_buy);
      setShowNumberInput(true);
    }, 200);
  };

  return (
    <>
      <div style={{
        border: '1px solid gray',
        marginTop: 20,
        padding: '10px 15px 24px 15px',
        borderRadius: 10,
      }}>

        <Grid container>
          <Grid item xs={6}>

            <div className={classes.formControl}>
              <label className={classes.formControlLabel}>Start Buy Time</label>
              <div>
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
                          // @ts-ignore
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
              <label className={classes.formControlLabel}>Min Buy</label>
              <div>
                {showNumberInput &&
                  <CurrencyInputWithValidate
                    register={register}
                    errors={errors}
                    initValue={defaultSetting.minBuy}
                    controlName={'minBuy'}
                    validateRule={{
                      required: true,
                      validate: {
                        // minBuyGreaterMaxBuy: (value: any) => {
                        //   const maxBuy = getValues('maxBuy');
                        //   const maxBuyBigNumber = (new BigNumber(maxBuy));
                        //   return maxBuyBigNumber.comparedTo(value) > 0;
                        // },
                        // greaterThanZero: fieldMustBeGreaterThanZero,
                      },
                    }}
                  />
                }
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

          </Grid>
        </Grid>


        <Grid container>
          <Grid item xs={6}>
            <div className={classes.formControl}>
              <label className={classes.formControlLabel}>End Buy Time</label>
              <div>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    validate: {
                      // greateOrEqualStartTime: value => {
                      //   const startTime = getValues('startTime');
                      //   const valueUnix = moment(value).unix();
                      //   const startTimeUnix = moment(startTime).unix();
                      //   console.log('Validate Finish Time', valueUnix, startTimeUnix);
                      //
                      //   return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                      // }
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
                          // @ts-ignore
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

          <Grid item xs={6}>
            <div className={classes.formControl}>
              <label className={classes.formControlLabel}>Max Buy</label>
              <div>
                {showNumberInput &&
                  <CurrencyInputWithValidate
                    register={register}
                    errors={errors}
                    initValue={defaultSetting.maxBuy}
                    controlName={'maxBuy'}
                    validateRule={{
                      required: true,
                      validate: {
                        maxBuyGreaterThanZero: fieldMustBeGreaterThanZero
                      },
                    }}
                  />
                }
              </div>
            </div>

          </Grid>
        </Grid>



        <Button variant="contained" disabled={confirmLoading} onClick={onConfirm} color="primary"
          style={{
            marginRight: 20,
          }}
        >
          Submit
          {
            confirmLoading && <CircularProgress size={25} style={{ marginLeft: 10 }} />
          }
        </Button>
        <Button variant="contained" disabled={confirmLoading} onClick={onCancel} color="secondary">
          Reset
        </Button>


      </div>
    </>
  );
}

export default withRouter(UserReverseSetting);

