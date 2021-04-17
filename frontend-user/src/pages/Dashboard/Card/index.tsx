import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import moment from 'moment';
import { nFormatter } from '../../../utils/formatNumber';
import { POOL_STATUS, NETWORK, POOL_TYPE, ACCEPT_CURRENCY, BUY_TYPE } from '../../../constants';
import useFetch from '../../../hooks/useFetch';

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
    var diffTime = pool.startTime - currentTime;
    let intervalCount: any;
    if (diffTime > 0) {
      let timeLeftToStart = diffTime * 1000
      const interval = 1000;

      intervalCount = setInterval(() => {
        timeLeftToStart -= interval;
        const timeLeftDuration = moment.duration(timeLeftToStart, 'milliseconds');
        let timeLeftString = '';
        if (timeLeftToStart / 86400 >= 1) {
          timeLeftString = 'In' + timeLeftDuration.days() + "days"
        } else {
          timeLeftString = 'In' + timeLeftDuration.hours() + ":" + timeLeftDuration.minutes() + ":" + timeLeftDuration.seconds()
        }
        setTimeLeft(timeLeftString)
      }, interval);
    }

    return () => clearInterval(intervalCount);
  }, [])

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img src={pool.banner} />
        {pool.status == POOL_STATUS.CLOSED && <div className="time closed">
          <span>Closed</span>
        </div>}
        {pool.status == POOL_STATUS.FILLED && <div className="time filled">
          <span>Filled</span>
        </div>}
        {pool.status == POOL_STATUS.IN_PROGRESS && <div className="time filled">
          <span>In Progress</span>
        </div>}
        {pool.status == POOL_STATUS.JOINING && <div className="time filled">
          <span>Joining</span>
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
            <p>{pool.symbol}/{pool.accept_currency}</p>
          </div>
        </div>
        <ul className="card-content__content">
          <li>
            <span>Ratio per currency</span>
            <span className="total">{pool.accept_currency === ACCEPT_CURRENCY.ETH ? pool.ether_conversion_rate : pool.token_conversion_rate}</span>
          </li>
          <li>
            <span>Participants</span>
            <span className="total">{ participants }</span>
          </li>
          <li>
            <span>Access</span>
            <span className="total">{pool.pool_type === BUY_TYPE.WHITELIST_LOTTERY ? BUY_TYPE.WHITELIST_LOTTERY.toUpperCase() : BUY_TYPE.FCFS.toUpperCase()}</span>
          </li>
          <li>
            <span>Network</span>
            <span className="total">
              {pool.network_available === NETWORK.ETHEREUM ? 'Ethereum' : 'BSC'}
            </span>
          </li>
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
            <span className="current-progress" style={{ width: `${progress > 100 ? 100 : Math.round(progress)}%` }}></span>
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
  );
};

export default Card;
