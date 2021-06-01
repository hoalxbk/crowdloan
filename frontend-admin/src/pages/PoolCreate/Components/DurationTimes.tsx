import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import {BUY_TYPE, DATETIME_FORMAT, POOL_TYPE} from "../../../constants";
import {renderErrorCreatePool} from "../../../utils/validate";
import {campaignClaimConfigFormat} from "../../../utils/campaign";

function DurationTime(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, getValues, errors, control, watch,
    poolDetail, needValidate,
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
  const isDeployed = !!poolDetail?.is_deploy;
  const watchBuyType = watch('buyType');
  const watchPoolType = watch('poolType');
  const isBuyTypeFCFS = watchBuyType === BUY_TYPE.FCFS;
  const isPoolTypeSwap = watchPoolType === POOL_TYPE.SWAP;

  // Convert and format campaignClaimConfig table
  const campaignClaimConfigJSON = watch('campaignClaimConfig');
  useEffect(() => {
    if (campaignClaimConfigJSON) {
      try {
        let campaignClaimConfig = campaignClaimConfigFormat(campaignClaimConfigJSON);
        // console.log('Change campaignClaimConfig: ', campaignClaimConfig);
        if (campaignClaimConfig && campaignClaimConfig.length > 0) {
          if (campaignClaimConfig[0]?.startTime) {
            let claimTimeValue = Number(campaignClaimConfig[0]?.startTime); // Format: Timestamp
            // Convert claimTimeValue from "1625072400" to Moment Object
            const claimTimeObject = moment(claimTimeValue * 1000);
            setValue('release_time', claimTimeObject);
          }
        } else {
          setValue('release_time', null);
        }
      } catch (e) {
        console.log('ERROR: ', e);
      }
    }
  }, [campaignClaimConfigJSON]);

  return (
    <>

      <div className={classes.formControlFlex}>

        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start Join Pool Time</label>
          <div style={{marginBottom: 25}}>
            <Controller
              control={control}
              rules={{
                required: (needValidate && !isBuyTypeFCFS),
                validate: {
                  // greaterOrEqualToday: (value) => {
                  //   if (isDeployed || isBuyTypeFCFS) return true;
                  //   console.log(value);
                  //   return new Date(value) >= new Date();
                  // },
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
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed || isBuyTypeFCFS}
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
                required: (needValidate && !isBuyTypeFCFS),
                validate: {
                  greateOrEqualStartJoinPoolTime: value => {
                    if (!needValidate) return true;
                    if (isDeployed || isBuyTypeFCFS) return true;
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
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed || isBuyTypeFCFS}
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
                required: needValidate
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
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed}
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
                required: (needValidate && !isBuyTypeFCFS),
                validate: {
                  greateOrEqualStartTime: value => {
                    if (!needValidate) return true;
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
                    onSelect={(datetimeSelected: any) => {
                      setValue(field.name, datetimeSelected, {shouldValidate: true});
                    }}
                    minuteStep={15}
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed}
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
        <div style={{marginBottom: 15}}>
          <Controller
            control={control}
            rules={{
              required: (needValidate && !isPoolTypeSwap),
              validate: {
                greaterOrEqualFinishTime: value => {
                  if (!needValidate) return true;
                  if (isPoolTypeSwap) return true;
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
                  onSelect={(datetimeSelected: any) => {
                    setValue(field.name, datetimeSelected, {shouldValidate: true});
                  }}
                  minuteStep={15}
                  className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                  // disabled={isDeployed || isPoolTypeSwap}
                  disabled={true} // Always disable. Fill first record of Claim Configuration to this field
                />
              )
            }}
          />
        </div>
        <div style={{ color: 'blue' }}>
          <p>
            Please config first record of Claim Configuration Table.
          </p>
          <p>
            This field will auto fill from first record of Claim Configuration Table.
          </p>
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
