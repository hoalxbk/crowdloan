import React, { useEffect } from 'react';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import BlockIcon from '@material-ui/icons/Block';
import { CircularProgress } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { getSettingDetail } from '../../store/actions/setting-detail';
import useStyles from './style';
import FreeRate from './FeeRate';
import { setFeeRate } from '../../store/actions/setting-fee-rate';
import { setRevenueAddress } from '../../store/actions/setting-revenue-address';
import { setOwner } from '../../store/actions/setting-owner';
import { deactivateSetting } from '../../store/actions/setting-deactivate';
import RevenueAddress from './RevenueAddress';
import Owner from './Owner';

const Setting = () => {
  const classes = useStyles();
  const mainClass = classes.settingPage;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSettingDetail());
  }, [dispatch]);

  const setFeeRateSubmit = (freeRate: string) => {
    dispatch(setFeeRate(freeRate));
  };

  const setRevenueAddressSubmit = (revenueAddress: string) => {
    dispatch(setRevenueAddress(revenueAddress));
  };

  const setOwnerSubmit = (owner: string) => {
    dispatch(setOwner(owner));
  };

  const setCampaignFactoryStatus = () => {
    dispatch(deactivateSetting());
  }

  const { data: loginUser = '', } = useSelector((state: any) => state.user);

  const { data: settingDetail = {}, loading: settingDetailLoading = false } = useSelector((state: any) => state.settingDetail);
  const { loading: settingFeeRateLoading = false } = useSelector((state: any) => state.settingFeeRate);
  const { loading: settingRevenueAddressLoading = false } = useSelector((state: any) => state.settingRevenueAddress);
  const { loading: settingOwnerLoading = false } = useSelector((state: any) => state.settingOwner);
  const { loading: settingDeactivateLoading = false } = useSelector((state: any) => state.settingDeactivate);

  const feeRate = _.get(settingDetail, 'feeRate', '');
  const revenueAddress = _.get(settingDetail, 'revenueAddress', '');
  const owner = _.get(settingDetail, 'owner', '');
  const isSuspend = _.get(settingDetail, 'isSuspend', '');

  const isOwnerRole = loginUser === owner;

  return (
    <DefaultLayout>
      <div className={mainClass}>
        <div className={`${mainClass}__box`}>
          <FreeRate
            mainClass={mainClass}
            defaultFeeRate={feeRate}
            setFeeRateSubmit={setFeeRateSubmit}
            loading={settingFeeRateLoading}
            isOwnerRole={isOwnerRole}
          />
        </div>

        <div className={`${mainClass}__box`}>
          <RevenueAddress
            mainClass={mainClass}
            defaultRevenueAddress={revenueAddress}
            setRevenueAddressSubmit={setRevenueAddressSubmit}
            loading={settingRevenueAddressLoading}
            isOwnerRole={isOwnerRole}
          />
        </div>

        <div className={`${mainClass}__box`}>
          <Owner
            mainClass={mainClass}
            defaultOwner={owner}
            setOwnerSubmit={setOwnerSubmit}
            loading={settingOwnerLoading}
            isOwnerRole={isOwnerRole}
          />
        </div>
        {
          isOwnerRole && (
            <button disabled={settingDeactivateLoading} className={`${mainClass}__cta ${isSuspend ? 'active': 'suspend'}`} onClick={setCampaignFactoryStatus}>
              {
                !isSuspend ? 'Deactivate': 'Active'
              }
              {
                settingDeactivateLoading ? <CircularProgress size={25} style={{ marginLeft: 10 }} /> : !isSuspend ?  <BlockIcon className={`${mainClass}__cta-icon`} />: <CheckIcon className={`${mainClass}__cta-icon`} />
              }
            </button>
          )
        }

      </div>
    </DefaultLayout>
  );
};

export default Setting;
