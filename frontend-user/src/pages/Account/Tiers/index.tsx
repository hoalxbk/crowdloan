import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';
import useAuth from '../../../hooks/useAuth';
//@ts-ignore
import { Fade } from 'react-reveal';

const warningIcon = '/images/icons/warning.svg';

const Tiers = (props: any) => {
  const styles = useStyles();

  const { data: userTier = '0' } = useSelector((state: any) => state.userTier);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const [loading, setLoading] = useState(true);
  const { isAuth, connectedAccount, wrongChain } = useAuth();

  const {
    showMoreInfomation = false,
    tiersBuyLimit,
    tokenSymbol,
  } = props;

  const [currentProcess, setCurrentProcess] = useState(undefined) as any;

  const calculateProcess = (ListData: any, current: any) => {
    current = 10;
    let tierA = 0;
    let tierB = 0;
    let overTier = true;
    for(let i = 0; i < ListData.length; i++) {
      if(ListData[i] > parseFloat(current) && overTier) {
        if(i == 0) {
          tierA = 0;
          tierB = ListData[0];
        } else {
          tierA = ListData[i - 1];
          tierB = ListData[i];
        }
        overTier = false;
      }
    }
    if(overTier) {
      return 100;
    }
    let process = (parseInt(userTier)) * 100 / ListData.length + (parseFloat(current) - tierA) * 100 /((tierB - tierA) * ListData.length)
    if(process > 100) process = 100
    return process;
  }
  
  useEffect(() => {
    if(wrongChain || !isAuth){
      setCurrentProcess(0)
      return
    }
    if(_.isEmpty(userInfo) || _.isEmpty(userTier)) return;
    if(!showMoreInfomation) {
      let process = calculateProcess(tiers, userInfo.staked);
      setCurrentProcess(process);
    } else if(showMoreInfomation) {
      let process = userTier*100/(tiersBuyLimit.length - 1)
      setCurrentProcess(process);
    }
    setLoading(false);
  }, [tiers, userTier, userInfo, tiersBuyLimit, showMoreInfomation, tokenSymbol, connectedAccount, isAuth, wrongChain])

  useEffect(() => {
    if(currentProcess) setLoading(false);
  }, [currentProcess])

  return (
    <div className={styles.tierComponent + (true ? ' active' : ' inactive')}>
      {showMoreInfomation && <div className={styles.title}>
        <>
          <p>
            You are in tier {userTier >= 0 && getUserTierAlias(userTier as number).text}.&nbsp; 
          To upgrade your tier, please click&nbsp;
          <Link to="/account" className={styles.tierLinkToAccount}>here</Link> !
          </p> 
        </>
      </div>}
      <ul className={styles.tierList}>
        <li className={(loading ? 'inactive ' : 'active ') + 'process'} style={{width:`${currentProcess}%`}}></li>
        <li className={styles.tierInfo + ' active'}>
          <div className="icon">
            <img src={TIERS[0].icon} />
          </div>
          <span className="tier-name">{TIERS[0].name}</span>
          {!showMoreInfomation && <span>0</span>}
          {showMoreInfomation && <span>{tiersBuyLimit[0]} {tokenSymbol}</span>}
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if(tier != 0) {
            return <li key={tier} className={styles.tierInfo + (userTier > idx ? ' active' : '')}>
              <div className="icon">
                <img src={TIERS[idx + 1].icon} />
              </div>
              <span className="tier-name">{TIERS[idx + 1].name}</span>
              { !showMoreInfomation && <span>{tier} {tokenSymbol}</span> }
              { showMoreInfomation && <span>{tiersBuyLimit[idx + 1]} {tokenSymbol}</span> }
            </li>
          }
        })}
      </ul>
    </div>
  );
};

export default Tiers;
