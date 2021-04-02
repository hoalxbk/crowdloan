import React, { useState, useEffect } from 'react';
import useStyles from './style';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';

const SelectUnit = (props: any) => {
  const [value, setValue] = useState('');
  const [showOption, setShowOption] = useState(false);

  const {
    defaultValue = '',
    onChange,
    className = '',
    disabled = false,
    name = '',
    options = [],
  } = props;

  const classes = useStyles();

  useEffect(() => {
    const { defaultValue = '', value = '' } = props;
    const newDefaultValue = value || defaultValue || _.get(options, '[0]', '');
    if (newDefaultValue) {
      setValue(newDefaultValue);
    }
  }, [props]);

  const onSelect = (newValue: any) => {
    setValue(newValue);
    if (typeof onChange === 'function') {
      onChange(newValue);
    }
    setShowOption(false);
  };

  const toggleOptions = () => {
    if (disabled) {
      return;
    }
    setShowOption(!showOption);
  };

  const optionSelected = options.find((option: any) => option.value === value);
  const label = _.get(optionSelected, 'label', '');

  if(!options.length) {
    return (
      <div>
        No options
      </div>
    )
  }

  return (
    <div className={`${classes.selectUnit} ${className}`}>
      <div
        className={`${classes.selectUnit}__text`}
        onClick={toggleOptions}
      >
        <Tooltip title={label} arrow placement="left-start">
          <label className={`${classes.selectUnit}__label`}>
            {label}
          </label>
        </Tooltip>
        <Tooltip title={value} arrow placement="left-start">
          <div className={`${classes.selectUnit}__value`}>
            {value}
          </div>
        </Tooltip>
        {!disabled && (
          <ExpandMoreIcon />
        )}
      </div>
      {options.length && showOption && (
        <ul className={`${classes.selectUnit}__options`}>
          {options.map((option: any, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(option.value)}
                className={`${classes.selectUnit}__item ${option.value === value ? 'active' : ''}`}
              >
                {option.value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectUnit;