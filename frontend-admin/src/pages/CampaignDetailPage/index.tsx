import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import LeftCampaignDetailPage from './LeftCampaignDetailPage';
import RightCampaignDetailPage from './RightCampaignDetailPage';
import { Grid } from '@material-ui/core';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
//@ts-ignore
import DatePicker from 'react-date-picker';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import ButtonLink from '../../components/Base/ButtonLink';
import { convertDateTimeToUnix } from '../../utils/convertDate';
import { getTransactionByCampaign } from '../../store/actions/transaction'
import { useCommonStyle } from '../../styles';
import {adminRoute} from "../../utils";

interface MatchParams {
  id: string;
}

const CampaignDetailPage: React.FC<RouteComponentProps<MatchParams>> = (props: RouteComponentProps<MatchParams>) => {
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();

  const { loading, failure, page = 1, lastPage, data: transactions } = useSelector(( state: any ) => state.transactionCampaign.data);
  const [currentPage, setCurrentPage] = useState(page);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [finishTime, setFinishTime] = useState<Date | null>(null);
  const [query, setQuery] = useState('');

  const { match } = props;

  const id = match.params.id;

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  }

  const handleCampaignSearch = (event: any) => {
    setCurrentPage(1);
    setQuery(event.target.value);
  }

  const handleTransactionsQuery = (transactionID: string, currentPage: number, query: string, startTime: Date | null, finishTime: Date | null) => {
    dispatch(getTransactionByCampaign(transactionID, currentPage, query, convertDateTimeToUnix(startTime), convertDateTimeToUnix(finishTime)));
  }

  const delayTransactionsSearch = debounce(handleCampaignSearch, 500);

  useEffect(() => {

    if (id) {
      handleTransactionsQuery(id, currentPage, query, startTime, finishTime);
    }
  }, [dispatch, id, currentPage, query, startTime, finishTime]);

  return (
    <DefaultLayout>
      <div className={commonStyle.headPage}>
        <div className={commonStyle.headPageLeft}>
          <ButtonLink to={adminRoute('/campaigns')} text="Back" icon="icon-arrow-left.svg">
            <img className="icon-back" src="/images/icon-arrow-left.svg" alt=""/>Back
          </ButtonLink>
        </div>
        <div className={commonStyle.headPageRight}>
          <DatePicker
            className={commonStyle.DatePicker}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            calendarIcon={<img src="/images/icon-calendar.svg" alt="calendar-icon" />}
            value={startTime}
            onChange={(date: any) => { setStartTime(date) }}
          />
          <img className={commonStyle.iconLine} src="/images/icon-line.svg" alt="" />
          <DatePicker
            className={commonStyle.DatePicker}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            calendarIcon={<img src="/images/icon-calendar.svg" alt="calendar-icon" />}
            value={finishTime}
            onChange={(date: any) => { setFinishTime(date) }}
          />
          <div className={commonStyle.boxSearch}>
            <input className={commonStyle.inputSearch} placeholder="Search" onChange={delayTransactionsSearch} />
            <img className={commonStyle.iconSearch} src="/images/icon-search.svg" alt="" />
          </div>
        </div>
      </div>
      <div className="contentPage">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LeftCampaignDetailPage />
          </Grid>
          <Grid item xs={6}>
            <RightCampaignDetailPage
              loading={loading}
              transactions={transactions}
              failure={failure}
              handlePaginationChange={handlePaginationChange}
              lastPage={lastPage}
              currentPage={currentPage}
            />
          </Grid>
        </Grid>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(CampaignDetailPage);
