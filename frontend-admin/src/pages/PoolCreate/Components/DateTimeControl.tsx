import React from 'react';
import moment from "moment";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";
import {useCommonStyle} from "../../../styles";

function DateTimeControl(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    controlName,
  } = props;

  return (
    <>
      <div style={{marginBottom: 15}}>
        <Controller
          control={control}
          rules={{ required: true }}
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
          renderErrorCreatePool(errors, controlName)
        }
      </div>
    </>
  );
}

export default DateTimeControl;
