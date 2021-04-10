import React, {useEffect, useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core";
import {useCommonStyle} from "../../../styles";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

function UserWinner(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const [rows, setRows] = useState([]);
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);

  const { users } = props;

  useEffect(() => {
    if (users && users.length > 0) {
      setRows(users);
    }
  }, [users]);

  const deleteTier = (e: any, row: any, index: number) => {
    console.log('ROW: ', row, index);
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want delete this user?')) {
      return false;
    }

    const newRows = [...rows];
    if (index > -1) {
      newRows.splice(index, 1);
    }
    setRows(newRows);
  };

  return (
    <>
      <TableContainer component={Paper} className={commonStyle.tableScroll}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="center">Wallet Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell align="center">{row.wallet_address}</TableCell>
                <TableCell align="right">
                  {/*<Button*/}
                  {/*  variant="contained"*/}
                  {/*  color="primary"*/}
                  {/*  onClick={(e) => openPopupEdit(e, row, index)}*/}
                  {/*>Edit</Button>*/}

                  {/*<Button*/}
                  {/*  variant="contained"*/}
                  {/*  color="secondary"*/}
                  {/*  onClick={(e) => deleteTier(e, row, index)}*/}
                  {/*  style={{marginLeft: 10, marginTop: 10}}*/}
                  {/*>Delete</Button>*/}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserWinner;
