import React, {useEffect} from 'react';
import {TableCell, TableRow, Tooltip} from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
import {Link} from 'react-router-dom';

import useStyles from './style';
import {adminRoute} from "../../../utils";

type AdminProps = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  wallet_address: string;
  status: number;
}

type AdminRowProps = {
  admin: AdminProps;
  currentOpen: string;
  setCurrentOpen: (id: string) => void;
}

const AdminRecord: React.FC<AdminRowProps> = (props: AdminRowProps) => {
  const { admin, currentOpen, setCurrentOpen } = props;
  const classes = useStyles();
  const { ref, isVisible, setIsVisible } =  useComponentVisible();

  useEffect(() => {
    currentOpen && setCurrentOpen("");
  }, [admin]);

  useEffect(() => {
    setIsVisible(admin.id === currentOpen);
  }, [currentOpen]);

  const getActiveStatus = (admin: AdminProps) => {
    switch (admin.status) {
      case 0:
        return 'Inactive';
      case 1:
        return 'Active';
    }

    return '';
  };

  return (
    <TableRow
      ref={ref} className={classes.tableRow} key={admin.id} component={Link}
      to={
        adminRoute(`/admin-detail/${admin.id}`)
      }
    >

      <TableCell className={classes.tableCell} align="left">
        {admin.id}
      </TableCell>


      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.username}</p>}>
              <span className={classes.wordBreak}>
                {admin.username}
              </span>
        </Tooltip>
      </TableCell>


      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.email}</p>}>
              <span className={classes.wordBreak}>
                {admin.email}
              </span>
        </Tooltip>
      </TableCell>


      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{(admin.firstname || '') + ' ' + (admin.lastname || '')}</p>}>
              <span className={classes.wordBreak} style={{ width: 100 }}>
                {(admin.firstname || '') + ' ' + (admin.lastname || '')}
              </span>
        </Tooltip>
      </TableCell>


      <TableCell className={classes.tableCell} align="left">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.wallet_address}</p>}>
              <span className={classes.wordBreak}>
                {admin.wallet_address}
              </span>
        </Tooltip>
      </TableCell>


      <TableCell className={classes.tableCell} align="left">
        <div className={classes.tableCellFlex}>

          <div className="left">
            <Tooltip title={<p style={{ fontSize: 15 }}>{getActiveStatus(admin)}</p>}>
              <span className={`admin-status admin-${getActiveStatus(admin).toLowerCase()}`}>
              </span>
            </Tooltip>
            {getActiveStatus(admin)}
          </div>

        </div>
      </TableCell>

    </TableRow>
  )

};

export default AdminRecord;
