import useStyles from './styles';
import { useState } from 'react'

const BrightStartIcon = "/images/bright-star.svg";
const logo = '/images/logo-red-kite.svg';

const HeaderDefaultLayout = () => {
  const styles = useStyles();
  const [showBanner, setShowBanner] = useState(true)

  return (
    <>
      <div className={styles.navBar}>
        <div className="pool">
          <a href="#"><img src={BrightStartIcon} alt=""/></a>
          <a href="#"><span>&nbsp;&nbsp;Pool</span></a>
        </div>
        <div className="logo">
          <img src={logo} alt=""/>
        </div>
        <div className="connects">
          <a href="https://t.me/polkafoundry/"><i className="custom-icon-telegram"></i></a>
          <a href="https://twitter.com/polkafoundry/"><i className="custom-icon-twitter"></i></a>
          <a href="#"><i className="custom-icon-facebook"></i></a>
          <a href="#"><i className="custom-icon-github"></i></a>
        </div>
        {showBanner && <div className={styles.banner}>
          <img src="/images/icons/ring.svg" alt="red-warning icon" />
          <span className={styles.loginErrorBannerText}>
          &nbsp;&nbsp;The first IDO will start on the 1st half of May. Subscribe PolkaFoundry Telegram for the latest updates.
          &nbsp;&nbsp;<button 
            className={styles.btnChangeAppNetwork}
            onClick={() => {window.open('https://t.me/PolkaFoundryANN', '_blank')}}
          >
            Change App Network
          </button>
          </span>
        </div>}
      </div>
    </>
  );
};

export default HeaderDefaultLayout;
