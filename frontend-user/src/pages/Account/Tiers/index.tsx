import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import { convertFromWei } from '../../../services/web3'

const warningIcon = '/images/icons/warning.svg';

const Tiers = (props: any) => {
  const styles = useStyles();

  const { data: userTier = {} } = useSelector((state: any) => state.userTier);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);

  const {
    showMoreInfomation = false,
  } = props;

  const [currentProcess, setCurrentProcess] = useState(0)

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
  }

  useEffect(() => {
    calculateProcess()
  }, [tiers, userTier, userInfo])

  return (
    <div className={`tiers__component`}>
      <div className={styles.title}>
        <img src={warningIcon} />
        <p>You don't have an X yet. Please upgrade your level</p>
      </div>
      <ul className={styles.tierList}>
        <li className="process" style={{width:`${currentProcess}%`}}></li>
        <li className={styles.tierInfo + ' ' + 'active'}>
          <div className="icon">
            <img src={TIERS[0].icon} />
          </div>
          <span className="tier-name">{TIERS[0].name}</span>
          { showMoreInfomation && <span>0</span> }
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if(tier != 0) {
            return <li key={tier} className={styles.tierInfo + (userTier > idx ? ' active' : '')}>
              <div className="icon">
                <img src={TIERS[idx + 1].icon} />
              </div>
              <span className="tier-name">{TIERS[idx + 1].name}</span>
              { showMoreInfomation && <span>{ convertFromWei(tier) }</span> }
            </li>
          }
        })}
      </ul>
    </div>
  );
};

export default Tiers;
