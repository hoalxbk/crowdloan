import React, {useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Button, makeStyles} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {addParticipantUserToWinner, deleteParticipantUser, getParticipantUser} from "../../../../request/participants";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import useGetList from "../hooks/useGetList";
import useDeleteItem from "../hooks/useDeleteItem";
import UserParticipantCreatePopup from "./UserParticipantCreatePopup";
import UserPickerToWinner from "./UserPickerToWinner";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
  middleColumn: {
    width: 60,
    // backgroundColor: 'red',
  },
  smallColumn: {
    width: 60,
    // backgroundColor: 'green',
  },
});

function UserParticipant(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();

  const { poolDetail } = props;
  const {
    rows,
    search,
    searchDelay,
  } = useGetList({ poolDetail, handleSearchFunction: getParticipantUser });

  const {
    deleteItem
  } = useDeleteItem({
    poolDetail,
    handleDeleteFunction: deleteParticipantUser,
    handleSearchFunction: search
  });

  const dispatch = useDispatch();
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);
  // const openPopupEdit = (e: any, row: any, index: number) => {
  //   console.log('ROW: ', row, index);
  //   setEditData(row);
  //   setEditRow(index);
  //   setIsEdit(true);
  //   setIsOpenEditPopup(true);
  // };

  const openPopupCreate = (e: any) => {
    setEditData(rows);
    setEditRow(-1);
    setIsEdit(false);
    setIsOpenEditPopup(true);
  };

  const handleCreateUpdateData = async (responseData: any) => {
    console.log('responseData', editRow, responseData);

    // Call API Add to Winner
    addParticipantUserToWinner(poolDetail?.id, {winners: responseData})
      .then((res: any) => {
        console.log('[addParticipantUserToWinner] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Add Participant User to Winner Success'));
          search();
          setIsOpenEditPopup(false);
        } else {
          dispatch(alertFailure('Add Participant User to Winner Fail'));
        }
      })
  };

  return (
    <>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search" />
        <img src="/images/icon-search.svg" alt="" />

        <UserPickerToWinner
          poolDetail={poolDetail}
        />

        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={openPopupCreate}
          >Add</Button>

          {isOpenEditPopup &&
          <UserParticipantCreatePopup
            isOpenEditPopup={isOpenEditPopup}
            setIsOpenEditPopup={setIsOpenEditPopup}
            editData={editData}
            isEdit={isEdit}
            handleCreateUpdateData={handleCreateUpdateData}
          />
          }


        </div>




      </div>


      <TableContainer component={Paper} className={commonStyle.tableScroll}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell size={'small'}>Email</TableCell>
              <TableCell align="center" size={'medium'}>Wallet Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>

                <TableCell component="th" scope="row" size={'small'}>
                  {row.email}
                </TableCell>
                <TableCell align="center" size={'medium'}>{row.wallet_address}</TableCell>


                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => deleteItem(e, row, index)}
                    style={{marginLeft: 10, marginTop: 10}}
                  >Delete</Button>
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default withRouter(UserParticipant);

