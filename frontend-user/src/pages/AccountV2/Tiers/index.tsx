import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CONVERSION_RATE, TIERS } from '../../../constants';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';
import useAuth from '../../../hooks/useAuth';
import withWidth, {isWidthDown, isWidthUp} from '@material-ui/core/withWidth';
import { getTiers, getUserInfo } from '../../../store/actions/sota-tiers';
import Tooltip from '@material-ui/core/Tooltip';
import { numberWithCommas } from '../../../utils/formatNumber';

const noticeIcon = '/images/icons/notice.svg';

const Tiers = (props: any) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle();
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
    verifiedEmail
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
    dispatch(getUserInfo(connectedAccount || ''));
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
          {
            (verifiedEmail && connectedAccount) ?  (
              <p>
              {userTier > 0 ? `You are in tier ${getUserTierAlias(userTier as number).text}`: 'You are not in any tier yet'}. To upgrade your tier, please click <Link to="/account" className={styles.tierLinkToAccount}>here</Link>.
              </p> 
            ): (
              <p>
                You are not in any tier yet.
              </p> 
            )
          }
        </>
      </div>}
      <ul className={styles.tierList}>
        <li className={styles.tierInfo + ' active first-tier'}>
          {isWidthUp('sm', props.width) && connectedAccount && <span
            className={"progress-bar"}
            style={{
              backgroundColor: TIERS[0].bgColor,
              width: userTier > 0 ?  'calc(100% - 1px)' : `${currentProcess || 0}%`
            }}
          ></span>}
          {isWidthDown('xs', props.width) && connectedAccount && <span
            className={"progress-bar" + (loading ? ' inactive' : ' active')}
            style={{
              backgroundColor: TIERS[0].bgColor,
              height: userTier > 0 ?  'calc(100% - 1px)' : `${currentProcess || 0}%`
            }}
          ></span>}
          <div>
            <div className="icon">
              <img src={TIERS[0].bg} alt=""/>
              <img src={TIERS[0].icon} />
            </div>
            <div className="info">
              <span className="tier-name">{TIERS[0].name}</span>
              <span className="tier-name"></span>
            </div>
          </div>
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if(tier != 0) {
            return <li key={tier} className={styles.tierInfo + (userTier > idx ? ' active ' : ' ') + TIERS[idx + 1].name}>
              {userTier > idx + 1 && connectedAccount && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  transition: `all 1s ease ${idx + 1}s`
                }}
              ></span>}
              {userTier == idx + 1 && connectedAccount && isWidthUp('sm', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  width: `${currentProcess}%`
                }}
              ></span>}
              {userTier == idx + 1 && connectedAccount && isWidthDown('xs', props.width) && <span
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
                  { !showMoreInfomation && <span>{numberWithCommas(tier)} {tokenSymbol}</span> }
                  { showMoreInfomation && <span>{numberWithCommas(tiersBuyLimit[idx + 1])} {tokenSymbol}</span> }
                </div>
              </div>
            </li>
          }
        })}
      </ul>

      {!showMoreInfomation && <div className={styles.tierNote}>
        <h3 className="title">
          Equivalent PKF&nbsp;&nbsp;
          <Tooltip placement="top-start" classes={{ tooltip: commonStyle.tooltip }} enterDelay={500} leaveDelay={200} title={<p style={{ font: 'normal normal normal 12px/18px Helvetica' }}>
            Equivalent PKF = PKF + {CONVERSION_RATE[0].symbol}*150 + {CONVERSION_RATE[1].symbol}
          </p>}>
            <img src={noticeIcon}/>
          </Tooltip>
        </h3>
        <span className="subtitle">{(connectedAccount && isAuth && !wrongChain) ? numberWithCommas(userInfo.totalStaked || 0) : 0} PKF</span>
        {!_.isEmpty(userTier) && <div className="notice">
          <img src={TIERS[userTier].icon}/>
          <div className="notice-content">
            {(userTier > 0 && connectedAccount) ? <span>You are in Tier {TIERS[userTier].name}</span> : <span>You are not in any tier yet.</span>}
            <span>Please hold tokens in your wallet balance to maintain your tier!</span>
          </div>
        </div>}
      </div>}
    </div>
  );
};

export default withWidth()(Tiers);
