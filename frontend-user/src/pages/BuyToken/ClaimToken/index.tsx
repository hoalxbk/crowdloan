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

type ClaimTokenProps = {
  releaseTime: Date | undefined
  tokenDetails: TokenType | undefined
  poolAddress: string | undefined
  ableToFetchFromBlockchain: boolean | undefined
  buyTokenSuccess: boolean | undefined
  poolId: number | undefined;
  disableAllButton: boolean
}

const ClaimToken: React.FC<ClaimTokenProps> = (props: ClaimTokenProps) => {
  const { releaseTime } = props;
  const styles = useStyles();

  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const { account: connectedAccount } = useWeb3React();
  const {
    tokenDetails,
    poolAddress,
    poolId,
    ableToFetchFromBlockchain,
    buyTokenSuccess,
    disableAllButton
  } = props;

  const { claimToken, setClaimTokenLoading, transactionHash, claimTokenSuccess, loading, error } = useTokenClaim(poolAddress, poolId);
  const { retrieveClaimableTokens } = useUserRemainTokensClaim(tokenDetails, poolAddress, ableToFetchFromBlockchain);
  const availableClaim = releaseTime ? new Date() >= releaseTime: false;

  useEffect(() => {
    const fetchUserPurchased  = async () => {
      connectedAccount && poolAddress && setUserPurchased(
        await retrieveClaimableTokens(connectedAccount, poolAddress) as number
      );
    }

    (ableToFetchFromBlockchain || buyTokenSuccess) && fetchUserPurchased();
  }, [connectedAccount, poolAddress, ableToFetchFromBlockchain, claimTokenSuccess, buyTokenSuccess]);

  useEffect(() => {
    if (error) {
      setOpenClaimModal(false);
      setClaimTokenLoading(false);
    }
  }, [error]);

  const handleTokenClaim = async () => {
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
      <Countdown startDate={releaseTime} />
      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>You can claim</span>
          <span>{numberWithCommas(`${userPurchased}`)} {tokenDetails?.symbol}</span>
        </div>
      </div>
      <Button
        text={'Claim'}
        backgroundColor={'#3232DC'}
        disabled={!availableClaim || userPurchased <= 0 || disableAllButton}
        loading={loading}
        onClick={handleTokenClaim}
      />
      <TransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => { setOpenClaimModal(false); setClaimTokenLoading(false)}}
        transactionHash={transactionHash}
      />
    </div>
  )
}

export default ClaimToken;
