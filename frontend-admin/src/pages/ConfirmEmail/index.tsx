import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { withRouter, useParams } from 'react-router-dom';

import { alertFailure, alertSuccess } from '../../store/actions/alert';
import { BaseRequest } from '../../request/Request';
import useStyles from './style';
import {adminRoute, apiRoute, publicRoute} from "../../utils";

const loginLogo = '/images/login-logo.png';

const ConfirmEmail: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [confirmEmailLoading, setConfirmEmailLoading] = useState(false);

  const { data: loginInvestor } = useSelector((state: any) => state.investor);
  const { data: loginUser } = useSelector((state: any) => state.user);

  const { role, token } = useParams() as any;

  if (role === 'investor' && loginInvestor) {
    props.history.push(publicRoute('/'));
  }
  if (role !== 'investor' && loginUser) {
    props.history.push(adminRoute('/'));
  }

  useEffect(() => {
    const confirmEmail = async () => {
      setConfirmEmailLoading(true);

      if (token) {
        const baseRequest = new BaseRequest();

        const response = await baseRequest.get(apiRoute(`/confirm-email/${token}`)) as any;
        const resObj = await response.json();

        if (resObj.status && resObj.status === 200) {
          dispatch(alertSuccess('Email confirm successful!'));
        } else {
          dispatch(alertFailure(resObj.message));
        }
      }

      setConfirmEmailLoading(false);

      if (role === 'investor') {
        props.history.push(publicRoute('/'));
      }
      if (role !== 'investor') {
        props.history.push(adminRoute('/'));
      }
    }

    confirmEmail();
  }, []);

  const render = () => {
    return (
      <>
        {
          confirmEmailLoading && (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress size={80} />
              <p style={{ marginTop: 10, fontSize: 17, fontWeight: 600 }}>Email Confirmation Processing ...</p>
            </div>
          )
        }
      </>
    )
  }

  return (
    <Container fixed>
      <div className={classes.forgotPassword}>
        <span className="forgot-ps__logo">
          <img src={loginLogo} alt="login-logo" />
          <h2 className="forgot-ps__brand">RedKite</h2>
        </span>
        <div className="forgot-ps__wrap">
          {
            render()
          }
        </div>
      </div>
    </Container>
  )
};

export default withRouter(ConfirmEmail);
