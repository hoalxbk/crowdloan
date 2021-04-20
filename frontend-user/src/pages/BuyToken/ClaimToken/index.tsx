import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import Button from '../Button';
import Countdown from '../../../components/Base/Countdown';
import TransactionSubmitModal from '../../../components/Base/TransactionSubmitModal';
import useStyles from './style';

import { TokenType } from '../../../hooks/useTokenDetails';
import useUserPurchased from '../hooks/useUserPurchased';
import useTokenClaim from '../hooks/useTokenClaim';

type ClaimTokenProps = {
  releaseTime: Date | undefined
  tokenDetails: TokenType | undefined
  poolAddress: string | undefined
  ableToFetchFromBlockchain: boolean | undefined
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
    ableToFetchFromBlockchain
  } = props;

  const { claimToken, setClaimTokenLoading, transactionHash, loading, error } = useTokenClaim(poolAddress);
  const { retrieveUserPurchased } = useUserPurchased(tokenDetails, poolAddress, ableToFetchFromBlockchain);
  const availableClaim = releaseTime ? new Date() >= releaseTime: false;

  useEffect(() => {
    const fetchUserPurchased  = async () => {
      connectedAccount && poolAddress && setUserPurchased(
        await retrieveUserPurchased(connectedAccount, poolAddress) as number
      );
    }
    
    ableToFetchFromBlockchain && fetchUserPurchased();
  }, [connectedAccount, poolAddress, ableToFetchFromBlockchain]);

  useEffect(() => {
    setOpenClaimModal(false);
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
        <strong>{moment(releaseTime).format("h:mm, DD MMMM YYYY") }</strong>
      </p>
      <Countdown startDate={releaseTime} />
      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>You can claim</span>
          <strong>{userPurchased} {tokenDetails?.name}</strong>
        </div>
      </div>
      <Button 
        text={'Claim'} 
        backgroundColor={'#3232DC'} 
        disabled={!availableClaim || userPurchased <= 0} 
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
