import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import usePoolDetails, { PoolDetailKey } from './hooks/usePoolDetails';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import useAuth from '../../hooks/useAuth';

import DefaultLayout  from '../../components/Layout/DefaultLayout';
import Tiers from '../Account/Tiers';

import { getTiers } from '../../store/actions/sota-tiers';

import useStyles from './style';

const poolImage = "/images/pool_circle.svg";
const copyImage = "/images/copy.svg";

type BuyTokenProps = {

}

const BuyToken: React.FC<BuyTokenProps> = (props: BuyTokenProps) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const { isAuth, connectedAccount } = useAuth();
  const poolDetails = usePoolDetails();
  const tier = useTypedSelector(state => state.tiers);

  useEffect(() => {
    if (isAuth)console.log(connectedAccount);
    isAuth && dispatch(getTiers()) 
  }, [isAuth]);

  return (
    <DefaultLayout>
      <div className={styles.poolDetailContainer}>
        <header className={styles.poolDetailHeader}> 
          <div className={styles.poolHeaderImage}>
            <img src={poolImage} alt="pool-image" />
          </div>
          <div className={styles.poolHeaderInfo}>
            <h2 className={styles.poolHeaderTitle}>PolkaFoundry</h2>
            <p className={styles.poolHeaderAddress}>
            {'0x7C0C8E823e109702a7Ada15F46eE23053eEfCf10'}
              <img src={copyImage} alt="copy-icon" className={styles.poolHeaderCopy} />
            </p>
          </div>
        </header>
        <main className={styles.poolDetailInfo}>
          <div className={styles.poolDetailIntro}>
            {
              Object.keys(poolDetails).map((key: string) => (
                <div className={styles.poolDetailBasic}>
                  {
                    poolDetails[key as PoolDetailKey].display
                  }
                </div>
              ))
            }
          </div>
          <div>
            <Tiers />
          </div> 
        </main>
      </div>
    </DefaultLayout>
  )
}

export default BuyToken;
