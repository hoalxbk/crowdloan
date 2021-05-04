import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import moment from 'moment';
import { nFormatter } from '../../../utils/formatNumber';
import { Link } from 'react-router-dom';
import { POOL_STATUS, NETWORK, POOL_TYPE, ACCEPT_CURRENCY, BUY_TYPE } from '../../../constants';
import useFetch from '../../../hooks/useFetch';
import { numberWithCommas } from '../../../utils/formatNumber';

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
    setProgress(pool.tokenSold * 100 / pool.total_sold_coin || 0);
  }, [pool.tokenSold])

  useEffect(() => {
    const currentTime = moment().unix()
    let diffTime = 0;
    if(pool.start_join_pool_time > currentTime) {
      diffTime = parseInt(pool.start_join_pool_time) - currentTime;
    } else if(pool.start_time > currentTime) {
      diffTime = parseInt(pool.start_time) - currentTime;
    }
    
    let intervalCount: any;
    if (diffTime > 0) {
      let timeLeftToStart = diffTime * 1000
    const interval = 1000;

      intervalCount = setInterval(() => {
        timeLeftToStart -= interval;
        const timeLeftDuration = moment.duration(timeLeftToStart, 'milliseconds');
        let timeLeftString = '';
        if (timeLeftToStart >= 86400000) {
          timeLeftString = 'In ' + timeLeftDuration.days() + " days"
        } else {
          timeLeftString = 'In ' + timeLeftDuration.hours() + ":" + timeLeftDuration.minutes() + ":" + timeLeftDuration.seconds()
        }
        setTimeLeft(timeLeftString)
      }, interval);
    }

    return () => clearInterval(intervalCount);
  }, [])

  return (
    <Link to={`/buy-token/${pool.id}`}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img src={pool.banner} />
          {pool.status == POOL_STATUS.CLOSED && <div className="time closed">
            <span>Closed</span>
          </div>}
          {pool.status == POOL_STATUS.TBA && <div className="time tba">
            <span>TBA</span>
          </div>}
          {pool.status == POOL_STATUS.FILLED && <div className="time filled">
            <span>Filled</span>
          </div>}
          {pool.status == POOL_STATUS.IN_PROGRESS && <div className="time in-progress">
            <span>In Progress</span>
          </div>}
          {pool.status == POOL_STATUS.JOINING && <div className="time joining">
            <span>Joining</span>
          </div>}
          {pool.status == POOL_STATUS.CLAIMABLE && <div className="time claimable">
            <span>Claimable</span>
          </div>}
          {pool.status == POOL_STATUS.UPCOMMING && <div className="time upcomming">
            <img src={dotIcon} />
            <span>&nbsp;{timeLeft}</span>
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
                {pool.accept_currency === ACCEPT_CURRENCY.ETH ?
                  numberWithCommas(pool.ether_conversion_rate, 4) :
                  numberWithCommas(pool.token_conversion_rate, 4)} {pool.accept_currency.toUpperCase()}</span>
            </li>
            <li>
              <span>Participants</span>
              <span className="total">{ pool.pool_type === BUY_TYPE.WHITELIST_LOTTERY ? participants : 'All' }</span>
            </li>
            <li>
              <span>Access</span>
              <span className="total">{pool.pool_type === BUY_TYPE.WHITELIST_LOTTERY ? BUY_TYPE.WHITELIST_LOTTERY.toUpperCase() : BUY_TYPE.FCFS.toUpperCase()}</span>
            </li>
            {pool.status != POOL_STATUS.UPCOMMING && <li>
              <span>Network</span>
              <span className="total">
                {pool.network_available === NETWORK.ETHEREUM ? <img src={EthereumIcon} /> : <img src={BSCIcon} />}
              </span>
            </li>}
          </ul>

          {pool.status == POOL_STATUS.UPCOMMING && <div className="token-area">
            {pool.network_available === NETWORK.ETHEREUM && <div>
              <img src={EthereumIcon} />
              <span>Ethereum</span>
            </div>}
            {pool.network_available === NETWORK.BSC && <div>
              <img src={BSCIcon} />
              <span>BSC</span>
            </div>}
          </div>}

          {pool.status != POOL_STATUS.UPCOMMING && <div className="progress-area">
            <p>Progress</p>
            <div className="progress">
              <span className={`current-progress ${progress !== 0 ? '' : 'inactive'}`} style={{ width: `${progress > 100 ? 100 : Math.round(progress)}%` }}></span>
            </div>
            <div>
              <div>
                <span>{`${progress.toFixed(2)}%`}</span>
              </div>
              <span>{parseFloat(pool.tokenSold || 0).toFixed(0)}/{parseFloat(pool.total_sold_coin || 0).toFixed(0)}</span>
            </div>
          </div>}
        </div>
      </div>
    </Link>
  );
};

export default Card;
