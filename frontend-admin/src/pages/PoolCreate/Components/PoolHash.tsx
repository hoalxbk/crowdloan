import React from 'react';
import useStyles from "../style";

function PoolHash(props: any) {
  const classes = useStyles();
  const {
    poolDetail,
  } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Hash</label>
        <input
          type="text"
          name="title"
          defaultValue={poolDetail?.campaign_hash}
          maxLength={255}
          className={classes.formControlInput}
          disabled
        />
      </div>
    </>
  );
}

export default PoolHash;
