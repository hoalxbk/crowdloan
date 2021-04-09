import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import BackgroundComponent from '../../components/BackgroundComponent';
import Card from './Card';

const cardImage = '/images/card-image.jpg';
const arrowRightIcon = '/images/icons/arrow-right.svg';
const background = '/images/icons/background2.svg';

const Dashboard = (props: any) => {
  const styles = useStyles();

  const dispatch = useDispatch();

  return (
    <DefaultLayout>
      <BackgroundComponent/>
      <div className={styles.listPools}>
        <h2>Upcoming Pools</h2>
        <div className="pools">
          <Card cardImage={cardImage}/>
          <Card cardImage={cardImage}/>
          <Card cardImage={cardImage}/>
          <Card cardImage={cardImage}/>
        </div>
        <button className="btn">
          Get Notified&nbsp;
          <img src={arrowRightIcon}/>
        </button>
      </div>
      <div className={styles.listPools} style={{marginTop: '220px'}}>
        <h2>Upcoming Pools</h2>
        <div className="pools">
          <Card cardImage={cardImage}/>
          <Card cardImage={cardImage}/>
          <Card cardImage={cardImage}/>
          <Card cardImage={cardImage}/>
        </div>
        <button className="btn">
          View all Pools&nbsp;
          <img src={arrowRightIcon}/>
        </button>
      </div>
      <div className={styles.getAlert}>
        <img src={background}/>
        <div className="content">
          <h2>Get Alerts For New Pools</h2>
          <p>Subscribe to get notified about new pools and other relevant events.</p>
          <button className="btn">
            Subscribe to upcoming pools&nbsp;
            <img src={arrowRightIcon}/>
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(Dashboard);
