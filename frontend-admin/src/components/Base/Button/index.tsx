import React from 'react';
import useStyles from './style';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const Button = (props: any) => {
  const {
    className = '',
    buttonType = '',
    label = '',
    loading = false,
    ...remainProps
  } = props;

  const classes = useStyles();
  const mainClass = classes.button;

  return (
    <button
      className={`${mainClass} ${className} ${mainClass}--${buttonType}`}
      {...remainProps}
    >
      {label}
      {loading && (
        <span className={`${mainClass}__loading`}>
          <CircularProgress size={30} />
        </span>
      )}
    </button>
  );
};

export default Button;