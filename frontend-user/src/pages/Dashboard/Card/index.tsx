import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import useStyles from './style';
import {numberWithCommas} from '../../../utils/formatNumber';
import {Link} from 'react-router-dom';
import {ACCEPT_CURRENCY, BUY_TYPE, NETWORK, NFT_PLUS_AMOUNT_PRODUCTION} from '../../../constants';
import useFetch from '../../../hooks/useFetch';
import {getIconCurrencyUsdt} from "../../../utils/usdt";
import {PoolStatus} from "../../../utils/getPoolStatus";
import {getAccessPoolText} from "../../../utils/campaign";
import BigNumber from 'bignumber.js';

const dotIcon = '/images/icons/dot.svg'
const EthereumIcon = "/images/ethereum.svg";
const BSCIcon = "/images/bsc.svg";

const Card = (props: any): JSX.Element => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);

  const {
    pool
  } = props
  const { data: participants } = useFetch<any>(`/user/counting/${pool.id}`);

  useEffect(() => {
    if (pool.id == 22) {
      setProgress(100);
      pool.tokenSold = '500000';
      pool.total_sold_coin = '500000';
    } else if (pool.id == 23) {
      const tokenSold = NFT_PLUS_AMOUNT_PRODUCTION;
      // pool.tokenSold = new BigNumber(tokenSold).plus(pool.tokenSold || 0).toFixed();
      setProgress(parseFloat(
        new BigNumber(pool.tokenSold).plus(tokenSold).toFixed()
      ) * 100 / parseFloat(pool.total_sold_coin) || 0);
    } else {
      setProgress(parseFloat(pool.tokenSold) * 100 / parseFloat(pool.total_sold_coin) || 0);
    }
  }, [pool.tokenSold])

  // useEffect(() => {
  //   const currentTime = moment().unix()
  //   let diffTime = 0;
  //   if(pool.start_join_pool_time > currentTime) {
  //     diffTime = parseInt(pool.start_join_pool_time) - currentTime;
  //   } else if(pool.start_time > currentTime) {
  //     diffTime = parseInt(pool.start_time) - currentTime;
  //   }

  //   let intervalCount: any;
  //   if (diffTime > 0) {
  //     let timeLeftToStart = diffTime * 1000
  //   const interval = 1000;

  //     intervalCount = setInterval(() => {
  //       timeLeftToStart -= interval;
  //       const timeLeftDuration = moment.duration(timeLeftToStart, 'milliseconds');
  //       let timeLeftString = '';
  //       if (timeLeftToStart >= 86400000) {
  //         timeLeftString = 'In ' + timeLeftDuration.days() + " days"
  //       } else {
  //         timeLeftString = 'In ' + timeLeftDuration.hours() + ":" + timeLeftDuration.minutes() + ":" + timeLeftDuration.seconds()
  //       }
  //       setTimeLeft(timeLeftString)
  //     }, interval);
  //   }

  //   return () => clearInterval(intervalCount);
  // }, [])

  const { currencyIcon, currencyName } = getIconCurrencyUsdt({ purchasableCurrency: pool?.accept_currency, networkAvailable: pool?.network_available });

  return (
    <Link to={`/buy-token/${pool.id}`}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img src={pool.banner} />
          {pool.status == PoolStatus.Closed && <div className="time ended">
            <span>Ended</span>
          </div>}
          {pool.status == PoolStatus.TBA && <div className="time tba">
            <span>TBA</span>
          </div>}
          {pool.status == PoolStatus.Filled && <div className="time filled">
            <span>Filled</span>
          </div>}
          {pool.status == PoolStatus.Progress && <div className="time in-progress">
            <span>In Progress</span>
          </div>}
          {pool.status == PoolStatus.Joining && <div className="time joining">
            <span>Whitelisting</span>
          </div>}
          {pool.status == PoolStatus.Claimable && <div className="time claimable">
            <span>Claimable</span>
          </div>}
          {pool.status == PoolStatus.Upcoming && <div className="time upcoming">
            <span>Upcoming</span>
          </div>}
        </div>
        <div className={styles.cardBody}>
          <div className="card-content__title">
            <img src={pool.token_images} />
            <div>
              <h2>{pool.title}</h2>
              <p>{pool.name}{` (${pool.symbol})`}</p>
            </div>
          </div>
          <ul className="card-content__content">
            <li>
              <span>Rate</span>
              <span className="total">1 {pool.symbol} =&nbsp;

                {pool.accept_currency === ACCEPT_CURRENCY.ETH &&
                  <>
                    {numberWithCommas(pool?.price_usdt, 4)} USD
                  </>
                }

                {pool.accept_currency !== ACCEPT_CURRENCY.ETH &&
                  <>
                    {numberWithCommas(pool?.token_conversion_rate, 4)} {' '}
                    {currencyName}
                    {/*{pool?.accept_currency?.toUpperCase()}*/}
                  </>
                }

                {/*{numberWithCommas(pool.price_usdt, 4)} USDT*/}
                {/*{pool.accept_currency === ACCEPT_CURRENCY.ETH ?*/}
                {/*  numberWithCommas(pool.ether_conversion_rate, 4) :*/}
                {/*  numberWithCommas(pool.token_conversion_rate, 4)} {pool.accept_currency.toUpperCase()}*/}
              </span>
            </li>
            <li>
              <span>Participants</span>
              <span className="total">{ pool.buy_type == BUY_TYPE.WHITELIST_LOTTERY ? numberWithCommas(participants) : 'All' }</span>
            </li>
            <li>
              <span>Access</span>
              <span className="total">
                {
                  getAccessPoolText(pool)
                }
              </span>
            </li>
            <li>
              <span>Network</span>
              <span className="total">
                {pool.network_available === NETWORK.ETHEREUM ? <img src={EthereumIcon} /> : <img src={BSCIcon} />}
              </span>
            </li>
          </ul>

          {/* {pool.status == POOL_STATUS.UPCOMMING && <div className="token-area">
            {pool.network_available === NETWORK.ETHEREUM && <div>
              <img src={EthereumIcon} />
              <span>Ethereum</span>
            </div>}
            {pool.network_available === NETWORK.BSC && <div>
              <img src={BSCIcon}/>
              <span>BSC</span>
            </div>}
          </div>} */}

          <div className="progress-area">
            <p>Progress</p>
            <div className="progress">
              <span className={`current-progress ${progress !== 0 ? '' : 'inactive'}`} style={{ width: `${progress > 100 ? 100 : Math.round(progress)}%` }}></span>
            </div>
            <div>
              <div>
                <span>{`${progress.toFixed(2)}%`}</span>
              </div>
              <span>{numberWithCommas(
                new BigNumber(pool.tokenSold || '0').plus(NFT_PLUS_AMOUNT_PRODUCTION).toFixed()
              )}/{numberWithCommas(pool.total_sold_coin || '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
