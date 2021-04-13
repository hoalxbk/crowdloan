import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { clearAlert } from './store/actions/alert'
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/Base/ErrorBoundary';
import PrivateRoute from './components/Base/PrivateRoute';

import BuyToken from './pages/BuyToken';
import Dashboard from './pages/Dashboard';
import NetworkChange from './pages/NetworkChange';
import ChangePassword from './pages/ChangePassword';
import ConfirmEmail from './pages/ConfirmEmail';
import AppContainer from "./AppContainer";

import InvestorRegister from "./pages/Register/InvestorRegister";
import InvestorForgotPassword from "./pages/ForgotPassword/InvestorForgotPassword";
import InvestorResetPassword from "./pages/ResetPassword/InvestorResetPassword";
import InvestorLogin from "./pages/Login/InvestorLogin";

import Account from "./pages/Account";

//@ts-ignore
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import {adminRoute, publicRoute} from "./utils";
import ComingSoon from "./pages/ComingSoon/ComingSoon";

/**
 * Main App routes.
 */
const Routes: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const dispatch = useDispatch();
  const alert = useSelector((state: any) => state.alert);
  const { history } = props;

  useEffect(() => {
    const { type, message } = alert;
    if (type && message) {
      NotificationManager[type](message);
    }
  }, [alert]);

  useEffect(() => {
    history.listen((location, action) => {
      dispatch(clearAlert());
    });
  }, []);

  return (
    <div>
      <Switch>
        <Route
          exact path="/"
          render={() => <Redirect to={`${'/dashboard'}`} />}
        />
        <Route exact path={`${'/dashboard'}`} component={Dashboard} />
        <Route path={`${'/buy-token/:id'}`} component={BuyToken} />
        <Route path={'/register'} component={InvestorRegister} />
        <Route path={'/login'} component={InvestorLogin} />
        <Route path={'/forgot-password/investor'} exact component={InvestorForgotPassword} />
        <Route path={'/reset-password/investor/:token'} component={InvestorResetPassword} />
        <Route path={'/confirm-email/:role?/:token'} component={ConfirmEmail} />
        <Route path={'/network-change'} component={NetworkChange} />
        <Route path={'/change-password/:role?'} component={ChangePassword} />
        <Route path={'/account'} component={Account} />

        <Route path={'/coming-soon'} component={ComingSoon} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
};

const RoutesHistory = withRouter(Routes);

const routing = function createRouting() {
  return (
    <>
      <NotificationContainer />
      <Router>
        <AppContainer>
          <ErrorBoundary>
            <RoutesHistory />
          </ErrorBoundary>
        </AppContainer>
      </Router>
    </>
  );
};
/**
 * Wrap the app routes into router
 *
 * PROPS
 * =============================================================================
 * @returns {React.Node}
 */
export default routing;
