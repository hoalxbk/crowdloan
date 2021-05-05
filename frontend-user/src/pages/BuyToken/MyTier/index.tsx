import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { Tier } from '../../../hooks/usePoolDetails';
/* import { CircularProgress } from '@material-ui/core'; */
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';

import Tooltip from '@material-ui/core/Tooltip';
import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useStyles from './style';

type MyTierProps = {
  tiers: Tier[] | undefined
}

const headers = ['Tier', 'Allocation (%)', 'Max Buy/Ticket', 'Start Buy Time', 'End Buy Time'];

const MyTier: React.FC<MyTierProps> = ({ tiers }: MyTierProps) => {
  const styles = useStyles();

  return (
    <div className={styles.MyTier}>
      <p className={styles.MyTierWinningLottery}>
        You are holding 10000 PKF and in tier Hawk, which corresponds to 10 lottery tickets. 
      </p>
      <p className={styles.MyTierAccountRedirect}>
        To upgrade your tier, please click <Link to="/account" style={{ color: '#6399FF', textDecoration: 'underline' }}>here</Link> !
      </p>
      <p className={styles.MyTierRulesHeader}>
        At current tier, you will be able to purchase with the following rules:
      </p>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table} aria-label="simple table">
            <TableHead className={styles.tableHeaderWrapper}>
              <TableRow>
              {
                headers.map(header => (
                  <TableCell key={header} className={styles.tableHeader}>
                    <span>
                      {header}
                    </span>
                  </TableCell>
                ))
              }
              </TableRow>
            </TableHead>
            <TableBody>
              {tiers && tiers.length> 0 && tiers.map((row: any, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.allocation}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.maxBuy}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.startTime}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.endTime}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default withWidth()(MyTier);