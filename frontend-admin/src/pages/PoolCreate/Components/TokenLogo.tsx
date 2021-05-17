import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function TokenLogo(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Tokens Icon</label>
        <input
          type="text"
          name='tokenImages'
          defaultValue={poolDetail?.token_images}
          ref={register({ required: true })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'tokenImages')
          }
        </p>
      </div>
    </>
  );
}

export default TokenLogo;
