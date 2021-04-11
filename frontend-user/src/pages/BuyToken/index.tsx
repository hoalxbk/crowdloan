import { useState, useEffect } from 'react';
import { SyncLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import usePoolDetailsMapping, { PoolDetailKey, poolDetailKey } from './hooks/usePoolDetailsMapping';
import useAuth from '../../hooks/useAuth';
import usePoolDetails from '../../hooks/usePoolDetails';
import useTokenBalance from '../../hooks/useTokenBalance';
import useTokenApprove from '../../hooks/useTokenApprove';

import LotteryWinners from './LotteryWinners';
import PoolAbout from './PoolAbout';
import ClaimToken from './ClaimToken';
import BuyTokenForm from './BuyTokenForm';
import Button from './Button';
import Countdown from '../../components/Base/Countdown';
import DefaultLayout  from '../../components/Layout/DefaultLayout';
import Tiers from '../Account/Tiers';

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

const BuyToken: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [activeNav, setActiveNav] = useState(HeaderType.Main);

  const { id } = useParams() as any;
  const { poolDetails, loading: loadingPoolDetail } = usePoolDetails(id);
  console.log(poolDetails);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const tokenDetails = {
     decimals: 18, name: 'Dyrus', symbol: 'DYRUS', address: '0xb9d089545cc4bbbfcd3b5a9e4e52550960790693' 
  }
  /* const { tokenBalance } = useTokenBalance(poolDetails?.tokenDetails, connectedAccount); */
  const { tokenBalance } = useTokenBalance(tokenDetails, connectedAccount);
  const { approveToken, tokenApproveLoading } = useTokenApprove(tokenDetails, connectedAccount, "0x954e1498272113b759a65cb83380998fe80f5264")
  const poolDetailsMapping = usePoolDetailsMapping(poolDetails);
  console.log(poolDetailsMapping);

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
          <div className={styles.poolHeaderImage}>
            <img src={poolImage} alt="pool-image" />
          </div>
          <div className={styles.poolHeaderInfo}>
            <h2 className={styles.poolHeaderTitle}>{poolDetails?.title}</h2>
            <p className={styles.poolHeaderAddress}>
              {poolDetails?.tokenDetails?.address}
              <img src={copyImage} alt="copy-icon" className={styles.poolHeaderCopy} />
            </p>
          </div>
        </header>
        <main className={styles.poolDetailInfo}>
          <div className={styles.poolDetailTierWrapper}>
            <div className={styles.poolDetailIntro}>
            {
              (loadingPoolDetail || wrongChain) ? (
                <div className={styles.loader}>
                  <p className={styles.loaderText}>
                    <span style={{ marginRight: 10 }}>Loading Pool Details</span>
                    <SyncLoader loading={true} color={'white'} />
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
                    <Button text={'Join Pool'} backgroundColor={'#D01F36'} disabled={new Date(1618218340 * 1000) > new Date()} />
                    <Button text={'Etherscan'} backgroundColor={'#3232DC'}/>
                  </div>
                </>
              )
            }
            </div>
            <div className={styles.poolDetailTier}>
              <Tiers 
                showMoreInfomation 
                tiersBuyLimit={[500, 1000, 2000, 3000, 4000]} 
                tokenSymbol={`PKF`}
              />
              <p className={styles.poolDetailMaxBuy}>*Max bought: 500 PKF</p>
              <div className={styles.poolDetailProgress}>
                <p className={styles.poolDetailProgressTitle}>Swap Progress</p>
                <div className={styles.poolDetailProgressStat}>
                  <span className={styles.poolDetailProgressPercent}>30%</span>
                  <span>180.000.000/600.000.000</span>
                </div>
                <div className={styles.progress}>
                  <div className={styles.achieved}></div>
                </div>
              </div>
              <div className={styles.poolDetailStartTime}>
                <span className={styles.poolDetailStartTimeTitle}>Start in</span>
                <Countdown startDate={new Date(1618218340 * 1000)} />
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
                      tokenDetails={tokenDetails} 
                      balance={tokenBalance} 
                      approveToken={approveToken}
                      tokenApproveLoading={tokenApproveLoading}
                      rate={100}
                      poolAddress={"0x954e1498272113b759a65cb83380998fe80f5264"}
                      maximumBuy={5000}
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
