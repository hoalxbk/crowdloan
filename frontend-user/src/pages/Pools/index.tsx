import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _, { divide } from 'lodash';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import useCommonStyle from '../../styles/CommonStyle';
import usePools from '../../hooks/usePools';
import { getContractInstance, convertFromWei, convertToWei } from '../../services/web3';
import POOL_ABI from '../../abi/Pool.json';
import moment from 'moment';
import { POOL_STATUS } from '../../constants';
import Pool from './Pool';
import PoolMobile from './PoolMobile';
import { CircularProgress } from '@material-ui/core';
import withWidth, {isWidthDown, isWidthUp} from '@material-ui/core/withWidth';

const iconSearch = 'images/icons/search.svg';
const iconPrev = 'images/icons/prev.svg';
const iconNext = 'images/icons/next.svg';

const Pools = (props: any) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle()
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = useState(1);
  const { pools = [], pagination, loading } = usePools();
  const [upcommingPools, setUpcommingPools] = useState([]);
  const [camePools, setCamePools] = useState([]);
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const { data: connector } = useSelector((state: any) => state.connector);
  const [currentPage, setCurrrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);


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
    if(!pagination) return;
    setCurrrentPage(pagination.page);
    setTotalPage(pagination.total);
    setPerPage(pagination.perPage);
    setLastPage(pagination.lastPage);
  }, [pagination])

  useEffect(() => {
    setUpcommingPools(pools.filter((pool: any) => pool?.status == POOL_STATUS.UPCOMMING && pool?.is_display == 1))
    setCamePools(pools.filter((pool: any) => pool?.status != POOL_STATUS.UPCOMMING && pool?.is_display == 1))
    pools.forEach(async (pool: any) => {
      const currentTime = moment.utc().unix();
      const startJoinPoolTime = parseInt(pool.start_join_pool_time);
      const endJoinPoolTime = parseInt(pool.end_join_pool_time);
      const startTime = parseInt(pool.start_time);
      const finishTime = parseInt(pool.finish_time);
      if(startJoinPoolTime > currentTime || endJoinPoolTime < currentTime && currentTime < startTime) {
        pool.status = POOL_STATUS.UPCOMMING
      } else if(startJoinPoolTime <= currentTime
        && currentTime <= endJoinPoolTime
        ) 
      {
        pool.status = POOL_STATUS.JOINING
      } else if(currentTime >= startTime && currentTime <= finishTime) {
        if(Math.round(pool.tokenSold * 100 / pool.total_sold_coin) == 100) {
          pool.status = POOL_STATUS.FILLED
        } else {
          pool.status = POOL_STATUS.IN_PROGRESS
        }
      } else {
        pool.status = POOL_STATUS.CLOSED
      }
    })
    if(!appChain || !connector) return
    pools.forEach(async (pool: any) => {
      if(pool.is_deploy === 0) return
      const tokenSold = await getTokenSold(pool)
      pool.tokenSold = tokenSold
    })
  }, [pools, appChain, connector]);

  const handleChangeTab = (tab: number) => {
    setTabActive(tab)
  }

  return (
    <DefaultLayout>
      <div className={styles.poolsContainer}>
        <div className={styles.tabs}>
          <span
            className={styles.btnTab + (tabActive === 1 ? ' active ' : ' ') + commonStyle.nnb1418d}
            onClick={() => handleChangeTab(1)}
          >All Pools</span>
          <span
            className={styles.btnTab + (tabActive === 2 ? ' active ' : ' ') + commonStyle.nnb1418d}
            onClick={() => handleChangeTab(2)}
          >Top Pools</span>
          <span
            className={styles.btnTab + (tabActive === 3 ? ' active ' : ' ') + commonStyle.nnb1418d}
            onClick={() => handleChangeTab(3)}
          >Pools Joined</span>
        </div>
        <div className={styles.tabContent}>
          <h2>List Pools</h2>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Search by Pool ID, Pool name, Token contract address, Token symbol"
              className={commonStyle.nnn1424h}
            />
            <img src={iconSearch}/>
          </div>
          <table style={{ width: '100%' }} className={styles.listPools}>
            <thead className={styles.poolsHead}>
              {isWidthUp('md', props.width) && <tr>
                <th style={{minWidth: '240px', width: '24%'}}>Pool Name</th>
                <th style={{minWidth: '120px', width: '12%'}}>Ratio</th>
                <th style={{minWidth: '120px', width: '12%'}}>Access</th>
                <th style={{minWidth: '400px', width: '40%'}}>Progress</th>
                <th style={{minWidth: '120px', width: '12%'}}>Status</th>
              </tr>}
              {isWidthDown('sm', props.width) && <tr>
                <th style={{minWidth: '150px', width: '50%'}}>Pool Name</th>
                <th style={{minWidth: '90px', width: '30%'}}>Progress</th>
                <th style={{minWidth: '60px', width: '20%'}}>Status</th>
              </tr>}
            </thead>
            <tbody className={styles.poolsBody + (pools.length <= 0 ? ' loading' : '')}>
              {pools.length > 0 && pools.map((pool: any) => {
                return <tr><Pool pool={pool}/></tr>
              })}
              {pools.length <= 0 && <tr className="loading"><td><CircularProgress size={80} /></td></tr>}
            </tbody>
            <tfoot>
              <div className={styles.pagination}>
                <img src={iconPrev}/>
                {currentPage - 3 >= 1 && <a className="prev-page" href="#">{currentPage - 3}</a>}
                {currentPage - 2 >= 1 && <a className="prev-page" href="#">{currentPage - 2}</a>}
                {currentPage - 1 >= 1 && <a className="prev-page" href="#">{currentPage - 1}</a>}
                {currentPage >= 1 && <a className="prev-page" href="#">{currentPage}</a>}
                {currentPage + 1 <= lastPage && <a className="prev-page" href="#">{currentPage + 1}</a>}
                {currentPage + 2 <= lastPage && <a className="prev-page" href="#">{currentPage + 2}</a>}
                {currentPage + 3 <= lastPage && <a className="prev-page" href="#">{currentPage + 3}</a>}
                <img src={iconNext}/>
              </div>
            </tfoot>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withWidth()(withRouter(Pools));
