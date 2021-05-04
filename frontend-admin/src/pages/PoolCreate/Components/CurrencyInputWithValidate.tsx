import React, {useState} from 'react';
import CurrencyInput from "react-currency-input-field";
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function CurrencyInputWithValidate(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    initValue, controlName,
    validateRule,
  } = props;
  const renderError = renderErrorCreatePool;
  const [value, setValue] = useState(initValue);

  return (
    <>
      <CurrencyInput
        placeholder="Please enter a number"
        value={value}
        decimalsLimit={6}
        onValueChange={(value: any, name: any) => {
          setValue(value);
        }}
        className={`${classes.formInputBox}`}
      />
      <input
        type='hidden'
        name={controlName}
        value={value}
        ref={register(validateRule)}
      />

      <p className={classes.formErrorMessage}>
        {
          renderError(errors, controlName)
        }
      </p>
    </>
  );
}

export default CurrencyInputWithValidate;
