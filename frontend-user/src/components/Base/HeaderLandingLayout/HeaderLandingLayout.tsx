import useStyles from './styles';

const BrightStartIcon = "/images/bright-star.svg";
const logo = '/images/logo-red-kite.svg';

const HeaderDefaultLayout = () => {
  const styles = useStyles();

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
      </div>
    </>
  );
};

export default HeaderDefaultLayout;
