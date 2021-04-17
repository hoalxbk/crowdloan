import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import { numberWithCommas } from '../../../utils/formatNumber';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useStyles from './style';

const headers = ['Ticket Number', 'Address'];

type LotteryWinnersProps = {
  poolId: number | undefined;
}

type RowData = {
  id: number;
  wallet_address: string;
}

const LotteryWinners: React.FC<LotteryWinnersProps> = (props: LotteryWinnersProps) => {
  const styles = useStyles();
  const { poolId } = props;
  const { data: totalParticipants } = useFetch<number>(`/user/counting/${poolId}`);
  const { data: winners } = useFetch<Array<RowData>>(`/user/winner-list/${poolId}`);
  const [input, setInput] = useState("");
  const [searchedWinners, setSearchedWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {

  }, [input]);

  return (
    <div className={styles.LotteryWinners}>
      <p className={styles.LotteryWinnersDesc}>There are {totalParticipants ? numberWithCommas(totalParticipants.toString()): 0} people joining this pool right now</p>
      <div className={styles.tableSearchWrapper}>
        <input 
          type="text" 
          name="lottery-search" 
          className={styles.tableSearch} 
          placeholder="Search for Email Address/Wallet Address"
          onChange={(e: any) => setInput(e.target.value)}
        />
        <img src="/images/search.svg" className={styles.tableSearchIcon} alt="search-icon" />
      </div>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead className={styles.tableHeaderWrapper}>
            <TableRow>
            {
              headers.map(header => (
                <TableCell key={header} className={styles.tableHeader}>{header}</TableCell>
              ))
            }
            </TableRow>
          </TableHead>
          <TableBody>
            {winners && winners.length> 0 && winners.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.wallet_address}
              </TableCell>
              </TableRow>
          ))}
            </TableBody>
          </Table>
          </TableContainer>
          </div>
  )
}

export default LotteryWinners;
