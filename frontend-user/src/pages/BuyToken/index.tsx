import { useState, useEffect, useCallback } from 'react';
import { HashLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
//@ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
import BigNumber from 'bignumber.js'; 

import { useTypedSelector } from '../../hooks/useTypedSelector';
import usePoolDetailsMapping, { PoolDetailKey, poolDetailKey } from './hooks/usePoolDetailsMapping';
import useAuth from '../../hooks/useAuth';
import usePoolDetails from '../../hooks/usePoolDetails';
import useTokenSoldProgress from './hooks/useTokenSoldProgress';
import usePoolJoinAction from './hooks/usePoolJoinAction';
import useFetch from '../../hooks/useFetch';

import Tiers from '../Account/Tiers';
import LotteryWinners from './LotteryWinners';
import PoolAbout from './PoolAbout';
import ClaimToken from './ClaimToken';
import BuyTokenForm from './BuyTokenForm';
import Button from './Button';
import Countdown from '../../components/Base/Countdown';
import DefaultLayout  from '../../components/Layout/DefaultLayout';
import { ETH_CHAIN_ID } from '../../constants/network';

import { login } from '../../store/actions/user';
import { getUserTierAlias } from '../../utils/getUserTierAlias';
import { getPoolStatus } from '../../utils/getPoolStatus';
import { numberWithCommas } from '../../utils/formatNumber';
import { getTiers, getUserInfo, getUserTier } from '../../store/actions/sota-tiers';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import useStyles from './style';

const copyImage = "/images/copy.svg";
const poolImage = "/images/pool_circle.svg";

enum HeaderType {
  Main = "Main",
  About = "About the project",
  Participants = "Winner"
}

const headers = [HeaderType.Main, HeaderType.About, HeaderType.Participants];

const ETHERSCAN_BASE_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL; 

const BuyToken: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [showRateReserve, setShowRateReverse] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeNav, setActiveNav] = useState(HeaderType.Main);

  const { library } = useWeb3React();
  const { id } = useParams() as any;
  const { appChainID } = useTypedSelector(state => state.appNetwork).data;
  const { poolDetails, loading: loadingPoolDetail } = usePoolDetails(id);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const tokenDetails = poolDetails?.tokenDetails;
  // Should replace hard string by pool address
  const { tokenSold, totalSell, soldProgress } = useTokenSoldProgress(
      poolDetails?.poolAddress, 
      tokenDetails, 
      poolDetails?.networkAvailable 
  );
  const { joinPool, poolJoinLoading, joinPoolSuccess } = usePoolJoinAction({ poolId: poolDetails?.id });
  const { data: winners } = useFetch<Array<any>>(
    `/pool/${poolDetails?.id}/winners`, poolDetails?.method !== "whitelist" 
  );
  const { data: alreadyJoinPool } = useFetch<boolean>(
    `/user/check-join-campaign/${poolDetails?.id}`);
  const poolDetailsMapping = usePoolDetailsMapping(poolDetails);

  // Use for check whether pool exist in selected network or not
  const networkAvailable = poolDetails?.networkAvailable === 'eth'? 'Ethereum': 'BinanceChain' ;
  const appNetwork = appChainID === ETH_CHAIN_ID ? 'eth': 'bsc';
  const ableToFetchFromBlockchain = appNetwork === poolDetails?.networkAvailable && !wrongChain;

  const userBuyLimit = poolDetails?.connectedAccountBuyLimit || 0;
  
  // With Whitelist situation, Enable when join time < current < end join time
  // With FCFS, always disable join button
  const joinTimeInDate = new Date(Number(poolDetails?.joinTime) * 1000);
  const endJoinTimeInDate = new Date(Number(poolDetails?.endJoinTime) * 1000);
  const startBuyTimeInDate = new Date(Number(poolDetails?.startBuyTime) * 1000);
  const endBuyTimeInDate = new Date(Number(poolDetails?.endBuyTime) * 1000);
  const releaseTimeInDate = new Date(Number(poolDetails?.releaseTime) * 1000);

  const availableJoin = poolDetails?.method === 'whitelist' 
    ? new Date() >= joinTimeInDate && new Date() <= endJoinTimeInDate
    : false;
  const availablePurchase = new Date() >= startBuyTimeInDate && new Date() <= endBuyTimeInDate;
  
  // Get Pool Status
  const poolStatus = getPoolStatus(
    joinTimeInDate, 
    endJoinTimeInDate, 
    startBuyTimeInDate, 
    endBuyTimeInDate,
    new BigNumber(tokenSold).div(totalSell).toFixed()
  );
  // Get Pool mintier
  const poolMinTier = getUserTierAlias(poolDetails?.minTier || 0);

  const displayCountDownTime = useCallback((
    method: string | undefined, 
    startJoinTime: Date | undefined, 
    endJoinTime: Date| undefined,
    startBuyTime: Date | undefined,
    endBuyTime: Date | undefined
  ) => {
    const today = new Date().getTime();
    let date;
    let display;

    if (method && method === "whitelist" && startJoinTime && endJoinTime && startBuyTime && endBuyTime) {

      if (today < startJoinTime.getTime()) {
        date = startJoinTime; 
        display = "Start in";
      }

      if (today > startJoinTime.getTime() && today < endJoinTime.getTime()) {
        date = endJoinTime;
        display = "End in";
      }

      if (today > endJoinTime.getTime() && today < startBuyTime.getTime()) {
        date = startBuyTime;
        display = "Start buy in"
      }

      if (today > startBuyTime.getTime() && today < endBuyTime.getTime()) {
        date =  endBuyTime;
        display = "End buy in";
      }

    }

    if (method && method === "fcfs" && startBuyTime && endBuyTime) {
      if (today < startBuyTime.getTime()) {
        date = startJoinTime; 
        display = "Start buy in"
      }

      if (today > startBuyTime.getTime() && today < endBuyTime.getTime()) {
        date = endBuyTime;
        display = "End buy in";
      }
    }

    return {
      date,
      display
    }
  }, [poolDetails?.method, joinTimeInDate, endJoinTimeInDate, startBuyTimeInDate, endBuyTimeInDate]);

  const { date: countDownDate, display } = displayCountDownTime(poolDetails?.method, joinTimeInDate, endJoinTimeInDate, startBuyTimeInDate, endBuyTimeInDate)

  const shortAdress = (address: string, digits: number = 4) => {
    return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
  }

  useEffect(() => {
    if (endBuyTimeInDate < new Date() && activeNav === HeaderType.Main) setActiveNav(HeaderType.About);
  }, [endBuyTimeInDate]);

  useEffect(() => {
    // Check if user is winning ticket or not
    if (poolDetails?.method === "whitelist" && winners && winners.length > 0) {
      let isFound = false;
      setIsWinner(false);

      winners.forEach(winner => {
        if (winner.wallet_address === connectedAccount && !isFound) {
          console.log(`Account ${connectedAccount} won ticket`);
          setIsWinner(true);
        }
      });
    }
  }, [poolDetails, winners, connectedAccount]);

  useEffect(() => {
    const poolNetwork = poolDetails?.networkAvailable;
    if (isAuth && connectedAccount && poolDetails && ableToFetchFromBlockchain) { 
      dispatch(getTiers(poolNetwork)) 
      dispatch(getUserInfo(connectedAccount, poolNetwork));
      dispatch(getUserTier(connectedAccount, poolNetwork));
    }
  }, [isAuth, connectedAccount, ableToFetchFromBlockchain, poolDetails]);

  return (
    <DefaultLayout>
      <div className={styles.poolDetailContainer}>
        <header className={styles.poolDetailHeader}> 
          <div className={styles.poolHeaderWrapper}>
            <div className={styles.poolHeaderImage}>
              <img src={poolDetails?.banner || poolImage} alt="pool-image" className={styles.poolImage}/>
            </div>
            <div className={styles.poolHeaderInfo}>
              {isWidthUp('sm', props.width) && <h2 className={styles.poolHeaderTitle}>
                {poolDetails?.title}
                <p className={styles.poolHeaderType}>
                  <img src={poolDetails?.networkIcon} />
                  <span style={{ fontWeight: 600, marginLeft: 10 }}>{networkAvailable}</span>
                </p>
                <p className={`${styles.poolStatus} ${styles.poolStatus}--${poolStatus}`}>
                  {poolStatus}
                </p>
                <img src={poolMinTier?.icon} alt={poolMinTier?.text} style={{ marginLeft: 20, width: 20 }} />
              </h2>}
              {isWidthDown('xs', props.width) && <h2 className={styles.poolHeaderTitle}>
                <div>
                  {poolDetails?.title}
                  <img src={poolMinTier?.icon} alt={poolMinTier?.text} style={{ marginLeft: 20, width: 20 }} />
                </div>
                <div>
                  <p className={styles.poolHeaderType}>
                    <img src={poolDetails?.networkIcon} />
                    <span style={{ fontWeight: 600, marginLeft: 10 }}>{networkAvailable}</span>
                  </p>
                  <p className={`${styles.poolStatus} ${styles.poolStatus}--${poolStatus}`}>
                    {poolStatus}
                  </p>
                </div>
              </h2>}
              <p className={styles.poolHeaderAddress}>
                {isWidthUp('sm', props.width) && poolDetails?.poolAddress}
                {isWidthDown('xs', props.width) && shortAdress(poolDetails?.poolAddress || '', 8)}
                <CopyToClipboard text={poolDetails?.poolAddress}
                  onCopy={() => { 
                    setCopiedAddress(true);
                    setTimeout(() => {
                      setCopiedAddress(false);
                    }, 2000);
                  }}
                >
                  {
                    !copiedAddress ? <img src={copyImage} alt="copy-icon" className={styles.poolHeaderCopy} />
                    : <p style={{ color: '#6398FF', marginLeft: 10 }}>Copied</p>
                  }
                </CopyToClipboard>
              </p>
            </div>
          </div>
          {isWinner && 
            <p className={styles.poolTicketWinner}>
              {
                [...Array(3)].map((num, index) => (
                  <img src="/images/fire-cracker.svg" alt="file-cracker" key={index} />
                ))
              }
              <span style={{ marginLeft: 14 }}>
                Congratulations on your purchase of the lottery ticket at this pool !
              </span>
            </p>
          }
        </header>
        <main className={styles.poolDetailInfo}>
          <div className={styles.poolDetailTierWrapper}>
            <div className={styles.poolDetailIntro}>
            {
              (loadingPoolDetail) ? (
                <div className={styles.loader}>
                  <HashLoader loading={true} color={'#3232DC'} />
                  <p className={styles.loaderText}>
                    <span style={{ marginRight: 10 }}>Loading Pool Details ...</span>
                  </p>
                </div>
              ):  poolDetailsMapping && 
              ( 
                <>
                  {
                    Object.keys(poolDetailsMapping).map((key: string) => {
                      const poolDetail = poolDetailsMapping[key as poolDetailKey];
                      return (
                        <div className={styles.poolDetailBasic} key={key}>
                          <span className={styles.poolDetailBasicLabel}>{poolDetail.label}</span>
                          <p className={styles.poolsDetailBasicText}>
                            <span>
                            {
                              key !== PoolDetailKey.exchangeRate ? poolDetail.display: (
                                showRateReserve ? poolDetail.reverse: poolDetail.display 
                              )
                            }
                            </span>
                            {
                              poolDetail.utilIcon && ( 
                                <img 
                                  src={poolDetail.utilIcon} 
                                  className={styles.poolDetailUtil} 
                                  onClick={() => {
                                    if (key === PoolDetailKey.website) {
                                      window.open(poolDetail.display as string, '_blank')
                                    }

                                    if (key === PoolDetailKey.exchangeRate) {
                                      setShowRateReverse(!showRateReserve);
                                    }
                                  }} 
                                  key={key}
                                />)
                            }
                          </p>
                        </div>
                      )})
                  }
                  <div className={styles.btnGroup}>
                    {
                      <Button 
                        text={'Join Pool'} 
                        backgroundColor={'#D01F36'} 
                        disabled={!availableJoin || alreadyJoinPool || joinPoolSuccess} 
                        loading={poolJoinLoading}
                        onClick={joinPool}
                      />
                    }
                    <Button 
                      text={'Etherscan'} 
                      backgroundColor={'#3232DC'} 
                      onClick={() => {
                        poolDetails && window.open(`${ETHERSCAN_BASE_URL}/address/${poolDetails.poolAddress}` as string, '_blank')
                      }} 
                    />
                  </div>
                </>
              )
            }
            </div>
            <div className={styles.poolDetailTier}>
              <Tiers 
                showMoreInfomation 
                tiersBuyLimit={poolDetails?.buyLimit || [] }
                tokenSymbol={`${poolDetails?.purchasableCurrency?.toUpperCase()}`}
              />
              <p className={styles.poolDetailMaxBuy}>*Max bought: {numberWithCommas(userBuyLimit.toString())} {poolDetails?.purchasableCurrency?.toUpperCase()}</p>
              <div className={styles.poolDetailProgress}>
                <p className={styles.poolDetailProgressTitle}>Swap Progress</p>
                {isWidthUp('sm', props.width) && <div className={styles.poolDetailProgressStat}>
                  <span className={styles.poolDetailProgressPercent}>
                    {soldProgress}%
                  </span>
                  <span>
                    {numberWithCommas(tokenSold)} / {numberWithCommas(totalSell)}
                  </span>
                </div>}
                {isWidthDown('xs', props.width) && <div className={styles.poolDetailProgressStat}>
                  <span className={styles.poolDetailProgressPercent}>
                    {parseFloat(soldProgress).toFixed(2)}%
                  </span>
                  <span>
                    {numberWithCommas(parseFloat(tokenSold).toFixed(2))} / {numberWithCommas(parseFloat(totalSell).toFixed(2))}
                  </span>
                </div>}
                <div className={styles.progress}>
                  <div className={styles.achieved} style={{ width: `${soldProgress}%` }}></div>
                </div>
              </div>
              <div className={styles.poolDetailStartTime}>
                <span className={styles.poolDetailStartTimeTitle}>{display}</span>
                <Countdown startDate={countDownDate} />
              </div>
            </div> 
          </div>
          <div className={styles.poolDetailBuy}>
            <nav className={styles.poolDetailBuyNav}>
              <ul className={styles.poolDetailLinks}>
                {
                  headers.map((header) => {
                    if (header === HeaderType.Main && new Date() > endBuyTimeInDate) {
                      return null;
                    }
                    return <li 
                      className={`${styles.poolDetailLink} ${activeNav === header ? `${styles.poolDetailLinkActive}`: ''}`} 
                      onClick={() => setActiveNav(header)}
                      key={header}
                    >
                      {header}
                    </li>
                  })
                }
              </ul>
            </nav>
            <div className={styles.poolDetailBuyForm}>
              {
                activeNav === HeaderType.Main && new Date() <= endBuyTimeInDate && ( 
                    <BuyTokenForm 
                      tokenDetails={poolDetails?.tokenDetails} 
                      rate={poolDetails?.ethRate}
                      poolAddress={poolDetails?.poolAddress}
                      maximumBuy={userBuyLimit}
                      purchasableCurrency={poolDetails?.purchasableCurrency?.toUpperCase()}
                      poolId={poolDetails?.id}
                      joinTime={joinTimeInDate}
                      method={poolDetails?.method}
                      availablePurchase={availablePurchase}
                      ableToFetchFromBlockchain={ableToFetchFromBlockchain}
                      minTier={poolDetails?.minTier}
                    /> 
                 )
              }
              {
                activeNav === HeaderType.About && <PoolAbout /> 
              }
              {
                activeNav === HeaderType.Participants && <LotteryWinners poolId={poolDetails?.id} />
              }
              {
                poolDetails?.type === 'claim' && <ClaimToken releaseTime={releaseTimeInDate} />
              }
            </div>
          </div>
          <button onClick={() => dispatch(login(connectedAccount as string, library))}>Login</button>
        </main>
     </div>
    </DefaultLayout>
  )
}

export default withWidth()(BuyToken);
