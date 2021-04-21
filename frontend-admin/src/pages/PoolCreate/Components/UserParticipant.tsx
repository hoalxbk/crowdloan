import React from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Button, makeStyles} from "@material-ui/core";
import {useCommonStyle} from "../../../styles";
import {deleteParticipantUser, getParticipantUser} from "../../../request/participants";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router";
import {alertSuccess} from "../../../store/actions/alert";
import useGetList from "./hooks/useGetList";

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
  const dispatch = useDispatch();

  const { poolDetail } = props;
  const {
    rows, setRows,
    search,
    searchDelay,
  } = useGetList({
    poolDetail,
    handleSearchFunction: getParticipantUser
  });

  const deleteItem = async (e: any, row: any, index: number) => {
    console.log('ROW: ', row, index);
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want delete this item?')) {
      return false;
    }
    // Delete
    const response = await deleteParticipantUser(poolDetail?.id, { wallet_address: row.wallet_address })
    if (response?.status === 200) {
      dispatch(alertSuccess('Delete Success'));
      await search();
    }
  };

  // const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  // const [editData, setEditData] = useState({});
  // const [editRow, setEditRow] = useState(0);
  // const [isEdit, setIsEdit] = useState(true);
  // // const openPopupEdit = (e: any, row: any, index: number) => {
  // //   console.log('ROW: ', row, index);
  // //   setEditData(row);
  // //   setEditRow(index);
  // //   setIsEdit(true);
  // //   setIsOpenEditPopup(true);
  // // };
  //
  // const openPopupCreate = (e: any) => {
  //   setEditData({});
  //   setEditRow(-1);
  //   setIsEdit(false);
  //   setIsOpenEditPopup(true);
  // };
  //
  // const handleCreateUpdateData = async (responseData: any) => {
  //   console.log('responseData', editRow, responseData);
  //   // if (isEdit && editRow !== -1) {
  //   //   // Update
  //   //   // @ts-ignore
  //   //   rows[editRow] = responseData;
  //   // } else {
  //   //   // Create
  //   //   // @ts-ignore
  //   //   rows.push(responseData);
  //   // }
  //   // setIsOpenEditPopup(false);
  // };


  return (
    <>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search" />
        <img src="/images/icon-search.svg" alt="" />
      </div>

      {/*<div style={{float: 'right'}}>*/}
      {/*  <Button*/}
      {/*    variant="contained"*/}
      {/*    color="primary"*/}
      {/*    onClick={openPopupCreate}*/}
      {/*    style={{marginLeft: 10, marginTop: 10}}*/}
      {/*  >Add</Button>*/}

      {/*  {isOpenEditPopup &&*/}
      {/*    <CreateEditTierForm*/}
      {/*      isOpenEditPopup={isOpenEditPopup}*/}
      {/*      setIsOpenEditPopup={setIsOpenEditPopup}*/}
      {/*      // renderError={renderError}*/}
      {/*      editData={editData}*/}
      {/*      isEdit={isEdit}*/}
      {/*      handleCreateUpdateData={handleCreateUpdateData}*/}
      {/*    />*/}
      {/*  }*/}
      {/*</div>*/}










      <TableContainer component={Paper} className={commonStyle.tableScroll}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Actions</TableCell>
              <TableCell size={'small'}>Email</TableCell>
              <TableCell align="center" size={'medium'}>Wallet Address</TableCell>
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

                <TableCell component="th" scope="row" size={'small'}>
                  {row.email}
                </TableCell>
                <TableCell align="center" size={'medium'}>{row.wallet_address}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default withRouter(UserParticipant);

