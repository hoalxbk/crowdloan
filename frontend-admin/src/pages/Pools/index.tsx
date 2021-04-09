import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableContainer, Paper, TableBody, TableCell, TableHead, TableRow, Checkbox, FormControlLabel } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Skeleton from '@material-ui/lab/Skeleton';
import Pagination from '@material-ui/lab/Pagination';
import CachedIcon from '@material-ui/icons/Cached';
//@ts-ignore
import DatePicker from 'react-date-picker';
import { debounce } from 'lodash';

import { convertDateTimeToUnix } from '../../utils/convertDate';
import useStyles from './style';
import { getCampaigns } from '../../store/actions/campaign';
import { useCommonStyle } from '../../styles';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import Button from '../../components/Base/ButtonLink';
import CampaignsRecord from './PoolsRecord'
import {adminRoute} from "../../utils";

const tableHeaders = ["POOL NAME", "START TIME", "FINISH TIME",  "TOKEN SYMBOL", "STATUS"];

const Pools: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();

  const dispatch = useDispatch();

  const { page = 1, lastPage, data: campaigns } = useSelector(( state: any ) => state.campaigns.data);
  const { loading, failure } = useSelector((state: any) => state.campaigns);

  const [filter, setFilter] = useState(false);
  const [currentOpen, setCurrentOpen] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [finishTime, setFinishTime] = useState<Date | null>(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    handleCampaignQuery(currentPage, query, startTime, finishTime, filter);
  }, [dispatch, currentPage, query, startTime, finishTime, filter]);

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  }

  const handleCampaignSearch = (event: any) => {
    setCurrentPage(1);
    setQuery(event.target.value);
  }

  const handleCampaignQuery = (currentPage: number, query: string, startTime: Date | null, finishTime: Date | null, filter: boolean) => {
    dispatch(getCampaigns(currentPage, query, convertDateTimeToUnix(startTime), convertDateTimeToUnix(finishTime), filter));
  }

  const delayCampaignSearch = debounce(handleCampaignSearch, 500);

  const handleCurrentOpenSet = (id: string) => {
    setCurrentOpen(id);
  }

  return (
    <DefaultLayout>
      <div className={classes.header}>
        <div className="header-left">
          <Button to={adminRoute('/campaigns/add')} text={'Create New Pool'} icon={'icon_plus.svg'} />
        </div>
        <div className={classes.headerRight}>
          <DatePicker
            className={commonStyle.DatePicker}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            calendarIcon={<img src="/images/icon-calendar.svg" alt="calendar-icon" />}
            value={startTime}
            onChange={(date: any) => { setStartTime(date); setCurrentPage(1) }}
          />
          <img className={commonStyle.iconLine} src="/images/icon-line.svg" alt="" />
          <DatePicker
            className={commonStyle.DatePicker}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            calendarIcon={<img src="/images/icon-calendar.svg" alt="calendar-icon" />}
            value={finishTime}
            onChange={(date: any) => { setFinishTime(date); setCurrentPage(1) }}
          />
          <div className={commonStyle.boxSearch}>
            <input className={commonStyle.inputSearch} onChange={delayCampaignSearch} placeholder="Search" />
            <img className={commonStyle.iconSearch} src="/images/icon-search.svg" alt="" />
          </div>
        </div>
      </div>
      <div className={classes.refreshCampaigns}>
        <span className={classes.refreshCampaignsContainer}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                name="checkedIcon"
                onChange={((e: React.ChangeEvent<HTMLInputElement>) => {
                  setFilter(e.target.checked);
                  setCurrentPage(1);
                })}
              />
            }
            label={<p className={classes.refreshCampaignsText}>Filter by your own pools</p>}
          />
        </span>
        <span className={classes.refreshCampaignsContainer} onClick={() => handleCampaignQuery(currentPage, query, startTime, finishTime, filter)}>
          <CachedIcon className={`${classes.refreshCampaignsIcon} refreshCampaignsIcon`} />
          <p className={classes.refreshCampaignsText}>Click to refresh campaigns</p>
        </span>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        {
          loading ? (
            [...Array(10)].map((num, index) => (
            <div key={index}>
              <Skeleton className={classes.skeleton} width={'100%'} />
            </div>
          ))):  (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {
                    tableHeaders.map((tableHeader: string, index: number) => (
                      <TableCell key={index} className={classes.tableHeader}>{tableHeader}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
              {
                  campaigns && campaigns.length > 0 && campaigns.map((campaign: any, index: number) =>  (
                    <CampaignsRecord key={campaign.id} currentOpen={currentOpen} setCurrentOpen={handleCurrentOpenSet} campaign={campaign} />
                  ))
              }
              </TableBody>
            </Table>
        )}
        {
          failure ? <p className={classes.errorMessage}>{failure}</p> : ((!campaigns || campaigns.length === 0) && !loading)  ? <p className={classes.noDataMessage}>There is no data</p> : (
            <>
              {campaigns && lastPage > 1 && <Pagination page={currentPage} className={classes.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        }
      </TableContainer>
    </DefaultLayout>
  )
}

export default Pools;
