import React from 'react';
import useStyles from './style_dark';

const byTokenLogo = '/images/logo-in-buy-page.png';

const Logo = (props: any) => {
  const classes = useStyles();

  return (
    <div className={`${classes.buyToken}__logo`}>
      <img src={byTokenLogo} alt="logo" />
    </div>
  );
}

export default Logo;
