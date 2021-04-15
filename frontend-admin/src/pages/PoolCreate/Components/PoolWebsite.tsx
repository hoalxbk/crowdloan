import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolWebsite(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Website</label>
        <input
          type="text"
          name="website"
          defaultValue={poolDetail?.website}
          ref={register({ required: true })}
          maxLength={255}
          className={classes.formControlInput}
          disabled={isDeployed}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'website')
          }
        </p>
      </div>
    </>
  );
}

export default PoolWebsite;
