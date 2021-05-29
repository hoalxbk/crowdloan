import React, {useEffect, useState} from 'react';
import {convertTimeToStringFormat, convertUnixTimeToDateTime} from "../../../utils/convertDate";
import useStyles from "./style";
import {numberWithCommas} from "../../../utils/formatNumber";
import moment from "moment";
import {useWeb3React} from "@web3-react/core";
import useWalletSignature from "../../../hooks/useWalletSignature";
import useUserClaimSignature from "../hooks/useUserClaimSignature";
import BigNumber from 'bignumber.js';

function ClaimInfo(props: any) {
  const styles = useStyles();
  const {
    poolDetails,
    tokenDetails,
    userClaimInfo,
    releaseTime
  } = props;

  const {
    userPurchased = 0,
    userClaimed = 0,
    userPurchasedReturn = 0,
  } = (userClaimInfo || {});
  const [currentClaim, setCurrentClaim] = useState<any>();
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);

  const [nextClaim, setNextClaim] = useState<any>();
  const [nextClaimIndex, setNextClaimIndex] = useState(0);

  const [maximumTokenClaimUtilNow, setMaximumTokenClaimUtilNow] = useState<any>(0);

  useEffect(() => {

    if (poolDetails && poolDetails.campaignClaimConfig && poolDetails.campaignClaimConfig.length > 0) {
      const now = moment();
      const nowUnix = now.unix();
      let validRow = null;
      let validIndex = -1;
      for (let i = 0; i < poolDetails.campaignClaimConfig.length; i++) {
        const row = poolDetails.campaignClaimConfig[i];
        if (nowUnix < row.start_time) {
          break;
        } else {
          validRow = row;
          validIndex = i;
        }
      }
      if (validRow) {
        setCurrentClaim(validRow);
        setCurrentClaimIndex(validIndex);

        const next = poolDetails.campaignClaimConfig[validIndex + 1];
        console.log('NextClaim: next: ', next);
        if (next) {
          setNextClaim(next);
          setNextClaimIndex(validIndex + 1);
        }

        if (validIndex >= 0 && userPurchased && userClaimed) {
          const maximum = new BigNumber(validRow?.max_percent_claim || 0).dividedBy(100).multipliedBy(userPurchased || 0);
          console.log('validRow.max_percent_claim', validRow?.max_percent_claim, userPurchased, userClaimed, maximum.toFixed());
          if (maximum.lt(0)) {
            setMaximumTokenClaimUtilNow(0);
          } else {
            setMaximumTokenClaimUtilNow(maximum);
          }
        }
      }
      console.log('Finish validRow', validRow, validIndex);
    }
  }, [poolDetails, userPurchased, userClaimed]);

  const utcNow = moment().unix();

  return (
    <>
      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Total claimable token</span>
          <span>{numberWithCommas(`${userPurchased || 0}`)} {tokenDetails?.symbol}</span>
        </div>

        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Claimed token</span>
          <span>{numberWithCommas(`${userClaimed || 0}`)} {tokenDetails?.symbol}</span>
        </div>


        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Maximum token claim (until now)</span>
          <span>{numberWithCommas(`${maximumTokenClaimUtilNow || 0}`)} {tokenDetails?.symbol}</span>
        </div>

        {nextClaim && (new BigNumber(maximumTokenClaimUtilNow).lte(0)) &&
          <>
            <div className={styles.poolDetailClaimInfoBlock}>
              <span>Next Claim Time</span>
              <span>{convertUnixTimeToDateTime(nextClaim?.start_time, 1)}</span>
            </div>
          </>
        }

      </div>

    </>
  );
}

export default ClaimInfo;
