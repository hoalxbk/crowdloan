import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import { getUserTierAlias } from '../../../utils/getUserTierAlias';
import useAuth from '../../../hooks/useAuth';
import withWidth, {isWidthDown, isWidthUp} from '@material-ui/core/withWidth';
import { getTiers } from '../../../store/actions/sota-tiers';

const warningIcon = '/images/icons/warning.svg';

const Tiers = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { data: userTier = '0' } = useSelector((state: any) => state.userTier);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const [loading, setLoading] = useState(true);
  const { isAuth, connectedAccount, wrongChain } = useAuth();

  const {
    currentTier,
  } = props;

  return (
    <div className={styles.tierInfomation}>
      <div className={styles.tierNote}>
        <h2 className="title">Equivalent PKF</h2>
        <span className="subtitle">902 800 PKF</span>
        <span>you are in Tier {currentTier}</span>
        <span>Please hold token in your wallet balance to maintain your tier!</span>
      </div>
      <div className={styles.conversionRate}>
        <h2 className="title">Conversion Rate</h2>
        <div className="group">
          <span>1pkf</span>
          <img src={warningIcon}/>
          <span>1pkf</span>
        </div>
      </div>
    </div>
  );
};

export default withWidth()(Tiers);
