import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import Card from './Card';
import usePools from '../../hooks/usePools';
import { POOL_STATUS, POOL_TYPE, BUY_TYPE } from '../../constants';
import POOL_ABI from '../../abi/Pool.json';
import { getContractInstance, convertFromWei, convertToWei } from '../../services/web3';
import moment from 'moment';
import {getPoolStatusByPoolDetail} from "../../utils/getPoolStatusByPoolDetail";
import {PoolStatus} from "../../utils/getPoolStatus";

const arrowRightIcon = '/images/icons/arrow-right.svg';
const background = '/images/icons/background2.svg';

const Dashboard = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  let { pools = [], pagination, loading } = usePools();
  const [upcomingPools, setUpcomingPools] = useState([]);
  const [featurePools, setFeaturePools] = useState([]);
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const { data: connector } = useSelector((state: any) => state.connector);
  const [poolFetched, setPoolFetched] = useState(false);

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

  const checkBuyTime = (pool: any) => {
    return !pool.start_time || !pool.finish_time
  }

  const checkJoinTime = (pool: any) => {
    return !pool.start_join_pool_time || !pool.end_join_pool_time
  }

  const checkTBA = (pool: any) => {
    return pool.pool_type == POOL_TYPE.SWAP && pool.buy_type == BUY_TYPE.FCFS && checkBuyTime(pool)
    || pool.pool_type == POOL_TYPE.SWAP && pool.buy_type == BUY_TYPE.WHITELIST_LOTTERY && (checkBuyTime(pool) || checkJoinTime(pool))
    || pool.pool_type == POOL_TYPE.CLAIMABLE && pool.buy_type == BUY_TYPE.FCFS && (checkBuyTime(pool) || !pool.release_time)
    || pool.pool_type == POOL_TYPE.CLAIMABLE && pool.buy_type == BUY_TYPE.WHITELIST_LOTTERY && (checkBuyTime(pool) || checkJoinTime(pool) || !pool.release_time)
  };

  const setStatusPools = () => {
    pools.forEach(async (pool: any) => {
      const status = await getPoolStatusByPoolDetail(pool, 0);
      console.log('Status Pool:', status);
      pool.status = status;
    });
    setUpcomingPools(pools.filter((pool: any) => pool?.status != PoolStatus.Claimable && pool?.status != PoolStatus.Closed && pool?.is_display == 1))
    setFeaturePools(pools.filter((pool: any) => (pool?.status == PoolStatus.Claimable || pool?.status == PoolStatus.Closed) && pool?.is_display == 1))
  };

  useEffect(() => {
    if(pools.length == 0 || poolFetched) return;
    setStatusPools();
    setPoolFetched(true);
  }, [pools]);

  useEffect(() => {
    if(!appChain) return
    pools.forEach(async (pool: any) => {
      if(pool.is_deploy === 0) return
      const tokenSold = await getTokenSold(pool)
      pool.tokenSold = tokenSold
    })
  },[appChain, connector, pools])

  return (
    <DefaultLayout>
      {/* <BackgroundComponent/> */}
      <div className={styles.listPools}>
        <h2>Upcoming Pools</h2>
        <div className="pools">
          {upcomingPools.map((pool: any, index) => {
            return index < 4 && <Card pool={pool} key={pool.id}/>
          })}
        </div>
        <button className="btn" onClick={() => window.open('https://t.me/PolkaFoundryANN', '_blank')}>
          Get Notified&nbsp;
          <img src={arrowRightIcon}/>
        </button>
        {/*<button className="btn" onClick={() => props.history.push('/pools')}>*/}
        {/*  View all Pools&nbsp;*/}
        {/*  <img src={arrowRightIcon}/>*/}
        {/*</button>*/}
      </div>
      <div className={styles.listPools} style={{marginTop: '220px'}}>
        <h2>Featured Pools</h2>
        <div className="pools">
          {featurePools.map((pool: any, index) => {
            return index < 8 && <Card pool={pool} key={pool.id}/>
          })}
        </div>
        <a href="https://t.me/PolkaFoundryANN" target="_blank" className="btn" style={{width: '170px'}}>
          View all Pools&nbsp;
          <img src={arrowRightIcon}/>
        </a>
        {/*<button className="btn" onClick={() => props.history.push('/pools')}>*/}
        {/*  View all Pools&nbsp;*/}
        {/*  <img src={arrowRightIcon}/>*/}
        {/*</button>*/}
      </div>
      <div className={styles.getAlert}>
        <img src={background}/>
        <div className="content">
          <h2>Get Alerts For New Pools</h2>
          <p>Subscribe to get notified about new pools and other relevant events.</p>
          <button className="btn" onClick={() => window.open('https://t.me/PolkaFoundryANN', '_blank')}>
            Subscribe to upcoming pools&nbsp;
            <img src={arrowRightIcon}/>
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(Dashboard);
