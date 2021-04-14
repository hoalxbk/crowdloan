import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolName(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Name</label>
        <input
          type="text"
          name="title"
          defaultValue={poolDetail?.title}
          ref={register({ required: true })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'title')
          }
        </p>
      </div>
    </>
  );
}

export default PoolName;
