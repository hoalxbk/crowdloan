import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { withRouter, useParams } from 'react-router-dom';

import { AppContext } from '../../AppContext';
import { alertFailure, alertSuccess } from '../../store/actions/alert';
import { BaseRequest } from '../../request/Request';
import useStyles from './style';
import {adminRoute, apiRoute, publicRoute} from "../../utils";
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useAuth from '../../hooks/useAuth';

const loginLogo = '/images/login-logo.png';

const ConfirmEmail: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [confirmEmailLoading, setConfirmEmailLoading] = useState(false);

  const { token } = useParams() as any;

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
    }

    confirmEmail();
  }, []);

  return (
    <DefaultLayout>
      <Container fixed>
      <div className={classes.forgotPassword}>
        <div className="forgot-ps__wrap">
          {confirmEmailLoading && (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress size={80} />
              <p style={{ marginTop: 10, fontSize: 17, fontWeight: 600 }}>
                Email Confirmation Processing ...
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
    </DefaultLayout>
  )
};

export default withRouter(ConfirmEmail);
