import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import { convertUnixTimeToDateTime } from '../../../utils/convertDate';
import CampaignProgress from '../../../components/Base/CampaignProgress';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import { convertFromWei } from '../../../services/web3'

const warningIcon = '/images/icons/warning.svg';

const Tiers = (props: any) => {
  const styles = useStyles();
  const { classNamePrefix = '',
    tiers = {},
    userTier = {},
    userInfo = {},
    showMoreInfomation = {},
  } = props;

  const [currentProcess, setCurrentProcess] = useState(0)

  // const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  // console.log('tierssxxxs', tiers)
  // console.log(showMoreInfomation)

  const calculateProcess = () => {
    if(_.isEmpty(tiers) || _.isEmpty(userTier) || _.isEmpty(userInfo)) return
    let idx = 0
    tiers.forEach((tier: any) => {
      if(tier > userInfo.staked) {
        return
      }
      idx++
    });
    const tierA = parseFloat(tiers[idx - 1])
    const tierB = parseFloat(tiers[idx])
    let currentProcess = parseInt(userTier) * 100 / tiers.length + (parseFloat(userInfo.staked) - tierA) * 100 /((tierB - tierA) * tiers.length)
    if(currentProcess > 100) currentProcess = 100
    setCurrentProcess(currentProcess)
    console.log('${currentProcess}%', `${currentProcess}%`)
  }

  useEffect(() => {
    calculateProcess()
  }, [tiers, userTier, userInfo])

  return (
    <div className={`${classNamePrefix}__component`}>
      <div className={styles.title}>
        <img src={warningIcon} />
        <p>You don't have an X yet. Please upgrade your level</p>
      </div>
      <ul className={styles.tierList}>
        <li className="process" style={{width:`${currentProcess}%`}}></li>
        <li className={styles.tierInfo}>
          <div className="icon">
            <img src={TIERS[0].icon} />
          </div>
          <span className="tier-name">{TIERS[0].name}</span>
          { showMoreInfomation && <span>0</span> }
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if(tier != 0) {
            return <li key={tier} className={styles.tierInfo}>
              <div className="icon">
                <img src={TIERS[idx + 1].icon} />
              </div>
              <span className="tier-name">{TIERS[idx + 1].name}</span>
              { showMoreInfomation && <span>{ convertFromWei(tier) }</span> }
              {/* <Tooltip title={<p style={{ fontSize: 15 }}>{tier}</p>}>
                <div className={`${classNamePrefix}__tier-title ${classNamePrefix}__tier-title--wordBreak`}>
                  {tier}
                </div>
              </Tooltip> */}
            </li>
          }
        })}
      </ul>
    </div>
  );
};

export default Tiers;
