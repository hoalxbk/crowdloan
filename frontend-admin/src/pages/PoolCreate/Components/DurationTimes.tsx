import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import {imageRoute} from "../../../utils";
import {DATETIME_FORMAT} from "../../../constants";

function DurationTime(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const [ startTime, setStartTime ] = useState<Date | null>(null);
  const [ finishTime, setFinishTime ] = useState<Date | null>(null);
  const [ releaseTime, setReleaseTime ] = useState<Date | null>(null);

  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;

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

  const handleDatePicking = (datePicker: string, selectedDate: Date | Date[]) => {
    if (selectedDate) {
      clearErrors(datePicker);
    };
    setValue(datePicker, selectedDate);
  };

  return (
    <>

      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start Join Pool Time</label>
          <div style={{marginBottom: 15}}>
            <Controller
              control={control}
              rules={{
                // required: true
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
          <div style={{marginBottom: 15}}>
            <Controller
              control={control}
              rules={{
                // required: true
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
                // required: true
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
                // required: true
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
              // required: true
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
