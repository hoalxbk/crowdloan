import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import useStyles from './style';

const dotIcon = '/images/icons/dot.svg'

const Card = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const {
    cardImage,
    days = 0,
    icon,
    status = 'closed'
  } = props

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img src={cardImage}/>
        {status == 'closed' && <div className="time closed">
          <span>Closed</span>
        </div>}
        {status == 'filled' && <div className="time filled">
          <span>Filled</span>
        </div>}
        {status == 'upcomming' && <div className="time upcomming">
          <img src={dotIcon}/>
          <span>&nbsp;In { days } days</span>
        </div>}
      </div>
      <div className={styles.cardBody}>
        <div className="card-content__title">
          <img src={icon}/>
          <div>
            <h2>PolkaFoundry</h2>
            <p>PKF/ETH</p>
          </div>
        </div>
        <ul className="card-content__content">
          <li>
            <span>Total Raise</span>
            <span className="total">$150K</span>
          </li>
          <li>
            <span>Min Allocation</span>
            <span className="total">0</span>
          </li>
          <li>
            <span>Max Allocation</span>
            <span className="total">TBA</span>
          </li>
          <li>
            <span>Access</span>
            <span className="total">Private</span>
          </li>
        </ul>
        {status == 'upcomming' && <div className="token-area">
          <div>
            <img src={icon}/>
            <span>Ethereum</span>
          </div>
          <div>
            <img src={icon}/>
            <span>BSC</span>
          </div>
        </div>}

        {status != 'upcomming' && <div className="progress-area">
          <p>Progress</p>
          <div className="progress">
            <span className="current-progress" style={{width: '60%'}}></span>
          </div>
          <div>
            <div>
              <span>100%</span>
              <span>(Min.53%)</span>
            </div>
            <span>75000/150000</span>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default Card;
