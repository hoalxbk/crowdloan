import React, {useEffect, useState} from 'react';
import useStyles from "../../style";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button, makeStyles} from "@material-ui/core";
import moment from "moment";
import {DATETIME_FORMAT, TIERS} from "../../../../constants";
import {renderErrorCreatePool} from "../../../../utils/validate";
import BigNumber from "bignumber.js";
import CreateEditClaimConfigForm from "./CreateEditClaimConfigForm";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (id: number, startTime: any, endTime: any, minBuy: number, maxBuy: number, isEdit: boolean) => {
  return { id, startTime, endTime, minBuy, maxBuy, isEdit };
};

const createDefaultTiers = () => {
  return [
    // createData('-', null, null, 0, 1000, false),
    // createData('Dove', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 2000, false),
    // createData('Hawk', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 3000, false),
    // createData('Eagle', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 4000, false),
    // createData('Phoenix', moment().format(DATETIME_FORMAT), moment().add(1, 'd').format(DATETIME_FORMAT), 0, 5000, false),
  ];
};

function ClaimConfigTable(props: any) {
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
    if (poolDetail && poolDetail.campaignClaimConfig) {
      console.log('poolDetail.campaignClaimConfig-->item', poolDetail.campaignClaimConfig);

      const dataFormatted = poolDetail.campaignClaimConfig.map((item: any, index: any) => {
        return createData(
          index + 1,
          item.start_time ? moment(item.start_time * 1000).format(DATETIME_FORMAT) : null,
          item.end_time ? moment(item.end_time * 1000).format(DATETIME_FORMAT) : null,
          (new BigNumber(item.min_percent_claim)).toNumber(),
          (new BigNumber(item.max_percent_claim)).toNumber(),
          false,
        );
      });

      console.log('dataFormatted-->item', dataFormatted);

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
    if (!confirm('Do you want delete this record ?')) {
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
        <CreateEditClaimConfigForm
          isOpenEditPopup={isOpenEditPopup}
          setIsOpenEditPopup={setIsOpenEditPopup}
          renderError={renderError}
          editData={editData}
          isEdit={isEdit}
          handleCreateUpdateData={handleCreateUpdateData}
        />
      }

      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Claim Configuration</label>
      </div>
      <div className={classes.formControl}>
        <Button
          variant="contained"
          color="primary"
          onClick={openPopupCreate}
        >Create</Button>
      </div>
      <TableContainer component={Paper}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell align="right">End Time</TableCell>
              <TableCell align="right">Min Percent Claim</TableCell>
              <TableCell align="right">Max Percent Claim</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => {
              let startTime = row.startTime || '--';
              let endTime = row.endTime || '--';
              let minBuy = new BigNumber(row.minBuy || '0').toFixed();
              let maxBuy = new BigNumber(row.maxBuy || '0').toFixed();
              return (
                <TableRow key={index}>
                  <TableCell>{startTime}</TableCell>
                  <TableCell align="right">{endTime}</TableCell>
                  <TableCell align="right">{minBuy}</TableCell>
                  <TableCell align="right">{maxBuy}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => openPopupEdit(e, row, index)}
                    >Edit</Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => deleteTier(e, row, index)}
                      style={{marginLeft: 10, marginTop: 0}}
                    >Delete</Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <input
        type="hidden"
        name="campaignClaimConfig"
        value={JSON.stringify(rows)}
        ref={register({
          // required: true
        })}
      />
    </>
  );
}

export default ClaimConfigTable;
