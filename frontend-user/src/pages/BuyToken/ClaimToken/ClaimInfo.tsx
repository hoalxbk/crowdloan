import React from 'react';
import {convertTimeToStringFormat} from "../../../utils/convertDate";
import useStyles from "./style";
import {numberWithCommas} from "../../../utils/formatNumber";

function ClaimInfo(props: any) {

  const styles = useStyles();
  const { poolDetails, tokenDetails, userPurchased } = props;

  return (
    <>
      {/*<p className={styles.poolDetailClaimTitle}>*/}
      {/*  <span>{'Token can claim from'}</span>*/}
      {/*  <strong>{'AAAAA'}</strong>*/}
      {/*</p>*/}

      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>You can claim</span>
          <span>{numberWithCommas(`${userPurchased}`)} {tokenDetails?.symbol}</span>
        </div>
      </div>

      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>You can claim</span>
          <span>{numberWithCommas(`${userPurchased}`)} {tokenDetails?.symbol}</span>
        </div>
      </div>

    </>
  );
}

export default ClaimInfo;
