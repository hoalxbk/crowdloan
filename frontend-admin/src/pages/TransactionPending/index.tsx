import React, { useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../../hooks/useTypedSelector';
import { getCampaignDetailHttp } from '../../store/actions/campaign';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import ButtonLink from '../../components/Base/ButtonLink';
import useStyles from './style';
import {adminRoute} from "../../utils";

const TransactionPending: React.FC = () => {
  const styles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { id } = useParams() as any;
  const { data: matchedCampaignHttp } = useTypedSelector(state => state.campaignProcessing);

  useEffect(() => {
    if (id) {
      dispatch(getCampaignDetailHttp(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
     !matchedCampaignHttp?.isProcessing && matchedCampaignHttp?.campaign_hash &&
     history.push(adminRoute(`/campaign-detail/${matchedCampaignHttp.campaign_hash}`));
  }, [matchedCampaignHttp]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <DefaultLayout>
      <ButtonLink onClick={goBack} spacing={6} to={adminRoute('/campaigns')} text="Back" icon="icon-arrow-left.svg" />
      <div className={`${styles.groupShow} ${styles.groupShowCenter}`}>
        <CircularProgress size={75} thickness={4} value={100} />
        <strong className={`${styles.groupShowSpacing}`} style={{ fontSize: 19 }}>This Campaign Transaction is processing ...</strong>
        <div style={{ marginTop: 10 }}>
          {
            matchedCampaignHttp?.transaction_hash && <strong>Transaction hash: {matchedCampaignHttp?.transaction_hash} </strong>
          }
        </div>
      </div>
    </DefaultLayout>
  )
}

export default TransactionPending;
