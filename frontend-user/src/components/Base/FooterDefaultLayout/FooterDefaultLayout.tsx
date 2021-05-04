import useStyles from './styles';
import { Link } from 'react-router-dom';
const byTokenLogo = '/images/logo-red-kite.svg';

const FooterDefaultLayout = () => {
  const styles = useStyles();

  return (
    <div className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.infoRedKite}>
          <Link to={'/'}>
            <img className={styles.logo} src={byTokenLogo} alt="" />
          </Link>
          <p>Lorem ipsum dolor sit amet, consectetur adip. Rem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <ul className={styles.shareLink}>
            <li className={styles.teleGram}>
              <a href="/">teleGram</a> 
            </li>
            <li className={styles.twitter}>
              <a href="/">twitter</a> 
            </li>
            <li className={styles.facebook}>
              <a href="/">facebook</a>
            </li>
            <li className={styles.github}>
              <a href="/">github</a>
            </li>
          </ul>
        </div>
        <div className={styles.infoCompany}>
          <ul className={styles.companyLink}>
            <li className={styles.title}>
              Company
            </li>
            <li>
              <a className={styles.link} href="/">about</a>
            </li>
            <li>
              <a className={styles.link} href="/">apply for IDO</a>
            </li>
          </ul>
        </div>
        <div className={styles.help}>
          <ul className={styles.helpLink}>
            <li className={styles.title}>
              Help
            </li>
            <li>
              <a className={styles.link} href="/">Support</a>
            </li>
            <li>
              <a className={styles.link} href="/">Term</a>
            </li>
            <li>
              <a className={styles.link} href="/">Privacy</a>
            </li>
          </ul>
        </div>
        <div className={styles.developers}>
          <ul className={styles.developerLink}>
            <li className={styles.title}>
              Developers
            </li>
            <li>
              <a className={styles.link} href="/">Documentation</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.endContent}>
        <p className={styles.copyRight}>Copyright © 2021 Icetea Labs. All rights reserved.</p>
      </div>
    </div>
  );
};

export default FooterDefaultLayout;
