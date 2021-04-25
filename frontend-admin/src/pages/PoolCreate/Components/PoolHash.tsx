import React from 'react';
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";

function PoolHash(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();

  const {
    poolDetail,
  } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Hash (Please deposit token to campaign smart contract address for ICO.)</label>
        <div className={commonStyle.boldText}>{poolDetail?.campaign_hash}</div>
        {/*<input*/}
        {/*  type="text"*/}
        {/*  name="title"*/}
        {/*  defaultValue={poolDetail?.campaign_hash}*/}
        {/*  maxLength={255}*/}
        {/*  className={classes.formControlInput}*/}
        {/*  disabled*/}
        {/*/>*/}
      </div>
    </>
  );
}

export default PoolHash;
