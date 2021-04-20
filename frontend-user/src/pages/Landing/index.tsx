import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import useStyles from './style';
import commonStyles from '../../styles/CommonStyle'
import { LandingCard } from './Card';
import LandingLayout from '../../components/Layout/LandingLayout'
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

const cardImage = '/images/icons/card-image.jpg';
const arrowRightIcon = '/images/icons/arrow-right.svg';
const background = '/images/icons/background2.svg';
const landingBackground2 = '/images/landing/landing-bg2.svg'
const landingBackground = '/images/landing/landing-bg.svg'
const landingBackgroundXs = '/images/landing/landing-bg-xs.svg'

const Dashboard = (props: any) => {
  const styles = useStyles();
  const common = commonStyles();

  const cardsInfo = [{
    image: '/images/landing/image1.svg',
    title: 'Multi-chain, flexible options',
    description: 'Red Kite supports both Ethereum and BSC pools, and are testing Polkadot pools on PolkaFoundry testnet to become the first launchpad on Polkadot, with flexible pool types and whitelist conditions.',
    backgroundColor: 'linear-gradient(180deg, rgba(147, 19, 51, 0.69) 0%, #060B26 50%)'
  },
  {
    image: '/images/landing/image2.svg',
    title: 'Hand-picked projects',
    description: 'We hand-pick projects cautiously, scrutinize and verify the project team’s origin and legitimacy, innovation of idea, and their capacity to execute their vision.',
    backgroundColor: 'linear-gradient(180deg, #234650 0%, #060B26 50%)'
  },
  {
    image: '/images/landing/image6.svg',
    title: 'Tier and reputation ',
    description: "Our bot system automatically monitors participants' behavior to set reputation points for each partcicipants based on their actions. Reputation will affect a participant's tier and their ability to participate in next launches.",
    backgroundColor: 'linear-gradient(180deg, #50A3CF 0%, #060B26 50%)'
  },
  {
    image: '/images/landing/image3.svg',
    title: 'Fairness',
    description: "We understand that opportunities should be delivered fairly and efficiently. Red Kite's lane-based swap system ensures everybody has a chance to join accordingly based on their tier without having to resort to gas war.",
    backgroundColor: 'linear-gradient(180deg, #50307D 0%, #060B26 50%)'
  },
  {
    image: '/images/landing/image4.svg',
    title: 'Integrated Vesting Schedule',
    description: 'Red Kite goes with a Distribution Portal for projects to vest their sold tokens. This feature can also be used for pre-sale or post-sale secondary offerings.',
    backgroundColor: 'linear-gradient(180deg, #274F89 0%, #060B26 43.95%)'
  },
  {
    image: '/images/landing/image5.svg',
    title: 'Parachain Crowdloan',
    description: 'Kusama and Polkadot parachain auctions are around the corner. Red Kite supports crownloan campaigns for projects to collect KSM and DOT tokens effectively for winning the auction.',
    backgroundColor: 'linear-gradient(180deg, #5C274F 0%, #060B26 43.33%)'
  }]

  return (
    <LandingLayout>
      <div className={styles.container}>
        {isWidthUp('sm', props.width) && <img src={landingBackground} alt=""/>}
        {isWidthDown('xs', props.width) && <img src={landingBackgroundXs} alt=""/>}
        <div className="main-content">
          {isWidthUp('sm', props.width) && <div className="title">
            <h1 className={common.nnb1214d}>Soar with Red Kite</h1>
          </div>}
          {isWidthDown('xs', props.width) && <div className="title">
            <h1 className={common.nnb1214d}>Soar with</h1>
            <h1 className={common.nnb1214d}>Red Kite</h1>
          </div>}
          <div className="description">
            <p className={common.nnb1824d}>Launch hand-picked projects and help them shine.<br/>Hold $PKF to participate.</p>
          </div>
          <div className="buttons">
            <button className={common.nnb1418d}>View all Pools</button>
            <button className={common.nnb1418d + ' btn'}>
              Subscribe to upcoming pools&nbsp;&nbsp;
              <img src={arrowRightIcon}/>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.cardContainer}>
        <h2 className={common.nnb2832d}>Unparalleled Features</h2>
        <div className="main-content">
          {cardsInfo.map((cardInfo, index) => {
            return <LandingCard key={index} cardInfo={cardInfo} />
          })}
        </div>
      </div>
      <div className={styles.container}>
        <img src={landingBackground2} alt="" className="bg2"/>
        <div className="main-content">
          <div className="title">
          {<h2 className={common.nnb1214d}>The first IDO will start on 1st half of May,<br/>subscribe to PolkaFoundry Telegram for updates</h2>}
          {/* {isWidthDown('xs', props.width) && <h2 className={common.nnb1214d}>Get Alerts For New Pools</h2>} */}
          </div>
          <div className="description">
            {/* {isWidthDown('xs', props.width) && <p className={common.nnn1424h} style={{opacity: 0.7, margin: '19px 0 -23px 0'}}>Subscribe to get notified about <br/>new pools and other relevant events.</p>} */}
          </div>
          <div className="buttons">
            <button className={common.nnb1418d + ' btn'}>
              Subscribe to upcoming pools&nbsp;&nbsp;
              <img src={arrowRightIcon}/>
            </button>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default withWidth()(withRouter(Dashboard));
