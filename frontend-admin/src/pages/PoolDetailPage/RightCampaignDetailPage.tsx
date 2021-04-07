import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';

import useStyles from './styles';
import BigNumber from "bignumber.js";
import { useTypedSelector } from '../../hooks/useTypedSelector'
import {getTransactionRowType} from "../../utils";
import {convertDateLocalWithTimezone, convertTimeLocalWithTimezone} from "../../utils/convertDate";

interface MatchParams {
  transactions: object[],
  loading: boolean,
  failure: "",
  lastPage: number;
  handlePaginationChange: (event:any, page: number) => void;
  currentPage: number;
}

const RightCampaignDetailPage: React.FC<MatchParams> = (props: MatchParams) => {
  const styles = useStyles();
  const { loading, transactions, failure, lastPage, currentPage, handlePaginationChange } = props;
  const { data: campaignDetail } = useTypedSelector(state => state.campaignDetail);

  const getTransactionClassName = (transaction: any) => {
    if (transaction?.type === 'Refund') {
      return styles.refund;
    }
    if (transaction?.type === 'TokenClaimed') {
      return styles.claimed;
    }
    return styles.buyWithEther;
  };

  return (
    <div className={styles.rightPage}>
      <h2 className={styles.titleTable}>Transaction List</h2>
      <TableContainer component={Paper} className={styles.tableTransactionList}>
        {
          loading ? (
            [...Array(10)].map((num, index) => (
            <div key={index}>
              <Skeleton className={styles.skeleton} width="100%" />
            </div>
          ))):  (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={styles.TableCellHead}>PURCHASED ADDRESS</TableCell>
              <TableCell className={styles.TableCellHead}>CURRENCY</TableCell>
              <TableCell className={styles.TableCellHead}>TOKEN</TableCell>
              <TableCell className={styles.TableCellHead} align="center">TIME</TableCell>
              <TableCell className={styles.TableCellHead} align="center">TYPE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions && transactions.length > 0 && transactions.map((row: any, index: any) => {
              const { value_paid: currency = 0, amount_received: amountReceived = 0} = row;
              const currencyConvert = new BigNumber(currency || 0).toString();
              const amountReceivedConvert = new BigNumber(amountReceived || 0).toString();

              return (
                <TableRow key={index} className={styles.TableRowBody}>
                  <TableCell className={`${styles.TableCellBody}`}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{row?.purchaser}</p>}>
                    <span className={styles.wordBreak}>
                    {row?.purchaser}
                    </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{currencyConvert} {row?.token ? 'USDT': 'ETH'}</p>}>
                    <span className={styles.wordBreak}>
                      {currencyConvert} {row?.token ? 'USDT': 'ETH'}
                    </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{amountReceivedConvert} {campaignDetail && campaignDetail.tokenSymbol}</p>}>
                    <span className={styles.wordBreak}>
                      {amountReceivedConvert} {campaignDetail && campaignDetail.tokenSymbol}
                    </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`} align="center">
                    {/*{moment(moment.utc(row?.created_at)).local().format("hh:mm:ss A")}<br/>*/}
                    {/*{moment(moment.utc(row?.created_at)).local().format("MM/DD/YYYY")}*/}

                    {convertDateLocalWithTimezone(row?.created_at)}<br/>
                    {convertTimeLocalWithTimezone(row?.created_at)}
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>
                      {getTransactionRowType(row)}
                    </p>}>
                    <span className={styles.wordBreak} style={{textAlign: 'right'}}>
                      <span className={`${styles.buyStatus} ${getTransactionClassName(row)}`}>
                        {getTransactionRowType(row)}
                      </span>
                    </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        )}
        {
          failure ? <p className={styles.errorMessage}>{failure}</p> : ((!transactions || transactions.length === 0) && !loading)  ? <p className={styles.noDataMessage}>There is no data</p> : ( lastPage > 1 && <Pagination page={currentPage} className={styles.pagination} count={lastPage} onChange={handlePaginationChange} /> )
        }
      </TableContainer>
    </div>
  );
};

export default RightCampaignDetailPage;
