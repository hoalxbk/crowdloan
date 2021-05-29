import React from 'react';
import useStyles from "../style";
import {INSTRUCTION_WHITELIST_LINK, WHITELIST_LINK} from "../../../constants";

function WhiteListUserGuideBanner(props: any) {
  const styles = useStyles();

  return (
    <>
      {/*<p className={styles.poolTicketWinner}>*/}
      {/*  <div>*/}
      {/*    <img src="/images/tick.svg" alt="warning" />*/}
      {/*  </div>*/}
      {/*  <span style={{ marginLeft: 14 }}>*/}
      {/*    You must click the Apply Whitelist button to join the pool whitelist.*/}
      {/*  </span>*/}
      {/*</p>*/}

      <div className={styles.poolWhitelistGuide} style={{  }}>
        <div className={styles.poolWhiteListLineSmall}>You have successfully:</div>
        <div className={styles.poolWhiteListLineSmall}>✓ Verified KYC</div>
        <div className={styles.poolWhiteListLineSmall}>✓ Clicked the "Apply Whitelist" button</div>
        <div className={styles.poolWhiteListLineSmall}>
          x  You need to fill out the Whitelist Form, please click {' '}
          <a style={{ color: '#1a73e8', textDecoration: 'underline' }} href={WHITELIST_LINK} target={'_blank'}>here</a>.
          (Skip if you have already filled out the form)
        </div>

        <div className={styles.poolWhiteListLine}>
          You are ready for the lottery after completing the above 3 steps.  Please stay tuned for the winner announcement on Tuesday, June 1, 2021.
          You can read more about the instruction {' '}
          <a style={{ color: '#1a73e8', textDecoration: 'underline' }} href={INSTRUCTION_WHITELIST_LINK} target={'_blank'}>here</a>.
        </div>
        <div className={styles.poolWhiteListLine}></div>

      </div>

    </>
  );
}

export default WhiteListUserGuideBanner;