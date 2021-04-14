import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import {DATETIME_FORMAT} from "../../../constants";
import {renderErrorCreatePool} from "../../../utils/validate";

function DurationTime(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, getValues, errors, control,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail) {
      if (poolDetail.start_time) {
        setValue('start_time', moment(poolDetail.start_time, DATETIME_FORMAT));
      }
      if (poolDetail.finish_time) {
        setValue('finish_time', moment(poolDetail.finish_time, DATETIME_FORMAT));
      }
      if (poolDetail.release_time) {
        setValue('release_time', moment(poolDetail.release_time, DATETIME_FORMAT));
      }
      if (poolDetail.start_join_pool_time) {
        setValue('start_join_pool_time', moment(poolDetail.start_join_pool_time, DATETIME_FORMAT));
      }
      if (poolDetail.end_join_pool_time) {
        setValue('end_join_pool_time', moment(poolDetail.end_join_pool_time, DATETIME_FORMAT));
      }
    }
  }, [poolDetail]);

  return (
    <>

      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start Join Pool Time</label>
          <div style={{marginBottom: 25}}>
            <Controller
              control={control}
              rules={{
                required: true,
                validate: {
                  greaterOrEqualToday: (value) => {
                    console.log(value);
                    return new Date(value) >= new Date();
                  },
                }
              }}
              name="start_join_pool_time"
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
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {
              renderError(errors, 'start_join_pool_time')
            }
          </div>
        </div>


        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>End Join Pool Time</label>
          <div style={{marginBottom: 25}}>
            <Controller
              control={control}
              rules={{
                required: true,
                validate: {
                  greateOrEqualStartJoinPoolTime: value => {
                    const startTime = getValues('start_join_pool_time');
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();
                    console.log('Validate End Join Time', valueUnix, startTimeUnix);

                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  }
                  // validDate: (value: string) => {
                  //   if (timeTypeMenu === 'start time') {
                  //     if (new Date(value) > new Date(matchedCampaign.closeTime * 1000)) {
                  //       return 'The start time must before finish time.';
                  //     } else if (new Date(value) >= new Date(matchedCampaign.releaseTime * 1000)) {
                  //       return 'The start time must before release time.';
                  //     }
                  //   } else if (timeTypeMenu === 'finish time') {
                  //     if (new Date(value) < new Date(matchedCampaign.startTime * 1000)) {
                  //       return 'The finish time must after start time.';
                  //     } else if (new Date(value) >= new Date(matchedCampaign.releaseTime * 1000)) {
                  //       return 'The finish time must before release time.';
                  //     }
                  //   } else if (timeTypeMenu === 'release time') {
                  //     if (new Date(value) < new Date(matchedCampaign.closeTime * 1000)) {
                  //       return 'The release time must after finish time.';
                  //     } else if (new Date(value) < new Date(matchedCampaign.startTime * 1000)) {
                  //       return 'The release time must after start time.';
                  //     }
                  //   }
                  //
                  //   return true;
                  // }
                }
              }}
              name="end_join_pool_time"
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
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {
              renderError(errors, 'end_join_pool_time')
            }
          </div>
        </div>
      </div>


      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start time</label>
          <div style={{marginBottom: 15}}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              name="start_time"
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
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {
              renderError(errors, 'start_time')
            }
          </div>
        </div>
        <img className={classes.formControlIcon} src="/images/icon-line.svg" alt="" />
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Finish time</label>
          <div style={{marginBottom: 15}}>
            <Controller
              control={control}
              rules={{
                required: true,
                validate: {
                  greateOrEqualStartTime: value => {
                    const startTime = getValues('start_time');
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();
                    console.log('Validate Finish Time', valueUnix, startTimeUnix);

                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  }
                }
              }}
              name="finish_time"
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
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {
              renderError(errors, 'finish_time')
            }
          </div>
        </div>
      </div>


      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Claim time</label>
        {/*<DateTimePicker*/}
        {/*  className={`${commonStyle.DateTimePicker} ${classes.formDatePicker} ${classes.formDatePickerBlock}`}*/}
        {/*  monthPlaceholder="mm"*/}
        {/*  dayPlaceholder="dd"*/}
        {/*  yearPlaceholder="yy"*/}
        {/*  calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}*/}
        {/*  value={releaseTime}*/}
        {/*  onChange={(date: any) => { handleDatePicking("release_time", date); setReleaseTime(date) }}*/}
        {/*/>*/}

        {/*<input*/}
        {/*  type="hidden"*/}
        {/*  name="release_time"*/}
        {/*  ref={register({*/}
        {/*    required: true,*/}
        {/*    validate: {*/}
        {/*      greaterOrEqualFinishTime: (value: any) => finishTime ? new Date(value) > finishTime: new Date(value)> new Date()*/}
        {/*    }*/}
        {/*  })}*/}
        {/*/>*/}

        <div style={{marginBottom: 15}}>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: {
                greaterOrEqualFinishTime: value => {
                  const startTime = getValues('finish_time');
                  const valueUnix = moment(value).unix();
                  const startTimeUnix = moment(startTime).unix();
                  console.log('Validate Claim Time', valueUnix, startTimeUnix);

                  return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                }
              }
            }}
            name="release_time"
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
                  className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                />
              )
            }}
          />
        </div>
        <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
          {
            renderError(errors, 'release_time')
          }
        </div>
      </div>

    </>
  );
}

export default DurationTime;
