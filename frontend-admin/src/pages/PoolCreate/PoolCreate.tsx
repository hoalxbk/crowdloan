import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import {useForm} from 'react-hook-form';

import {useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {useCommonStyle} from '../../styles';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import ButtonLink from '../../components/Base/ButtonLink';
import {createCampaign} from '../../store/actions/campaign';
import {TokenType} from '../../utils/token';
import {isFactorySuspended} from '../../utils/campaignFactory';
import {adminRoute} from "../../utils";
import ExchangeRate from "./Components/ExchangeRate";
import TokenAddress from "./Components/TokenAddress";
import AddressReceiveMoney from "./Components/AddressReceiveMoney";
import DurationTime from "./Components/DurationTimes";
import BuyType from "./Components/BuyType";
import PoolType from "./Components/PoolType";
import NetworkAvailable from "./Components/NetworkAvailable";
import AcceptCurrency from "./Components/AcceptCurrency";
import PoolDescription from "./Components/PoolDescription";
import TokenLogo from "./Components/TokenLogo";
import PoolBanner from "./Components/PoolBanner";
import TotalCoinSold from "./Components/TotalCoinSold";
import MinTier from "./Components/MinTier";
import TierTable from "./Components/TierTable";
import {createPool} from "../../request/pool";
import {alertFailure, alertSuccess} from "../../store/actions/alert";
import PoolForm from "./PoolForm";
import BackButton from "../../components/Base/ButtonLink/BackButton";

const PoolCreate: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = false;

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/campaigns')}/>
      <PoolForm
        isEdit={isEdit}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolCreate);
