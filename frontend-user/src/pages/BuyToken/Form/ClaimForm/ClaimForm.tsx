import React from 'react';
import Button from '../../../../components/Base/Button';
import {claimStakedTokens} from '../../../../store/actions/claim-token';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import WaitingForClaim from './WaitingForClaim';
import useStyles from './style';
import {getShortTokenSymbol} from "../../../../utils/token";

const ClaimForm = (props: any) => {
  const {
    classNamePrefix,
    campaignDetail,
    loginInvestor = {},
  } = props;

  const styles = useStyles();
  const dispatch = useDispatch();
  const { loading: claimStakedTokensLoading } = useSelector((state: any) => state.stakedToken);

  const tokenSymbol = _.get(campaignDetail, 'tokenSymbol', '');
  const claimableTokens = _.get(campaignDetail, 'claimableTokens', '');
  const releaseTime = _.get(campaignDetail, 'releaseTime', 0);
  const now = new Date().getTime();
  const isReleaseTime = now >= (releaseTime * 1000);

  return (
    <div className={`${classNamePrefix}__form-claimable`}>
      <WaitingForClaim
        campaignDetail={campaignDetail}
      />
      <p>Address: <strong>{loginInvestor.wallet_address}</strong></p>
      <p>Claimable {getShortTokenSymbol(tokenSymbol)}: <strong>{claimableTokens}</strong></p>
      <Button
        onClick={() => dispatch(claimStakedTokens())}
        label="Claim"
        buttonType="primary"
        loading={claimStakedTokensLoading}
        disabled={claimableTokens <= 0 || claimStakedTokensLoading}
        style={{
          marginTop: 20
        }}
      />
      {isReleaseTime && claimableTokens <= 0 &&
        <p className={styles.dontHaveCoin}>
          You do not have any tokens to claim.
        </p>
      }
    </div>
  );
};

export default ClaimForm;
