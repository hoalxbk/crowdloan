import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Button from '../Button';
import Countdown from '../../../components/Base/Countdown';
import TransactionSubmitModal from '../../../components/Base/TransactionSubmitModal';
import useStyles from './style';

import { TokenType } from '../../../hooks/useTokenDetails';
import useUserRemainTokensClaim from '../hooks/useUserRemainTokensClaim';
import useTokenClaim from '../hooks/useTokenClaim';
import { convertTimeToStringFormat } from '../../../utils/convertDate';
import { numberWithCommas } from '../../../utils/formatNumber';
import {useDispatch} from "react-redux";
import {alertFailure} from "../../../store/actions/alert";
import ClaimInfo from "./ClaimInfo";

type ClaimTokenProps = {
  releaseTime: Date | undefined
  tokenDetails: TokenType | undefined
  poolAddress: string | undefined
  ableToFetchFromBlockchain: boolean | undefined
  buyTokenSuccess: boolean | undefined
  poolId: number | undefined;
  disableAllButton: boolean;
  poolDetails: any;
}

const ClaimToken: React.FC<ClaimTokenProps> = (props: ClaimTokenProps) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [userClaimInfo, setUserClaimInfo] = useState<any>();

  const { account: connectedAccount } = useWeb3React();
  const {
    releaseTime,
    poolDetails,
    tokenDetails,
    poolAddress,
    poolId,
    ableToFetchFromBlockchain,
    buyTokenSuccess,
    disableAllButton
  } = props;

  const nowTime = new Date();
  const nowTimeUnix = new Date().getTime();
  const { claimToken, setClaimTokenLoading, transactionHash, claimTokenSuccess, loading, error } = useTokenClaim(poolAddress, poolId);
  const { retrieveClaimableTokens } = useUserRemainTokensClaim(tokenDetails, poolAddress, ableToFetchFromBlockchain);
  const availableClaim = releaseTime ? nowTime >= releaseTime: false;

  useEffect(() => {
    const fetchUserPurchased  = async () => {
      if (connectedAccount && poolAddress) {

        const userClaimInformations = await retrieveClaimableTokens(connectedAccount, poolAddress);
        console.log('userClaimInformations', userClaimInformations);
        setUserClaimInfo(userClaimInformations);

        setUserPurchased(
          (userClaimInformations?.userPurchasedReturn || 0) as number
        );
      }
    }

    (ableToFetchFromBlockchain || buyTokenSuccess) && fetchUserPurchased();
  }, [connectedAccount, poolAddress, ableToFetchFromBlockchain, claimTokenSuccess, buyTokenSuccess]);

  useEffect(() => {
    if (error) {
      setOpenClaimModal(false);
      setClaimTokenLoading(false);
    }
  }, [error]);

  const validateClaimable = () => {
    if (!availableClaim) {
      dispatch(alertFailure('You can not claim token at current time!'));
      return false;
    }
    if (userPurchased <= 0) {
      dispatch(alertFailure('User purchased must greater than 0'));
      return false;
    }
    if (disableAllButton) {
      dispatch(alertFailure('Please switch to correct network before Claim'));
      return false;
    }
    return true;
  };

  const handleTokenClaim = async () => {
    if (!validateClaimable()) {
      return ;
    }
    try {
      setOpenClaimModal(true);
      await claimToken();
    } catch (err) {
      setOpenClaimModal(false);
    }
  }


  return (
    <div className={styles.poolDetailClaim}>
      <p className={styles.poolDetailClaimTitle}>
        <span>{'Token can claim from'}</span>
        <strong>{releaseTime ? convertTimeToStringFormat(releaseTime || new Date()) : 'TBA'}</strong>
      </p>
      {releaseTime && releaseTime >= nowTime &&
        <Countdown startDate={releaseTime} />
      }

      {/*<div className={styles.poolDetailClaimInfo}>*/}
      {/*  <div className={styles.poolDetailClaimInfoBlock}>*/}
      {/*    <span>You can claim</span>*/}
      {/*    <span>{numberWithCommas(`${userPurchased}`)} {tokenDetails?.symbol}</span>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <ClaimInfo
        poolDetails={poolDetails}
        tokenDetails={tokenDetails}
        userClaimInfo={userClaimInfo}
        releaseTime={releaseTime}
      />

      <Button
        text={'Claim'}
        backgroundColor={'#3232DC'}
        // disabled={!availableClaim || userPurchased <= 0 || disableAllButton}
        loading={loading}
        onClick={handleTokenClaim}
      />

      <TransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => { setOpenClaimModal(false); setClaimTokenLoading(false)}}
        transactionHash={transactionHash}
        networkAvailable={poolDetails?.networkAvailable}
      />
    </div>
  )
}

export default ClaimToken;
