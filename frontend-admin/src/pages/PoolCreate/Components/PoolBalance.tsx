import React from 'react';
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {etherscanRoute} from "../../../utils";
import Link from "@material-ui/core/Link";

function PoolBalance(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    poolDetail,
  } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Contract Address (Please deposit token to campaign smart contract address for ICO.)</label>
        <div className={commonStyle.boldText}>
          {!!poolDetail?.is_deploy &&
            <Link href={etherscanRoute(poolDetail?.campaign_hash, poolDetail)} target={'_blank'}>
              {poolDetail?.campaign_hash}
            </Link>
          }
          {!poolDetail?.is_deploy && '--'}
        </div>
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

export default PoolBalance;
