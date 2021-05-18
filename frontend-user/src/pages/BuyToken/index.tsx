import { useState, useEffect, useCallback, useMemo } from 'react';
import { HashLoader } from "react-spinners";
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
//@ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
import BigNumber from 'bignumber.js';
import Tooltip from '@material-ui/core/Tooltip';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import { useTypedSelector } from '../../hooks/useTypedSelector';
import usePoolDetailsMapping, { PoolDetailKey, poolDetailKey } from './hooks/usePoolDetailsMapping';
import useAuth from '../../hooks/useAuth';
import usePoolDetails from '../../hooks/usePoolDetails';
import useTokenSoldProgress from './hooks/useTokenSoldProgress';
import usePoolJoinAction from './hooks/usePoolJoinAction';
import useFetch from '../../hooks/useFetch';

import Tiers from '../AccountV2/Tiers';
import LotteryWinners from './LotteryWinners';
import PoolAbout from './PoolAbout';
import ClaimToken from './ClaimToken';
import MyTier from './MyTier';
import BuyTokenForm from './BuyTokenForm';
import Button from './Button';
import StatusBar from './StatusBar';
import Countdown from '../../components/Base/Countdown';
import DefaultLayout  from '../../components/Layout/DefaultLayout';
import { ETH_CHAIN_ID } from '../../constants/network';

import { NETWORK_ETH_NAME, NETWORK_BSC_NAME } from '../../constants/network';
import { getPoolCountDown } from '../../utils/getPoolCountDown';
import { getPoolStatus } from '../../utils/getPoolStatus';
import { numberWithCommas } from '../../utils/formatNumber';

import { sotaTiersActions } from '../../store/constants/sota-tiers';

import useStyles from './style';

const copyImage = "/images/copy.svg";
const poolImage = "/images/pool_circle.svg";

enum HeaderType {
  Main = "Main",
  About = "About the project",
  Participants = "Winner",
  MyTier = "My Tier"
}

const headers = [HeaderType.Main, HeaderType.MyTier, HeaderType.About, HeaderType.Participants];

const ETHERSCAN_BASE_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL;

const BuyToken: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [buyTokenSuccess, setBuyTokenSuccess] = useState<boolean>(false);
  const [showRateReserve, setShowRateReverse] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeNav, setActiveNav] = useState(HeaderType.About);

  const { pathname } = useLocation();
  const { id } = useParams() as any;
  /* const userTier = useTypedSelector(state => state.userTier).data; */
  const { appChainID } = useTypedSelector(state => state.appNetwork).data;
  const { poolDetails, loading: loadingPoolDetail } = usePoolDetails(id);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  // Fetch token sold, total tokens sold
  const { tokenSold, soldProgress } = useTokenSoldProgress(
      poolDetails?.poolAddress,
      poolDetails?.amount,
      poolDetails?.networkAvailable
  );
  const { joinPool, poolJoinLoading, joinPoolSuccess } = usePoolJoinAction({ poolId: poolDetails?.id });
  const { data: existedWinner } = useFetch<Array<any>>(
    poolDetails ? `/pool/${poolDetails?.id}/check-exist-winner?wallet_address=${connectedAccount}`: undefined,
    poolDetails?.method !== "whitelist"
  );
  const { data: alreadyJoinPool } = useFetch<boolean>(
    poolDetails && connectedAccount ?
    `/user/check-join-campaign/${poolDetails?.id}?wallet_address=${connectedAccount}`
    : undefined
  );
  const { data: verifiedEmail = true } = useFetch<boolean>(
    poolDetails && connectedAccount && isAuth ?
    `/user/check-wallet-address?wallet_address=${connectedAccount}`
    : undefined
  );
  const { data: currentUserTier } = useFetch<any>(
    id && connectedAccount ?
    `pool/${id}/user/${connectedAccount}/current-tier`
    : undefined,
  );
  const { data: winnersList } = useFetch<any>(`/user/winner-list/${id}?page=1&limit=10&`);

  const poolDetailsMapping = usePoolDetailsMapping(poolDetails);

  // Use for check whether pool exist in selected network or not
  const networkAvailable = poolDetails?.networkAvailable === 'eth'? NETWORK_ETH_NAME: NETWORK_BSC_NAME;
  const appNetwork = appChainID === ETH_CHAIN_ID ? 'eth': 'bsc';
  const ableToFetchFromBlockchain = appNetwork === poolDetails?.networkAvailable && !wrongChain;

  const userBuyLimit = currentUserTier?.max_buy || 0;
  const userBuyMinimum = currentUserTier?.min_buy || 0;

  // With Whitelist situation, Enable when join time < current < end join time
  // With FCFS, always disable join button
  const joinTimeInDate = poolDetails?.joinTime ? new Date(Number(poolDetails?.joinTime) * 1000): undefined;
  const endJoinTimeInDate = poolDetails?.endJoinTime ? new Date(Number(poolDetails?.endJoinTime) * 1000): undefined;
  const startBuyTimeInDate = poolDetails?.startBuyTime ? new Date(Number(poolDetails?.startBuyTime) * 1000): undefined;
  const endBuyTimeInDate = poolDetails?.endBuyTime ? new Date(Number(poolDetails?.endBuyTime) * 1000): undefined;
  /* const tierStartBuyInDate = new Date(Number(currentUserTier?.start_time) * 1000); */
  /* const tierEndBuyInDate = new Date(Number(currentUserTier?.end_time) * 1000); */
  const releaseTimeInDate = poolDetails?.releaseTime ? new Date(Number(poolDetails?.releaseTime) * 1000): undefined;

  const today = new Date();
  const availableJoin = poolDetails?.method === 'whitelist' && joinTimeInDate && endJoinTimeInDate
    ? (
      today >= joinTimeInDate &&
      today <= endJoinTimeInDate &&
      currentUserTier &&
      /* today <= tierEndBuyInDate && */
      connectedAccount &&
      !wrongChain &&
      new BigNumber(currentUserTier?.level || 0).gte(poolDetails?.minTier)
      && verifiedEmail
    )
    : false;

  const availablePurchase = startBuyTimeInDate && endBuyTimeInDate &&
    today >= startBuyTimeInDate &&
    today <= endBuyTimeInDate &&
    /* today >= tierStartBuyInDate && */
    /* today <= tierEndBuyInDate && */
    poolDetails?.isDeployed &&
    verifiedEmail;
    /* (poolDetails?.method === 'whitelist' ? alreadyJoinPool: true); */

  // Get Pool Status
  const poolStatus = getPoolStatus(
    joinTimeInDate,
    endJoinTimeInDate,
    startBuyTimeInDate,
    endBuyTimeInDate,
    releaseTimeInDate,
    new BigNumber(tokenSold).div(poolDetails?.amount || 1).toFixed(),
    poolDetails?.type !== 'swap',
    poolDetails?.method
  );

  const displayCountDownTime = useCallback((
    method: string | undefined,
    startJoinTime: Date | undefined,
    endJoinTime: Date| undefined,
    startBuyTime: Date | undefined,
    endBuyTime: Date | undefined
  ) => {
    return getPoolCountDown(startJoinTime, endJoinTime, startBuyTime, endBuyTime, method);
  }, [poolDetails?.method, joinTimeInDate, endJoinTimeInDate, startBuyTimeInDate, endBuyTimeInDate]);

  const { date: countDownDate, display } = displayCountDownTime(poolDetails?.method, joinTimeInDate, endJoinTimeInDate, startBuyTimeInDate, endBuyTimeInDate)

  const shortenAddress = (address: string, digits: number = 4) => {
    return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
  }

  const userTiersAnnotationText = useMemo(() => {
    if (!verifiedEmail) {
      return 'Determined at whitelist closing';
    }

    if (existedWinner && poolDetails) {
      return `*Individual caps: ${numberWithCommas(userBuyLimit.toString())} ${poolDetails?.purchasableCurrency?.toUpperCase()}`
    }

    return 'Determined at whitelist closing';
  }, [existedWinner, userBuyLimit, poolDetails, verifiedEmail]);

  useEffect(() => {
    setActiveNav(HeaderType.Main);
    if (!poolDetails?.isDeployed) setActiveNav(HeaderType.About);
    if (availablePurchase) setActiveNav(HeaderType.Main);
  }, [availablePurchase, poolDetails]);

  // Auto Scroll To Top When redirect from other pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Hide main tab after end buy time
  useEffect(() => {
    if (
      endBuyTimeInDate && endBuyTimeInDate < new Date() &&
      activeNav === HeaderType.Main
    ) setActiveNav(HeaderType.About);
  }, [endBuyTimeInDate]);

  useEffect(() => {
    currentUserTier && dispatch({
      type: sotaTiersActions.USER_TIER_SUCCESS,
      payload: currentUserTier.level
    })
  }, [currentUserTier]);

  useEffect(() => {
    
  }, [appChainID])

  const render = () => {
    if (loadingPoolDetail)  {
      return (
        <div className={styles.loader} style={{ marginTop: 70 }}>
          <HashLoader loading={true} color={'#3232DC'} />
          <p className={styles.loaderText}>
            <span style={{ marginRight: 10 }}>Loading Pool Details ...</span>
          </p>
        </div>
      )
    }

    if ((!poolDetails || !poolDetails?.isDisplay) && !loadingPoolDetail) {
      return <p style={{
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 700,
        marginTop: 20
      }}>
        This pool does not exist. Try later! 🙂
      </p>
    } else {
      return (
        <>
          <header className={styles.poolDetailHeader}>
            <div className={styles.poolHeaderWrapper}>
              <div className={styles.poolHeaderImage}>
                <img src={poolDetails?.banner || poolImage} alt="pool-image" className={styles.poolImage}/>
              </div>
              <div className={styles.poolHeaderInfo}>
                <h2 className={styles.poolHeaderTitle}>
                  {poolDetails?.title}
                </h2>
                <Tooltip title={<p style={{ fontSize: 15, textAlign: 'left' }}>Token ICO Address</p>}>
                    <p className={styles.poolHeaderAddress}>
                      {isWidthUp('sm', props.width) && poolDetails?.tokenDetails?.address}
                      {isWidthDown('xs', props.width) && shortenAddress(poolDetails?.tokenDetails?.address || '', 8)}

                      <CopyToClipboard text={poolDetails?.tokenDetails?.address}
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
                </Tooltip>
                {isWidthUp('md', props.width) && <StatusBar currentStatus={poolStatus} />}
              </div>
            </div>
            <div className={styles.poolType}>
              <span className={styles.poolHeaderType}>
                <div className={styles.poolHeaderTypeInner}>
                  <img src={poolDetails?.networkIcon} />
                  <strong className={styles.poolHeaderNetworkAvailable}>{networkAvailable}</strong>
                </div>
              </span>
              <span className={`${styles.poolStatus} ${styles.poolStatus}--${poolStatus}`}>
                {poolStatus}
              </span>
            </div>
            {ableToFetchFromBlockchain && (winnersList && winnersList.total > 0) && verifiedEmail &&
              <p className={styles.poolTicketWinner}>
                {existedWinner &&
                <div>
                  {
                    [...Array(3)].map((num, index) => (
                      <img src="/images/fire-cracker.svg" alt="file-cracker" key={index} />
                    ))
                  }
                </div>
                }
                {!existedWinner &&
                <div>
                  {
                    [...Array(3)].map((num, index) => (
                      <img style={{ paddingLeft: 5 }} src="/images/icons/warning.svg" alt="file-cracker" key={index} />
                    ))
                  }
                </div>
                }
                <span style={{ marginLeft: 14 }}>
                  {/*Congratulations! You have won the lottery!*/}
                  {existedWinner &&
                    <p className={styles.LotteryWinnersMessage}>
                      Congratulations! You have won the lottery. You can buy up to {numberWithCommas(`${userBuyLimit}`)} {poolDetails?.purchasableCurrency.toUpperCase()}.
                    </p>
                  }
                  {!existedWinner &&
                    <p className={styles.LotteryWinnersMessage}>
                      Unfortunately, you did not win a ticket to buy this time! See you next time.
                    </p>
                  }
                </span>
              </p>
            }
            {endBuyTimeInDate && new Date() > endBuyTimeInDate && ableToFetchFromBlockchain &&
              <p className={styles.poolTicketWinner}>
                <div>
                  {
                    [...Array(3)].map((num, index) => (
                      <img src="/images/fire-cracker.svg" alt="file-cracker" key={index} />
                    ))
                  }
                </div>
                <span style={{ marginLeft: 14 }}>
                  This pool is ended, thanks for all!
                </span>
              </p>
            }
            {
              !verifiedEmail && (
                <p className={styles.poolTicketWinner}>
                  <div>
                    <img src="/images/red-warning.svg" alt="warning" />
                  </div>
                  <span style={{ marginLeft: 14 }}>
                    Your account has not been verified. To verify your account, please click&nbsp;
                    <Link
                      to="/account"
                      style={{ color: 'white', textDecoration: 'underline' }}
                    >
                      here
                    </Link>.
                  </span>
                </p>
              )
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
                        if (poolDetails?.method !== 'whitelist' && key === PoolDetailKey.joinTime) return;
                        return (
                          <div className={styles.poolDetailBasic} key={key}>
                            <span className={styles.poolDetailBasicLabel}>{poolDetail.label}</span>
                            <p className={styles.poolsDetailBasicText}>
                              {
                                poolDetail.image && <img src={poolDetail.image} className={styles.poolDetailBasicIcon}  />
                              }
                              <Tooltip title={<p style={{ fontSize: 15 }}>{poolDetail.display}</p>}>
                                  <span>
                                  {
                                    key !== PoolDetailKey.exchangeRate ? poolDetail.display: (
                                      showRateReserve ? poolDetail.reverse: poolDetail.display
                                    )
                                  }
                                  </span>
                                </Tooltip>
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
                          text={(!alreadyJoinPool && !joinPoolSuccess) ? 'Join Pool': 'Joined'}
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
                          poolDetails && window.open(`${ETHERSCAN_BASE_URL}/address/${poolDetails?.tokenDetails?.address}` as string, '_blank')
                        }}
                        disabled={!poolDetails?.tokenDetails?.address}
                      />
                    </div>
                  </>
                )
              }
              </div>
              <div className={styles.poolDetailTier}>
                <Tiers
                  hideStatistics
                  showMoreInfomation={true}
                  tiersBuyLimit={poolDetails?.buyLimit || [] }
                  tokenSymbol={`${poolDetails?.purchasableCurrency?.toUpperCase()}`}
                  verifiedEmail={verifiedEmail}
                  userTier={currentUserTier?.level || 0}
                />
                <p className={styles.poolDetailMaxBuy}>
                  {/* *Max bought: {numberWithCommas(userBuyLimit.toString())} {poolDetails?.purchasableCurrency?.toUpperCase()} */}
                  {userTiersAnnotationText}
                </p>
                <div className={styles.poolDetailProgress}>
                  <p className={styles.poolDetailProgressTitle}>Swap Progress</p>
                  {isWidthUp('sm', props.width) && <div className={styles.poolDetailProgressStat}>
                    <span className={styles.poolDetailProgressPercent}>
                      {numberWithCommas(new BigNumber(soldProgress).gt(100) ? '100': soldProgress)}%
                    </span>
                    <span>
                      {
                        numberWithCommas(new BigNumber(tokenSold).gt(`${poolDetails?.amount}`) ? `${poolDetails?.amount}`: tokenSold)}&nbsp;
                        / {numberWithCommas(`${poolDetails?.amount}` || "0")
                      }
                    </span>
                  </div>}
                  {isWidthDown('xs', props.width) && <div className={styles.poolDetailProgressStat}>
                    <span className={styles.poolDetailProgressPercent}>
                      {parseFloat(soldProgress).toFixed(2)}%
                    </span>
                    <span>
                      {
                        numberWithCommas(new BigNumber(tokenSold).gt(`${poolDetails?.amount}`) ? `${poolDetails?.amount}`: tokenSold)}&nbsp;
                        / {numberWithCommas(`${poolDetails?.amount}` || "0")
                      }
                    </span>
                  </div>}
                  <div className={styles.progress}>
                    <div className={styles.achieved} style={{ width: `${new BigNumber(soldProgress).gt(100) ? '100': soldProgress}%` }}></div>
                  </div>
                </div>
                <div className={styles.poolDetailStartTime}>
                  {
                    display ? (
                      <>
                        <span className={styles.poolDetailStartTimeTitle}>{display}</span>
                        <Countdown startDate={countDownDate} />
                      </>
                    ): (
                      <p
                        style={{
                          color: '#D01F36',
                          marginTop: 40,
                          font: 'normal normal bold 14px/18px DM Sans'
                        }}>
                        This pool is ended.
                      </p>
                    )
                  }
                </div>
              </div>
            </div>
            <div className={styles.poolDetailBuy}>
              <nav className={styles.poolDetailBuyNav}>
                <ul className={styles.poolDetailLinks}>
                  {
                    headers.map((header) => {
                      if (header === HeaderType.Main
                        && endBuyTimeInDate && new Date() > endBuyTimeInDate
                      ) {
                        return;
                      }

                      if (
                        header !== HeaderType.About &&
                        header !== HeaderType.MyTier &&
                        header !== HeaderType.Participants &&
                        (!poolDetails?.isDeployed || endBuyTimeInDate && endBuyTimeInDate < new Date())
                      ) {
                        return;
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
                  activeNav === HeaderType.Main
                  && endBuyTimeInDate && new Date() <= endBuyTimeInDate
                  && (
                      <BuyTokenForm
                        existedWinner={existedWinner}
                        alreadyJoinPool={alreadyJoinPool}
                        joinPoolSuccess={joinPoolSuccess}
                        tokenDetails={poolDetails?.tokenDetails}
                        rate={poolDetails?.ethRate}
                        poolAddress={poolDetails?.poolAddress}
                        maximumBuy={userBuyLimit}
                        minimumBuy={userBuyMinimum}
                        poolAmount={poolDetails?.amount}
                        purchasableCurrency={poolDetails?.purchasableCurrency?.toUpperCase()}
                        poolId={poolDetails?.id}
                        joinTime={joinTimeInDate}
                        method={poolDetails?.method}
                        availablePurchase={availablePurchase}
                        ableToFetchFromBlockchain={ableToFetchFromBlockchain}
                        minTier={poolDetails?.minTier}
                        isDeployed={poolDetails?.isDeployed}
                        startBuyTimeInDate={startBuyTimeInDate}
                        endBuyTimeInDate={endBuyTimeInDate}
                        endJoinTimeInDate={endJoinTimeInDate}
                        tokenSold={tokenSold}
                        setBuyTokenSuccess={setBuyTokenSuccess}
                        isClaimable={poolDetails?.type === 'claimable'}
                        currentUserTier={currentUserTier}
                      />
                   )
                }
                {
                  activeNav === HeaderType.About && (
                     <PoolAbout
                       website={poolDetails?.website}
                       exchangeRate={poolDetailsMapping && poolDetailsMapping[PoolDetailKey.exchangeRate].display}
                       description={poolDetails?.description}
                     />
                  )
                }
                {
                  activeNav === HeaderType.Participants && (
                    <LotteryWinners
                      poolId={poolDetails?.id}
                      userWinLottery={existedWinner ? true: false}
                      maximumBuy={userBuyLimit}
                      purchasableCurrency={poolDetails?.purchasableCurrency.toUpperCase()}
                      verifiedEmail={verifiedEmail ? true: false}
                    />
                   )
                }
                {
                  activeNav === HeaderType.MyTier && <MyTier tiers={poolDetails?.tiersWithDetails} />
                }
                {
                  poolDetails?.type === 'claimable' && (
                    <ClaimToken
                      releaseTime={releaseTimeInDate}
                      ableToFetchFromBlockchain={ableToFetchFromBlockchain}
                      poolAddress={poolDetails?.poolAddress}
                      tokenDetails={poolDetails?.tokenDetails}
                      buyTokenSuccess={buyTokenSuccess}
                      poolId={poolDetails?.id}
                    />
                 )
                }
              </div>
            </div>
          </main>
        </>
      )
    }
  }

  return (
    <DefaultLayout>
      <div className={styles.poolDetailContainer}>
        {render()}
     </div>
    </DefaultLayout>
  )
}

export default withWidth()(BuyToken);
