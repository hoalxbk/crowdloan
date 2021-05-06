import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button, makeStyles} from "@material-ui/core";
import CreateEditTierForm from "./CreateEditTierForm";
import moment from "moment";
import {DATETIME_FORMAT, TIERS} from "../../../constants";
import {renderErrorCreatePool} from "../../../utils/validate";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import BigNumber from "bignumber.js";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (name: string, startTime: string, endTime: string, minBuy: number, maxBuy: number, isEdit: boolean, ticket_allow_percent = 0) => {
  return { name, startTime, endTime, minBuy, maxBuy, isEdit, ticket_allow_percent };
};

const createDefaultTiers = () => {
  return [
    createData('-', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 1000, false),
    createData('Dove', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 2000, false),
    createData('Hawk', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 3000, false),
    createData('Eagle', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 4000, false),
    createData('Phoenix', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 5000, false),
  ];
};

function TierTable(props: any) {
  const classes = useStyles();
  const classesTable = useStylesTable();
  const {
    register, watch,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);
  const [rows, setRows] = useState(createDefaultTiers());

  useEffect(() => {
    if (poolDetail && poolDetail.tiers) {
      const dataFormatted = poolDetail.tiers.map((item: any, index: any) => {
        return createData(
          TIERS[index],
          moment.unix(item.start_time).format(DATETIME_FORMAT),
          moment.unix(item.end_time).format(DATETIME_FORMAT),
          (new BigNumber(item.min_buy)).toNumber(),
          (new BigNumber(item.max_buy)).toNumber(),
          false,
          item.ticket_allow_percent || 0,
        );
      });
      setRows(dataFormatted);
    }
  }, [poolDetail]);

  const openPopupEdit = (e: any, row: any, index: number) => {
    console.log('ROW: ', row, index);
    setEditData(row);
    setEditRow(index);
    setIsEdit(true);
    setIsOpenEditPopup(true);
  };

  const openPopupCreate = (e: any) => {
    setEditData({});
    setEditRow(-1);
    setIsEdit(false);
    setIsOpenEditPopup(true);
  };

  const handleCreateUpdateData = (responseData: any) => {
    console.log('responseData', editRow, responseData);
    if (isEdit && editRow !== -1) {
      // Update
      // @ts-ignore
      rows[editRow] = responseData;
    } else {
      // Create
      // @ts-ignore
      rows.push(responseData);
    }
    setIsOpenEditPopup(false);
  };

  const deleteTier = (e: any, row: any, index: number) => {
    console.log('ROW: ', row, index);
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want delete this tier?')) {
      return false;
    }

    const newRows = [...rows];
    if (index > -1) {
      newRows.splice(index, 1);
    }
    setRows(newRows);
  };

  const acceptCurrency = watch('acceptCurrency');
  const minTier = watch('minTier');
  const isDeployed = !!poolDetail?.is_deploy;
  return (
    <>
      {isOpenEditPopup &&
        <CreateEditTierForm
          isOpenEditPopup={isOpenEditPopup}
          setIsOpenEditPopup={setIsOpenEditPopup}
          renderError={renderError}
          editData={editData}
          isEdit={isEdit}
          handleCreateUpdateData={handleCreateUpdateData}
        />
      }

      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Tier Configuration</label>
      </div>
      {/*<div className={classes.formControl}>*/}
      {/*  <Button*/}
      {/*    variant="contained"*/}
      {/*    color="primary"*/}
      {/*    onClick={openPopupCreate}*/}
      {/*  >Create</Button>*/}
      {/*</div>*/}
      <TableContainer component={Paper}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Allocation (%)</TableCell>
              <TableCell align="right">Start Buy Time</TableCell>
              <TableCell align="right">End Time</TableCell>
              <TableCell align="right">Min Buy</TableCell>
              <TableCell align="right">Max Buy</TableCell>
              <TableCell align="right">Currency</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => {
              let startTime = row.startTime;
              let endTime = row.endTime;
              let minBuy = new BigNumber(row.minBuy || '0').toFixed();
              let maxBuy = new BigNumber(row.maxBuy || '0').toFixed();
              if (index < minTier) {
                startTime = '--';
                endTime = '--';
                minBuy = '0';
                maxBuy = '0';
              }

              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.ticket_allow_percent || 0}</TableCell>
                  <TableCell align="right">{startTime}</TableCell>
                  <TableCell align="right">{endTime}</TableCell>
                  <TableCell align="right">{minBuy}</TableCell>
                  <TableCell align="right">{maxBuy}</TableCell>
                  <TableCell align="right">{(acceptCurrency + '').toUpperCase()}</TableCell>
                  <TableCell align="right">

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => openPopupEdit(e, row, index)}
                      disabled={isDeployed || (index < minTier)}
                    >Edit</Button>

                    {/*<Button*/}
                    {/*  variant="contained"*/}
                    {/*  color="secondary"*/}
                    {/*  onClick={(e) => deleteTier(e, row, index)}*/}
                    {/*  style={{marginLeft: 10, marginTop: 10}}*/}
                    {/*>Delete</Button>*/}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <input
        type="hidden"
        name="tierConfiguration"
        value={JSON.stringify(rows)}
        ref={register({
          // required: true
        })}
      />
    </>
  );
}

export default TierTable;
