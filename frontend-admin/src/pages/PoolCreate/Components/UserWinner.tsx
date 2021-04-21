import React, {useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Button, makeStyles} from "@material-ui/core";
import {useCommonStyle} from "../../../styles";
import {deleteParticipantUser, deleteWinnerUser, getWinnerUser} from "../../../request/participants";
import useGetList from "./hooks/useGetList";
import useDeleteItem from "./hooks/useDeleteItem";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

function UserWinner(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();


  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);



  const { poolDetail } = props;
  const {
    rows, setRows,
    search,
    searchDelay,
  } = useGetList({ poolDetail, handleSearchFunction: getWinnerUser });

  const {
    deleteItem
  } = useDeleteItem({
    poolDetail,
    handleDeleteFunction: deleteWinnerUser,
    handleSearchFunction: search
  });


  return (
    <>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search" />
        <img src="/images/icon-search.svg" alt="" />
      </div>

      <TableContainer component={Paper} className={commonStyle.tableScroll}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Actions</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Wallet Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>


                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => deleteItem(e, row, index)}
                    style={{marginLeft: 10, marginTop: 10}}
                  >Delete</Button>
                </TableCell>


                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell align="center">{row.wallet_address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserWinner;
