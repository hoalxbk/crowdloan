import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import { numberWithCommas } from '../../../utils/formatNumber';
import { debounce } from 'lodash';
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

const headers = ['No.', 'Address'];

type LotteryWinnersProps = {
  poolId: number | undefined;
  width: any;
}

const shortenAddress = (address: string, digits: number = 4) => {
  return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
}

const LotteryWinners: React.FC<LotteryWinnersProps> = (props: LotteryWinnersProps) => {
  const styles = useStyles();
  const { poolId } = props;
  const [input, setInput] = useState("");
  const [searchedWinners, setSearchedWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { data: totalParticipants } = useFetch<number>(poolId ? `/user/counting/${poolId}`: undefined);
  const { data: winnersList } = useFetch<any>(
    `/user/winner-${!input ? 'list': 'search'}/${poolId}?page=${currentPage}&limit=10&${input ? `search=${input}`: ''}`,
    false,
    {},
  );

  const searchDebounce = () => {
    if (winnersList) {
      setTotalPage(winnersList.lastPage);
      setCurrentPage(winnersList.page);
      setSearchedWinners(winnersList.data);
    }
  };

  useEffect(searchDebounce, [winnersList])

  const handleInputChange = debounce((e: any) => {
    setInput(e.target.value);
    setCurrentPage(1);
  }, 500);

  return (
    <div className={styles.LotteryWinners}>
      <p className={styles.LotteryWinnersDesc}>There are {totalParticipants ? numberWithCommas(totalParticipants.toString()): 0} people joining this pool right now</p>
      <div className={styles.tableSearchWrapper}>
        <input 
          type="text" 
          name="lottery-search" 
          className={styles.tableSearch} 
          placeholder="Search for Wallet Address"
          onChange={handleInputChange}
        />
        <img src="/images/search.svg" className={styles.tableSearchIcon} alt="search-icon" />
      </div>
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
              {searchedWinners && searchedWinners.length> 0 && searchedWinners.map((row: any, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {isWidthDown('sm', props.width) ? 
                    <Tooltip title={<p>{row.wallet_address}</p>}>
                      <>
                        {shortenAddress(row.wallet_address)}
                      </>
                    </Tooltip>
                    : row.wallet_address
                  }
                </TableCell>
                </TableRow>
            ))}
              </TableBody>
            </Table>
        </TableContainer>
      {
        searchedWinners && searchedWinners.length> 0 && (
          <Pagination 
            count={totalPage} 
            color="primary" 
            style={{ marginTop: 30 }} className={styles.pagination} 
            onChange={(e: any, value: any) => setCurrentPage(value)}
            page={currentPage}
          />
        )
      }
    </div>
  )
}

export default withWidth()(LotteryWinners);
