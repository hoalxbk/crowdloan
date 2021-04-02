import React from 'react';
import { useSelector } from "react-redux";
import _ from "lodash";
import {convertUnixTimeToDateTime} from "../../../../utils/convertDate";
import useStyles from './style';
import {getShortTokenSymbol} from "../../../../utils/token";

const WaitingForClaim = (props: any) => {
  const {
    campaignDetail,
  } = props;
  const styles = useStyles();
  const { loading: claimStakedTokensLoading } = useSelector((state: any) => state.stakedToken);
  const claimableTokens = _.get(campaignDetail, 'claimableTokens', '');

  const tokenSymbol = _.get(campaignDetail, 'tokenSymbol', '');
  const startTime = _.get(campaignDetail, 'startTime', 0);
  const releaseTime = _.get(campaignDetail, 'releaseTime', 0);
  const now = new Date().getTime();
  const isWaitingForClaim = now < (releaseTime * 1000);

  if (!isWaitingForClaim) {
    return <></>;
  }

  return (
    <>
      <div className={styles.wattingWrapper}>
        <p className={styles.wattingForCampaign}>Waiting for claim</p>
        <p className={styles.claimTokenNumber}>
          {claimableTokens}
          <span className={styles.tokenSymbol}>{getShortTokenSymbol(tokenSymbol)}</span>
        </p>
        <p className={styles.wattingText}>
          You can access the campaign to claim tokens at
        </p>
        <strong>{convertUnixTimeToDateTime(releaseTime)}</strong>
      </div>
    </>
  );
};

export default WaitingForClaim;
