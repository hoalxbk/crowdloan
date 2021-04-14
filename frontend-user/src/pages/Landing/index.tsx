import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import useStyles from './style';
import commonStyles from '../../styles/CommonStyle'
import { LandingCard } from './Card';
import LandingLayout from '../../components/Layout/LandingLayout'

const cardImage = '/images/icons/card-image.jpg';
const arrowRightIcon = '/images/icons/arrow-right.svg';
const background = '/images/icons/background2.svg';
const landingBackground2 = '/images/landing/landing-bg2.svg'
const landingBackground = '/images/landing/landing-bg.svg'

const Dashboard = (props: any) => {
  const styles = useStyles();
  const common = commonStyles();

  const cardsInfo = [{
    image: '/images/landing/image1.svg',
    title: 'Multi-chain, flexible options',
    description: 'Red Kite supports both Ethereum and BSC pools, and are testing Polkadot pools on PolkaFoundry testnet, with flexbile types of pools and whitelist conditions.'
  },
  {
    image: '/images/landing/image2.svg',
    title: 'Hand-picked projects',
    description: 'We hand-pick project cautiously and verify the project team’s legitimacy, innovation of idea, and capacity to execute their vision.'
  },
  {
    image: '/images/landing/image3.svg',
    title: 'Fairness',
    description: 'We understand that opportunity delivery must be fair instead of rushing. Red Kite’s lane-based swap system ensure everybody have a chance accordingly to their tiers without gas war.'
  },
  {
    image: '/images/landing/image4.svg',
    title: 'Integrated Vesting Schedule',
    description: 'Red Kite goes with a Distribution Portal for projects to vest their sold tokens. This can even be used for secondary, post-IDO offerings.'
  },
  {
    image: '/images/landing/image5.svg',
    title: 'Parachain Crowdloan',
    description: 'Kusama and Polkadot parachain auctions are around the corner. Red Kite supports crownloan campaigns for projects to collect KSM and DOT tokens effectively for winning the auction.'
  }]

  return (
    <LandingLayout>
      <div className={styles.container}>
        <img src={landingBackground} alt=""/>
        <div className="main-content">
          <div className="title">
            <h1 className={common.nnb1214d}>Flying with Red Kite</h1>
          </div>
          <div className="description">
            <p className={common.nnb1824d}>Launch hand-picked projects in a fair way</p>
          </div>
          <div className="buttons">
            <button className={common.nnb1418d}>View all Pools</button>
            <button className={common.nnb1418d}>
              Subscribe to upcoming pools&nbsp;
              <img src={arrowRightIcon}/>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.cardContainer}>
        <h2 className={common.nnb2832d}>Innovative Features</h2>
        <div className="main-content">
          {cardsInfo.map((cardInfo, index) => {
            return <LandingCard key={index} cardInfo={cardInfo} />
          })}
        </div>
      </div>
      <div className={styles.container}>
        <img src={landingBackground2} alt=""/>
        <div className="main-content">
          <div className="title">
            <h1 className={common.nnb1214d}>Get Alerts For New Pools</h1>
          </div>
          <div className="description">
            <p className={common.nnb1824d}>Subscribe to get notified about new pools and other relevant events.</p>
          </div>
          <div className="buttons">
            <button className={common.nnb1418d}>
              Subscribe to upcoming pools&nbsp;
              <img src={arrowRightIcon}/>
            </button>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default withRouter(Dashboard);
