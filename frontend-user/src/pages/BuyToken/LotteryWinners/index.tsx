import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useStyles from './style';

function createData(ticketNumber: string, address: string) {
  return { ticketNumber, address };
}

const rows = [
  createData('1234', '0x7C0C8E823e109702a7Ada15F46eE23053eEfCf10'),
  createData('1234', '0x7C0C8E823e109702a7Ada15F46eE23053eEfCf10'),
  createData('1234', '0x7C0C8E823e109702a7Ada15F46eE23053eEfCf10'),
  createData('1234', '0x7C0C8E823e109702a7Ada15F46eE23053eEfCf10'),
  createData('1234', '0x7C0C8E823e109702a7Ada15F46eE23053eEfCf10'),
];

const headers = ['Ticket Number', 'Address'];

const LotteryWinners: React.FC<any> = (props: any) => {
  const styles = useStyles();

  return (
    <div className={styles.LotteryWinners}>
      <div className={styles.tableSearchWrapper}>
        <input type="text" name="lottery-search" className={styles.tableSearch} placeholder="Search for Email Address/Wallet Address"/>
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
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.ticketNumber}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.address}
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
