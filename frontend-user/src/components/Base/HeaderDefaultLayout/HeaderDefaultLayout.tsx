import useStyles from './styles';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Link } from 'react-router-dom';
import {adminRoute} from "../../../utils";
import ButtonLink from '../ButtonLink'
const byTokenLogo = '/images/logo-red-kite.svg';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const HeaderDefaultLayout = () => {
  const styles = useStyles();
  const { data: loginUser } = useTypedSelector(state => state.user);

  return (
    <div className={styles.navBar}>
      <div>
        <Link to={'/'}>
          <img src={byTokenLogo} alt="" />
        </Link>
      </div>
      <div className={styles.rightBar}>
        <ButtonLink text="Pool" to={'/'} className={styles.btnPool} />
        {!loginUser && <ButtonLink text="Collect Wallet" to={'/'} className={styles.btnConnect} />}
        {loginUser && <ButtonLink text="Logout" to={'/'} className={styles.btnLogout} />}
      </div>
    </div>
  );
};

export default HeaderDefaultLayout;
