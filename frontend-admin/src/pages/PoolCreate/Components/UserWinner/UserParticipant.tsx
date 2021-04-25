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
import UserPickerToWinner from "./UserPickerToWinner";
import {getContractInstance} from "../../../../services/web3";
import tierABI from "../../../../abi/Tier.json";
import { Checkbox } from 'antd';
import {filter, cloneDeep, includes} from 'lodash';
import Pagination from "@material-ui/lab/Pagination";
import useStylesTable from './style_table';

const REACT_APP_SOTATIER = process.env.REACT_APP_SOTATIER || '';

function UserParticipant(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const { poolDetail } = props;
  const dispatch = useDispatch();

  const getParticipantUserWithTier = async (poolId: any, searchParams: any) => {
    try {
      let participantsUsers = await getParticipantUser(poolId, searchParams);

      // Call Multi get Tiers
      let users = participantsUsers?.data?.data || [];
      const campaignContract = getContractInstance(tierABI, REACT_APP_SOTATIER);
      const userAddressesPromises = users.map((item: any) => {
        console.log('item.wallet_address', item.wallet_address)
        return campaignContract?.methods.getUserTier(item.wallet_address).call();
      });

      const response = await Promise.all(userAddressesPromises);
      for (let i = 0; i < users.length; i++) {
        users[i].tier = response[i] || 0;
      }
      participantsUsers.data.data = users;
      return participantsUsers;
    } catch (e) {
      dispatch(alertFailure('ERROR: Fail fill Tiers. Some address is invalid !!!'));
      console.log('ERROR: Fail fill Tiers!!!');
      console.log(e)
    }
  };

  const {
    rows,
    search, searchDelay,
    failure, loading,
    lastPage, currentPage, totalRecords,
    handlePaginationChange,
  } = useGetList({
    poolDetail,
    handleSearchFunction: getParticipantUserWithTier
  });

  const {
    deleteItem
  } = useDeleteItem({
    poolDetail,
    handleDeleteFunction: deleteParticipantUser,
    handleSearchFunction: search
  });

  // const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  // const [editData, setEditData] = useState([]);
  // const [editRow, setEditRow] = useState(0);
  // const [isEdit, setIsEdit] = useState(true);
  // const openPopupEdit = (e: any, row: any, index: number) => {
  //   console.log('ROW: ', row, index);
  //   setEditData(row);
  //   setEditRow(index);
  //   setIsEdit(true);
  //   setIsOpenEditPopup(true);
  // };

  // const openPopupCreate = (e: any) => {
  //   setEditData(rows);
  //   setEditRow(-1);
  //   setIsEdit(false);
  //   setIsOpenEditPopup(true);
  // };

  const [addedUsers, setAddedUsers] = useState([]);
  const handleCreateUpdateData = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want add to winner')) {
      return false;
    }
    // Call API Add to Winner
    addParticipantUserToWinner(poolDetail?.id, {winners: addedUsers})
      .then((res: any) => {
        console.log('[addParticipantUserToWinner] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Add Participant User to Winner Success'));
          search(); // Re-search list
          setAddedUsers([]);  // Reset list checked user
          onChange([]); // Reset check-all checkbox
        } else {
          dispatch(alertFailure('Add Participant User to Winner Fail'));
        }
      })
  };

  const onCheckToAdd = (e: any, row: any, index: number) => {
    console.log('[onCheckToAdd]: ', e.target.value, row, index);
    const isChecked = e.target.checked;
    let newArr = cloneDeep(addedUsers);
    if (isChecked) {
      // @ts-ignore
      newArr.push(row.wallet_address);
    } else {
      newArr = filter(newArr, (it) => row.wallet_address != it);
    }
    onChange(newArr);
  };

  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const onChange = (list: any) => {
    setAddedUsers(list);
    setIndeterminate(!!list.length && list.length < rows.length);
    setCheckAll(list.length === rows.length);
  };

  const onCheckAllChange = (e: any) => {
    setAddedUsers(e.target.checked ? addedUsers : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    if (e.target.checked) {
      // @ts-ignore
      setAddedUsers(rows.map(it => it.wallet_address));
    } else {
      setAddedUsers([]);
    }
  };

  console.log('failure', failure, lastPage, currentPage, totalRecords);

  return (
    <>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search users to add winner" />
        <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />

        <UserPickerToWinner
          poolDetail={poolDetail}
        />

        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUpdateData}
          >Add To Winner</Button>

          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  color="primary"*/}
          {/*  onClick={openPopupCreate}*/}
          {/*>Add To Winner</Button>*/}

          {/*{isOpenEditPopup &&*/}
          {/*<UserParticipantCreatePopup*/}
          {/*  isOpenEditPopup={isOpenEditPopup}*/}
          {/*  setIsOpenEditPopup={setIsOpenEditPopup}*/}
          {/*  editData={editData}*/}
          {/*  isEdit={isEdit}*/}
          {/*  handleCreateUpdateData={handleCreateUpdateData}*/}
          {/*/>*/}
          {/*}*/}

        </div>

      </div>


      <TableContainer component={Paper} className={commonStyle.tableScroll}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell size={'small'}>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  Check all
                </Checkbox>
              </TableCell>
              <TableCell size={'small'}>Email</TableCell>
              <TableCell align="center" size={'medium'}>Wallet Address</TableCell>
              <TableCell align="center">Tier</TableCell>
              {/*<TableCell align="right">Actions</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>
                <TableCell size={'small'}>
                  <Checkbox
                    onChange={(e) => onCheckToAdd(e, row, index)}
                    checked={includes(addedUsers, row.wallet_address)}
                  ></Checkbox>
                </TableCell>

                <TableCell component="th" scope="row" size={'small'}>{row.email}</TableCell>
                <TableCell align="center" size={'medium'}>{row.wallet_address}</TableCell>
                <TableCell component="th" scope="row" size={'small'} align="center">
                  {row.tier}
                </TableCell>

                {/*<TableCell align="right">*/}
                {/*  <Button*/}
                {/*    variant="contained"*/}
                {/*    color="secondary"*/}
                {/*    onClick={(e) => deleteItem(e, row, index)}*/}
                {/*    style={{marginLeft: 10, marginTop: 10}}*/}
                {/*  >Delete</Button>*/}
                {/*</TableCell>*/}

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

export default withRouter(UserParticipant);

