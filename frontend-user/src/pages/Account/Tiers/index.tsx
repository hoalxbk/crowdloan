import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';

const warningIcon = '/images/icons/warning.svg';

const Tiers = (props: any) => {
  const styles = useStyles();

  const { data: userTier = {} } = useSelector((state: any) => state.userTier);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);

  const {
    showMoreInfomation = false,
    tiersBuyLimit,
    tokenSymbol
  } = props;

  const [currentProcess, setCurrentProcess] = useState(0)
  
  useEffect(() => {
    if(_.isEmpty(tiers) || _.isEmpty(userTier) || _.isEmpty(userInfo)) return
    let tierA = 0;
    let tierB = 0;
    let overTier = true;
    tiers.forEach((tier: any) => {
    if(tier > parseFloat(userInfo.staked) && overTier) {
        tierA = tierB;
        tierB = tier;
        overTier = false;
        return
      }
    });
    if(overTier) {
      setCurrentProcess(100)
      return
    }

    let process = (parseInt(userTier)) * 100 / tiers.length + (parseFloat(userInfo.staked) - tierA) * 100 /((tierB - tierA) * tiers.length)
    if(process > 100) process = 100
    console.log(process)
    setCurrentProcess(process)
  }, [tiers, userTier, userInfo])

  return (
    <div className={`tiers__component`}>
      <div className={styles.title}>
        {
          userTier >= 0 && ( 
            <>
              <img src={warningIcon} />
              <p>
              You are in tier <strong>{getUserTierAlias(userTier as number).text}</strong>. To upgrade your tier, please click&nbsp;
              <Link to="/account" className={styles.tierLinkToAccount}>here</Link> !
              </p> 
            </>
         )
        }
      </div>
      <ul className={styles.tierList}>
        <li className="process" style={{width:`${currentProcess}%`}}></li>
        <li className={styles.tierInfo + ' active'}>
          <div className="icon">
            <img src={TIERS[0].icon} />
          </div>
          <span className="tier-name">{TIERS[0].name}</span>
          {!showMoreInfomation && <span>0</span>}
          {showMoreInfomation && <span>0</span>}
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if(tier != 0) {
            return <li key={tier} className={styles.tierInfo + (userTier > idx ? ' active' : '')}>
              <div className="icon">
                <img src={TIERS[idx + 1].icon} />
              </div>
              <span className="tier-name">{TIERS[idx + 1].name}</span>
              { showMoreInfomation && <span>{tiersBuyLimit[idx]} {tokenSymbol}</span> }
              { !showMoreInfomation && <span>{tier} {tokenSymbol}</span> }
            </li>
          }
        })}
      </ul>
    </div>
  );
};

export default Tiers;
