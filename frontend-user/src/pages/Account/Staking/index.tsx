import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import { convertUnixTimeToDateTime } from '../../../utils/convertDate';
import CampaignProgress from '../../../components/Base/CampaignProgress';
import _ from 'lodash';
const byTokenLogo = '/images/logo-in-buy-page.png';

const Tiers = (props: any) => {
  const { classNamePrefix = '', balance = {}, data = {} } = props;

  const { data: loginInvestor, loading: investorLoginLoading, error } = useSelector((state: any) => state.investor);

  useEffect(() => {
  });

  const onApproved = () => {
    
  }


  return (
    <div className={`${classNamePrefix}__container`}>
      <div className={`${classNamePrefix}__content`}>
        
      </div>
      <div className={`${classNamePrefix}__modal`}>
        <div className="head">
          <h2 className="title">you have no Sota</h2>
        </div>
        <div className="body">
          <div className="label">
            <label htmlFor="staking">INPUT</label>
            <label>Your balance: {balance}</label>
          </div>
          <div className="input-group__input">
            <input type="text"/>
            <button className="btn-max"></button>
            <img src={byTokenLogo} alt="logo" />
            <span>SOTA</span>
          </div>
        </div>
        <div className="foot">
          <button
            className="btn-approve"
          >approve</button>
          <button
            className="btn-staking"
          >staking</button>
          <button
            className="btn-cancel"
          >cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Tiers;
