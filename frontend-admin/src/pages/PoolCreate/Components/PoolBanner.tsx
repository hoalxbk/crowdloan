import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolBanner(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Banner</label>
        <input
          type="text"
          name='banner'
          defaultValue={poolDetail?.banner}
          ref={register({ required: true })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'banner')
          }
        </p>
      </div>
    </>
  );
}

export default PoolBanner;
