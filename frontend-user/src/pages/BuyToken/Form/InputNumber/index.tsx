import React, { useState, useEffect } from 'react';
import useStyles from './style';

const InputNumber = (props: any) => {
  const [value, setValue] = useState();
  const {
    defaultValue = '',
    label = '',
    onChange,
    min,
    max,
    className = '',
    disabled = false,
    name = '',
    ...remainProps
  } = props;
  const classes = useStyles();

  useEffect(() => {
    const { defaultValue = '', value = '' } = props;
    const newDefaultValue = value || defaultValue;
    if (newDefaultValue) {
      setValue(newDefaultValue);
    }
  }, [props]);

  const onValueChange = (event: any) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (typeof onChange === 'function') {
      onChange(newValue);
    }
  };

  return (
    <div className={`${classes.inputNumber} ${className}`}>
      <label className={`${classes.inputNumber}__label`}>{label}</label>
      <input
        className={`${classes.inputNumber}__input`}
        type="number"
        value={value}
        onChange={onValueChange}
        {...(defaultValue && { defaultValue })}
        {...(min && { min })}
        {...(max && { max })}
        disabled={disabled}
        {...remainProps}
      />
    </div>
  );
};

export default InputNumber;