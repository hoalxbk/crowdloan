import { useState, useEffect } from 'react';
import { HashLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
//@ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';

import usePoolDetailsMapping, { PoolDetailKey, poolDetailKey } from './hooks/usePoolDetailsMapping';
import useAuth from '../../hooks/useAuth';
import usePoolDetails from '../../hooks/usePoolDetails';
import useTokenBalance from '../../hooks/useTokenBalance';
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
import { limitDecimalFormatter, formatMoneyWithoutDollarSign } from '../../utils/currencyFormatter';

import { getTiers, getUserInfo, getUserTier } from '../../store/actions/sota-tiers';

import useStyles from './style';

const poolImage = "/images/pool_circle.svg";
const copyImage = "/images/copy.svg";

enum HeaderType {
  Main = "Main",
  About = "About",
  Participants = "Participants"
}

const headers = [HeaderType.Main, HeaderType.About, HeaderType.Participants];

const ETHERSCAN_BASE_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL;

const BuyToken: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [isParticipated, setIsParticipated] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeNav, setActiveNav] = useState(HeaderType.Main);

  const { id } = useParams() as any;
  const { poolDetails, loading: loadingPoolDetail } = usePoolDetails(id);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const tokenDetails = poolDetails?.tokenDetails || undefined;
  const { tokenBalance } = useTokenBalance(tokenDetails, connectedAccount);
  // Should replace hard string by pool address
  const { tokenSold, totalSell, soldProgress } = useTokenSoldProgress(poolDetails?.poolAddress, tokenDetails);
  const { joinPool, poolJoinLoading } = usePoolJoinAction({ poolId: poolDetails?.id });
  const { data: winners } = useFetch<Array<any>>(`/pool/${poolDetails?.id}/winners`);
  const { data: participants } = useFetch<Array<any>>(`/pool/${poolDetails?.id}/participants`);
  const poolDetailsMapping = usePoolDetailsMapping(poolDetails);

  const userBuyLimit = poolDetails?.connectedAccountBuyLimit || 0;

  // With Whitelist situation, Enable when join time < current < end join time
  // With FCFS, always disable join button
  const joinTimeInDate = new Date(Number(poolDetails?.joinTime) * 1000);
  const endJoinTimeInDate = new Date(Number(poolDetails?.endJoinTime) * 1000);
  const availablePurchase = 
    poolDetails?.method === 'whitelist' 
    ? new Date() >= joinTimeInDate && new Date() <= endJoinTimeInDate
    : false;

  useEffect(() => {
    // Check if user is winning ticket or not
    if (poolDetails?.method === "whitelist" && winners && winners.length > 0) {
      let isFound = false;

      winners.forEach(winner => {
        if (winner.wallet_address === connectedAccount && !isFound) {
          console.log(`Account ${connectedAccount} won ticket`);
          setIsWinner(true);
        }
      });
    }
  }, [poolDetails, winners]);

  useEffect(() => {
    if (poolDetails?.method === "whitelist" && participants && participants.length > 0) {
      let isFound = false;

      participants.forEach(participant => {
        if (participant.wallet_address === connectedAccount && !isFound) {
          setIsParticipated(true);
        }
      });
    }
  }, [poolDetails, participants]);


  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) { 
      dispatch(getTiers()) 
      dispatch(getUserInfo(connectedAccount));
      dispatch(getTiers());
      dispatch(getUserTier(connectedAccount));
    } 
  }, [isAuth, wrongChain]);

  return (
    <DefaultLayout>
      <div className={styles.poolDetailContainer}>
        <header className={styles.poolDetailHeader}> 
          <div className={styles.poolHeaderWrapper}>
            <div className={styles.poolHeaderImage}>
              <img src={poolImage} alt="pool-image" />
            </div>
            <div className={styles.poolHeaderInfo}>
            <h2 className={styles.poolHeaderTitle}>{poolDetails?.title}</h2>
              <p className={styles.poolHeaderAddress}>
              {poolDetails?.poolAddress}
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
                [...Array(3)].map(num => (
                  <img src="/images/fire-cracker.svg" alt="file-cracker" />
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
              (loadingPoolDetail || wrongChain) ? (
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
                        <div className={styles.poolDetailBasic}>
                          <span className={styles.poolDetailBasicLabel}>{poolDetail.label}</span>
                          <p className={styles.poolsDetailBasicText}>
                            <span>{poolDetail.display}</span>
                            {
                              poolDetail.utilIcon && ( 
                                <img 
                                  src={poolDetail.utilIcon} 
                                  className={styles.poolDetailUtil} 
                                  onClick={() => {
                                    key === PoolDetailKey.website && window.open(poolDetail.display as string, '_blank')
                                  }} 
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
                        disabled={!availablePurchase || isParticipated} 
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
                tokenSymbol={`PKF`}
              />
              <p className={styles.poolDetailMaxBuy}>*Max bought: {userBuyLimit} PKF</p>
              <div className={styles.poolDetailProgress}>
                <p className={styles.poolDetailProgressTitle}>Swap Progress</p>
                <div className={styles.poolDetailProgressStat}>
                  <span className={styles.poolDetailProgressPercent}>
                    {formatMoneyWithoutDollarSign(limitDecimalFormatter.format(soldProgress))}%
                  </span>
                  <span>
                    {formatMoneyWithoutDollarSign(limitDecimalFormatter.format(tokenSold))} /
                    {formatMoneyWithoutDollarSign(limitDecimalFormatter.format(totalSell))}
                  </span>
                </div>
                <div className={styles.progress}>
                  <div className={styles.achieved} style={{ width: `${soldProgress}%` }}></div>
                </div>
              </div>
              <div className={styles.poolDetailStartTime}>
                <span className={styles.poolDetailStartTimeTitle}>Start in</span>
                <Countdown startDate={poolDetails?.joinTime ? new Date(Number(poolDetails?.joinTime) *  1000): undefined} />
              </div>
            </div> 
          </div>
          <div className={styles.poolDetailBuy}>
            <nav className={styles.poolDetailBuyNav}>
              <ul className={styles.poolDetailLinks}>
                {
                  headers.map((header) => (
                    <li className={`${styles.poolDetailLink} ${activeNav === header ? `${styles.poolDetailLinkActive}`: ''}`} onClick={() => setActiveNav(header)}>{header}</li>
                  ))
                }
              </ul>
            </nav>
            <div className={styles.poolDetailBuyForm}>
              {
                activeNav === HeaderType.Main && ( 
                    <BuyTokenForm 
                      tokenDetails={poolDetails?.tokenDetails} 
                      balance={tokenBalance} 
                      rate={poolDetails?.ethRate}
                      poolAddress={poolDetails?.poolAddress}
                      maximumBuy={userBuyLimit}
                      purchasableCurrency={poolDetails?.purchasableCurrency?.toUpperCase()}
                      poolId={poolDetails?.id}
                      joinTime={poolDetails?.joinTime}
                      method={poolDetails?.method}
                    /> 
               )
              }
              {
                activeNav === HeaderType.About && <PoolAbout /> 
              }
              {
                activeNav === HeaderType.Participants && <LotteryWinners />
              }
              <ClaimToken />
            </div>
          </div>
        </main>
     </div>
    </DefaultLayout>
  )
}

export default BuyToken;
