import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import {useCommonStyle} from "../../../styles";

function DateTimePickerWithValidate(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    errors, control, setValue, controlName,
    validateRules, disabled,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div style={{marginBottom: 25}}>
        <Controller
          control={control}
          rules={validateRules}
          name={controlName}
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
                disabled={disabled}
              />
            )
          }}
        />
      </div>
      <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
        {
          renderError(errors, controlName)
        }
      </div>
    </>
  );
}

export default DateTimePickerWithValidate;
