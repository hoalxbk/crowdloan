import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import BackgroundComponent from './BackgroundComponent';
import Card from './Card';
import usePools from '../../hooks/usePools';
import moment from 'moment';
import { POOL_STATUS } from '../../constants';
import POOL_ABI from '../../abi/Pool.json';
import { getContractInstance, convertFromWei, convertToWei } from '../../services/web3';

const cardImage = '/images/icons/card-image.jpg';
const arrowRightIcon = '/images/icons/arrow-right.svg';
const background = '/images/icons/background2.svg';

const Dashboard = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { pools = [], pagination, loading } = usePools();
  const [upcommingPools, setUpcommingPools] = useState([]);
  const [camePools, setCamePools] = useState([]);
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const { data: connector } = useSelector((state: any) => state.connector);

  const getTokenSold = async (pool: any) => {
    let result = '0';
    try {
      const contract = getContractInstance(POOL_ABI, pool.campaign_hash || '', connector, appChain.appChainID);
      if (contract) {
        result = await contract.methods.tokenSold().call();
        result = convertFromWei(result.toString());
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  useEffect(() => {
    setUpcommingPools(pools.filter((pool: any) => pool?.status == POOL_STATUS.UPCOMMING))
    setCamePools(pools.filter((pool: any) => pool?.status != POOL_STATUS.UPCOMMING))
    pools.forEach(async (pool: any) => {
      const currentTime = moment().unix()
      if(pool.startJoinPoolTime > currentTime || pool.endJoinPoolTime < currentTime && currentTime < pool.startTime) {
        pool.status = POOL_STATUS.UPCOMMING
      } else if(pool.startJoinPoolTime <= currentTime
        && currentTime <= pool.endJoinPoolTime
        ) 
      {
        pool.status = POOL_STATUS.JOINING
      } else if(currentTime <= pool.startTime && currentTime <= pool.finishTime) {
        if(Math.round(pool.tokenSold * 100 / pool.total_sold_coin) == 100) {
          pool.status = POOL_STATUS.FILLED
        } else {
          pool.status = POOL_STATUS.IN_PROGRESS
        }
      } else {
        pool.status = POOL_STATUS.CLOSED
      }
      const tokenSold = await getTokenSold(pool)
      pool.tokenSold = tokenSold
    })
    if(!appChain || !connector) return
    pools.forEach(async (pool: any) => {
      const tokenSold = await getTokenSold(pool)
      pool.tokenSold = tokenSold
    })
  }, [pools, appChain, connector]);

  return (
    <DefaultLayout>
      <BackgroundComponent/>
      <div className={styles.listPools}>
        <h2>Upcoming Pools</h2>
        <div className="pools">
          {upcommingPools.map((pool: any, index) => {
            return index < 4 && <Card pool={pool} key={pool.id}/>
          })}
        </div>
        <button className="btn">
          Get Notified&nbsp;
          <img src={arrowRightIcon}/>
        </button>
      </div>
      <div className={styles.listPools} style={{marginTop: '220px'}}>
        <h2>Upcoming Pools</h2>
        <div className="pools">
          {camePools.map((pool: any, index) => {
            return index < 8 && <Card pool={pool} key={pool.id}/>
          })}
        </div>
        <button className="btn">
          View all Pools&nbsp;
          <img src={arrowRightIcon}/>
        </button>
      </div>
      <div className={styles.getAlert}>
        <img src={background}/>
        <div className="content">
          <h2>Get Alerts For New Pools</h2>
          <p>Subscribe to get notified about new pools and other relevant events.</p>
          <button className="btn">
            Subscribe to upcoming pools&nbsp;
            <img src={arrowRightIcon}/>
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(Dashboard);
