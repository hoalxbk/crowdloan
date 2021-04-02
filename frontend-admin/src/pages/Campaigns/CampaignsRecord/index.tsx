import React, { useState, useEffect } from 'react';
import { TableRow, TableCell, DialogContent, Divider, Tooltip, Popper } from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { Link } from 'react-router-dom';
import moment from "moment";

import useStyles from './style';
import {adminRoute, publicRoute} from "../../../utils";

const CAMPAIGN_BLOCKCHAIN_STATUS = {
  REGISTRATION_WAITING_TX_FROM_CLIENT: 0,
  REGISTRATION_WAITING_CONFIRMATION: 1,
  REGISTRATION_CONFIRMED: 2,
  DELETION_WAITING_TX_FROM_CLIENT: 3,
  DELETION_WAITING_CONFIRMATION: 4,
  DELETION_CONFIRMED: 5,
  ACTIVATION_ACCOUNT_TX_FROM_CLIENT: 6,
  INACTIVE: 7,
  REGISTRATION_TX_FAILED: 10,
  DELETION_TX_FAILED: 11
};

type CampaignProps = {
  id: string;
  title: string;
  token: string;
  start_time: number;
  finish_time: number;
  affiliate: number;
  tokenGet: number;
  ethFor: number;
  campaign_hash: string;
  symbol: string;
  is_pause: number;
  blockchain_status: number;
}

type CampaignsRecordProps = {
  campaign: CampaignProps;
  currentOpen: string;
  setCurrentOpen: (id: string) => void;
}

const CampaignsRecord: React.FC<CampaignsRecordProps> = (props: CampaignsRecordProps) => {
  const { campaign, currentOpen, setCurrentOpen } = props;
  const classes = useStyles();

  const today = new Date();
  const canBuy = today >= new Date(campaign.start_time * 1000) && today <= new Date(campaign.finish_time * 1000) && campaign.is_pause === 0;

  const { ref, isVisible, setIsVisible } =  useComponentVisible();

  useEffect(() => {
    currentOpen && setCurrentOpen("");
  }, [campaign]);

  useEffect(() => {
    setIsVisible(campaign.id === currentOpen);
  }, [currentOpen]);

  const getCampaignStatus = (campaign: CampaignProps) => {
    // // CAMPAIGN_BLOCKCHAIN_STATUS.REGISTRATION_TX_FAILED = 10
    // if (campaign.blockchain_status == CAMPAIGN_BLOCKCHAIN_STATUS.REGISTRATION_TX_FAILED && campaign.is_pause == 2) {
    //   return 'Fail';
    // }

    switch (campaign.is_pause) {
      case 0:
        return 'Active';
      case 1:
        return 'Suspend';
      case 2:
        return 'Processing';
    }

    return '';
  }

  return (
      <TableRow ref={ref} className={classes.tableRow} key={campaign.id} component={Link}
        to={
          adminRoute(`/campaign-detail/${campaign.campaign_hash || `pending/${campaign.id}`}`)
        }>
          <TableCell className={classes.tableCellTitle} component="td" scope="row">
            <Tooltip title={<p style={{ fontSize: 15 }}>{campaign.title}</p>}>
              <span className={classes.wordBreak}>
                {campaign.title}
              </span>
            </Tooltip>
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {/*{convertUnixTimeToDateTime(campaign.start_time)}*/}
            {moment.unix(campaign.start_time).format("hh:mm:ss A")}<br/>
            &nbsp;
            {moment.unix(campaign.start_time).format("MM/DD/YYYY")}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {/*{convertUnixTimeToDateTime(campaign.finish_time)}*/}
            {moment.unix(campaign.finish_time).format("hh:mm:ss A")}<br/>
            &nbsp;
            {moment.unix(campaign.finish_time).format("MM/DD/YYYY")}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            <Tooltip title={<p style={{ fontSize: 15 }}>{campaign.symbol}</p>}>
              <span className={classes.wordBreak} style={{ width: 100 }}>
                {campaign.symbol}
              </span>
            </Tooltip>
          </TableCell>
          {/*<TableCell className={classes.tableCell} align="left">*/}
          {/*  <Tooltip title={<p style={{ fontSize: 15 }}>{getCampaignStatus(campaign)}</p>}>*/}
          {/*    <span className={`campaign-status campaign-${getCampaignStatus(campaign).toLowerCase()}`}>*/}
          {/*    </span>*/}
          {/*  </Tooltip>*/}
          {/*  {getCampaignStatus(campaign)}*/}
          {/*</TableCell>*/}
          <TableCell className={classes.tableCell} align="left">
            <div className={classes.tableCellFlex}>
              <div className="left">
                {/*<img src={`/images/${campaign.affiliate === 1 ? 'icon_check.svg': 'icon_close.svg'}`} alt="icon-affiliate" />*/}
                {/*<span className={campaign.affiliate === 1 ? 'check': 'cancel'}>{campaign.affiliate === 1 ? 'Yes': 'No'}</span>*/}
                <Tooltip title={<p style={{ fontSize: 15 }}>{getCampaignStatus(campaign)}</p>}>
                  <span className={`campaign-status campaign-${getCampaignStatus(campaign).toLowerCase()}`}>
                  </span>
                </Tooltip>
                {getCampaignStatus(campaign)}
              </div>
              <div className="right">
                <img  src='/images/icon_menu.svg' alt="icon-menu" onClick={(e) => {
                  e.preventDefault();

                  if (campaign.id === currentOpen && isVisible) {
                    setIsVisible(false);
                    setCurrentOpen("");
                    return;
                  }

                  setCurrentOpen(campaign.id);
                  setIsVisible(true);
                }} />
                <Popper
                    open={isVisible}
                    disablePortal
                    className={classes.editDialog}
                >
                  <DialogContent className={classes.editDialogContent}>
                    <Link className={`${classes.editDialogView} dialog-cta`}
                      to={
                        adminRoute(`/campaign-detail/${campaign.campaign_hash || `pending/${campaign.id}`}`)
                      }
                    >View</Link>
                    {
                      canBuy && (
                          <>
                            <Divider />
                            <Link className={`${classes.editDialogButton} dialog-cta`} to={publicRoute(`/buy-token?campaignId=${campaign.campaign_hash}`)}>Buy Token</Link>
                          </>
                      )
                    }
                  </DialogContent>
                </Popper>
              </div>
            </div>
        </TableCell>
      </TableRow>
  )

};

export default CampaignsRecord;
