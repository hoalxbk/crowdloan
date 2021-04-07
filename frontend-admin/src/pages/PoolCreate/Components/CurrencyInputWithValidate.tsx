import React, {useState} from 'react';
import CurrencyInput from "react-currency-input-field";
import useStyles from "../style";

function CurrencyInputWithValidate(props: any) {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control, renderError,
    initValue, controlName,
  } = props;
  const [value, setMaxBuy] = useState(initValue);

  return (
    <>
      <CurrencyInput
        placeholder="Please enter a number"
        value={value}
        decimalsLimit={2}
        onValueChange={(value: any, name: any) => {
          setMaxBuy(value);
        }}
        className={`${classes.formInputBox}`}
      />
      <input
        type='hidden'
        name={controlName}
        value={value || ''}
        ref={register({ required: true })}
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
