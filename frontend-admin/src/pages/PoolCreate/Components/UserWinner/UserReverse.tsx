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
import {
  addReservesUser,
  deleteParticipantUser,
  deleteReservesUser,
  getParticipantUser,
  getReserveUser
} from "../../../../request/participants";
import {withRouter} from "react-router";
import useGetList from "../hooks/useGetList";
import useDeleteItem from "../hooks/useDeleteItem";
import UserParticipantCreatePopup from "./UserParticipantCreatePopup";
import {useDispatch} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import UserReserveCreatePopup from "./UserReserveCreatePopup";

import useStylesTable from './style_table';
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
import {DATETIME_FORMAT} from "../../../../constants";
import {etherscanRoute} from "../../../../utils";
import Link from "@material-ui/core/Link";
import BigNumber from "bignumber.js";


function UserReverse(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const { poolDetail } = props;
  const {
    rows,
    search, searchDelay,
    failure, loading,
    lastPage, currentPage, totalRecords,
    handlePaginationChange,
  } = useGetList({ poolDetail, handleSearchFunction: getReserveUser });

  const {
    deleteItem
  } = useDeleteItem({
    poolDetail,
    handleDeleteFunction: deleteReservesUser,
    handleSearchFunction: search
  });

  const dispatch = useDispatch();
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState({});
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
    setEditData({});
    setEditRow(-1);
    setIsEdit(false);
    setIsOpenEditPopup(true);
  };

  const handleCreateUpdateData = async (responseData: any) => {
    const inputParams = {
      ...(responseData || {}),
      endTime: moment(responseData.endTime).format(DATETIME_FORMAT),
      startTime: moment(responseData.startTime).format(DATETIME_FORMAT),
    };

    const response = await addReservesUser(poolDetail.id, inputParams);
    if (response?.status === 200) {
      dispatch(alertSuccess('Create Successful !!!'));
      search();
      setIsOpenEditPopup(false);
    } else {
      dispatch(alertFailure('Create Fail !!!'));
    }
  };


  return (
    <>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search reserve users" />
        <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />


        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={openPopupCreate}
            style={{marginLeft: 10, marginTop: 10}}
          >Add</Button>

          {isOpenEditPopup &&
            <UserReserveCreatePopup
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
              <TableCell size={'small'}>Min Buy</TableCell>
              <TableCell size={'small'}>Max Buy</TableCell>
              <TableCell size={'small'}>Start Time</TableCell>
              <TableCell size={'small'}>End Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>

                <TableCell component="th" scope="row" size={'small'}>
                  {row.email}
                </TableCell>
                <TableCell align="center" size={'medium'}>
                  <Link href={etherscanRoute(row.wallet_address)} target={'_blank'}>
                    {row.wallet_address}
                  </Link>
                </TableCell>
                <TableCell align="center">{new BigNumber(row.min_buy).toFixed()}</TableCell>
                <TableCell align="center">{new BigNumber(row.max_buy).toFixed()}</TableCell>
                <TableCell align="center">{row.start_time}</TableCell>
                <TableCell align="center">{row.end_time}</TableCell>

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

        {failure && <p className={classesTable.errorMessage}>{failure}</p>}
        {!failure &&
          ((!rows || rows.length === 0) && !loading)  ? <p className={classesTable.noDataMessage}>There is no data</p> : (
            <>
              {rows && lastPage > 1 && <Pagination page={currentPage} className={classesTable.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        }

      </TableContainer>
    </>
  );
}

export default withRouter(UserReverse);

