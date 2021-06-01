import React, {useEffect, useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Button, makeStyles} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {deleteParticipantUser, deleteWinnerUser, getWinnerUser} from "../../../../request/participants";
import useGetList from "../hooks/useGetList";
import useDeleteItem from "../hooks/useDeleteItem";
import Pagination from "@material-ui/lab/Pagination";
import useStylesTable from './style_table';
import {etherscanRoute} from "../../../../utils";
import Link from "@material-ui/core/Link";
import useMapMaxBuyTier from "../hooks/useMapMaxBuyTier";
import BigNumber from "bignumber.js";

function UserWinner(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const { poolDetail } = props;

  const {
    rows,
    search, searchDelay,
    failure, loading,
    lastPage, currentPage, totalRecords,
    handlePaginationChange,
  } = useGetList({ poolDetail, handleSearchFunction: getWinnerUser });

  const {
    deleteItem
  } = useDeleteItem({
    poolDetail,
    handleDeleteFunction: deleteWinnerUser,
    handleSearchFunction: search
  });

  const {
    maxBuyTiersMapping,
    minBuyTiersMapping,
  } = useMapMaxBuyTier({ poolDetail });

  console.log('poolDetail', poolDetail, maxBuyTiersMapping, minBuyTiersMapping);

  return (
    <>
      <div style={{color: 'red'}}>
        <div>These Winner list accounts still have to check their tier when buying tokens. If you want to skip this check, please add accounts to the Reserve list.</div>
      </div>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search" />
        <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />
      </div>

      <TableContainer component={Paper} className={`${commonStyle.tableScroll} ${classesTable.tableUserJoin}`}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="center">Wallet Address</TableCell>
              <TableCell align="center">Lottery Ticket</TableCell>
              <TableCell align="center">Level</TableCell>
              <TableCell align="center">Min Buy</TableCell>
              <TableCell align="center">Max Buy</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>

                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>

                <TableCell align="center">
                  <Link href={etherscanRoute(row.wallet_address, poolDetail)} target={'_blank'}>
                    {row.wallet_address}
                  </Link>
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {row.lottery_ticket || 0}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {row.level || 0}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {minBuyTiersMapping[row.level || 0]}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {new BigNumber(maxBuyTiersMapping[row.level || 0]).multipliedBy(row.lottery_ticket || 0).toFixed()}
                </TableCell>


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

export default UserWinner;
