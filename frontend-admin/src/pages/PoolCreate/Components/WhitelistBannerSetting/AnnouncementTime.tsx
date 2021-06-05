import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import {DATETIME_FORMAT} from "../../../../constants";

function AnnouncementTime(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, control,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  // const isDeployed = !!poolDetail?.is_deploy;

  useEffect(() => {
    if (poolDetail && poolDetail.whitelistBannerSetting) {
      setValue('announcement_time', moment.unix(poolDetail.whitelistBannerSetting.announcement_time));
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Announcement Time</label>
        <div >
          <Controller
            control={control}
            rules={{
              // required: true,
            }}
            name="announcement_time"
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
            renderError(errors, 'announcement_time')
          }
        </p>
      </div>
    </>
  );
}

export default AnnouncementTime;
