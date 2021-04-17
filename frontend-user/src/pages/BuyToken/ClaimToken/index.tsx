import React from 'react';
import Button from '../Button';
import Countdown from '../../../components/Base/Countdown';
import useStyles from './style';

type ClaimTokenProps = {
  releaseTime: Date | undefined
}

const ClaimToken: React.FC<ClaimTokenProps> = (props: ClaimTokenProps) => {
  const { releaseTime } = props;
  const styles = useStyles();

  return (
    <div className={styles.poolDetailClaim}>
      <p className={styles.poolDetailClaimTitle}>
        <span>{'Token can claim from'}</span>
        <strong>{new Date().toString() }</strong>
      </p>
      <Countdown startDate={releaseTime} />
      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>You can claim</span>
          <strong>1200 Tokens</strong>
        </div>
        <div className={styles.poolDetailClaimInfoBlock} >
          <span>Your Balance</span>
          <strong>100 Tokens</strong>
        </div>
      </div>
      <Button text={'Claim'} backgroundColor={'#3232DC'} />
    </div>
  )
}

export default ClaimToken;
