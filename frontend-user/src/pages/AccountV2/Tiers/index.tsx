import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';
import useAuth from '../../../hooks/useAuth';
import withWidth, {isWidthDown, isWidthUp} from '@material-ui/core/withWidth';
import { getTiers, getUserInfo } from '../../../store/actions/sota-tiers';
import Tooltip from '@material-ui/core/Tooltip';
import { numberWithCommas } from '../../../utils/formatNumber';

const noticeIcon = '/images/icons/notice.svg';

const Tiers = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

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
    let process = (parseFloat(current) - tierA) * 100 /((tierB - tierA))
    if(process > 100) process = 100
    return process;
  }
  
  useEffect(() => {
    if(!_.isEmpty(tiers)) {
      setLoading(false);
    }
    if(wrongChain || !isAuth || !connectedAccount){
      setCurrentProcess(0)
      return
    }
    if(showMoreInfomation && !_.isEmpty(userTier)) {
      // let process = userTier*100/(tiersBuyLimit.length - 1)
      setCurrentProcess(100);
      return;
    }
    if(!showMoreInfomation && !_.isEmpty(userInfo) && !_.isEmpty(userTier)) {
      let process = calculateProcess(tiers, userInfo.totalStaked);
      setCurrentProcess(process);
    }
  }, [tiers, userTier, userInfo, tiersBuyLimit, showMoreInfomation, tokenSymbol, connectedAccount, isAuth, wrongChain])

  useEffect(() => {
    dispatch(getTiers());
    if (isAuth && connectedAccount && !wrongChain) { 
      dispatch(getUserInfo(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount])

  useEffect(() => {
    if(currentProcess != undefined) setLoading(false)
  }, [currentProcess])

  return (
    <div
      className={styles.tierComponent + (!loading ? ' active' : ' inactive') + (showMoreInfomation ? ' bg-none' : '')}
    >
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
        <li className={styles.tierInfo + ' active first-tier'}>
          {isWidthUp('sm', props.width) && <span
            className={"progress-bar"}
            style={{
              backgroundColor: TIERS[0].bgColor,
              width: userTier == 0 ? `${currentProcess || 0}%` : 'calc(100% - 1px)'
            }}
          ></span>}
          {isWidthDown('xs', props.width) && <span
            className={"progress-bar" + (loading ? ' inactive' : ' active')}
            style={{
              backgroundColor: TIERS[0].bgColor,
              height: userTier == 0 || !currentProcess ? `${currentProcess || 0}%` : 'calc(100% - 1px)'
            }}
          ></span>}
          <div>
            <div className="icon">
              <img src={TIERS[0].bg} alt=""/>
              <img src={TIERS[0].icon} />
            </div>
            <div className="info">
              <span className="tier-name"></span>
              <span className="tier-name"></span>
            </div>
          </div>
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if(tier != 0) {
            return <li key={tier} className={styles.tierInfo + (userTier > idx ? ' active ' : ' ') + TIERS[idx + 1].name}>
              {userTier > idx + 1 && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  transition: `all 1s ease ${idx + 1}s`
                }}
              ></span>}
              {userTier == idx + 1 && isWidthUp('sm', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  width: `${currentProcess}%`
                }}
              ></span>}
              {userTier == idx + 1 && isWidthDown('xs', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  height: `${currentProcess}%`
                }}
              ></span>}
              <div>
                <div className="icon">
                  <img src={TIERS[idx + 1].bg} alt=""/>
                  <img src={TIERS[idx + 1].icon} />
                </div>
                <div className="info">
                  <span className="tier-name">{TIERS[idx + 1].name}</span>
                  { !showMoreInfomation && <span>{tier} {tokenSymbol}</span> }
                  { showMoreInfomation && <span>{tiersBuyLimit[idx + 1]} {tokenSymbol}</span> }
                </div>
              </div>
            </li>
          }
        })}
      </ul>

      <div className={styles.tierNote}>
        <h3 className="title">
          Equivalent PKF&nbsp;&nbsp;
          <Tooltip title={<p style={{ fontSize: 15 }}>
            Equivalent PKF = PKF + Uniswap PKF*150 + sPKF*1
          </p>}>
            <img src={noticeIcon}/>
          </Tooltip>
        </h3>
        <span className="subtitle">{numberWithCommas(userInfo.totalStaked)} PKF</span>
        {!_.isEmpty(userTier) && <div className="notice">
          <img src={TIERS[userTier].icon}/>
          <div className="notice-content">
            <span>you are in Tier {TIERS[userTier].name}</span>
            <span>Please hold tokens in your wallet balance to maintain your tier! 
              <br/>Get a lottery ticket for each 1000 PKF hold</span>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default withWidth()(Tiers);
