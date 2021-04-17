import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { clearAlert } from './store/actions/alert'
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/Base/ErrorBoundary';
import PrivateRoute from './components/Base/PrivateRoute';
import HomePage from './pages/HomePage/Index';
import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import Login from './pages/Login';
import CampaignDetailPage from './pages/CampaignDetailPage';
import TransactionPending from './pages/TransactionPending';
import Setting from './pages/Setting';
import NetworkChange from './pages/NetworkChange';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import ConfirmEmail from './pages/ConfirmEmail';
import Profile from './pages/Profile';
import AppContainer from "./AppContainer";
import Register from "./pages/Register";

//@ts-ignore
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import {adminRoute, publicRoute} from "./utils";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import AdminList from "./pages/AdminList/AdminList";
import AdminEdit from "./pages/AdminDetail/AdminEdit";
import AdminCreate from "./pages/AdminDetail/AdminCreate";
import Pools from "./pages/Pools";
import PoolCreate from "./pages/PoolCreate/PoolCreate";
import PoolDetailPage from "./pages/PoolDetailPage";
import PoolEdit from "./pages/PoolCreate/PoolEdit";

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
          render={() => <Redirect to={`${adminRoute()}`} />}
        />
        <PrivateRoute exact path={adminRoute()} component={HomePage} />

        <PrivateRoute exact path={adminRoute('/campaign-detail/pending/:id')} component={TransactionPending} />
        <PrivateRoute exact path={adminRoute('campaign-detail/:id')} component={PoolEdit} />
        <PrivateRoute path={adminRoute('/campaigns')} exact component={Pools} />
        <PrivateRoute path={adminRoute('/campaigns/add')} exact component={PoolCreate} />

        <PrivateRoute path={adminRoute('/setting')} component={Setting} />
        <PrivateRoute path={adminRoute('/profile')} component={Profile} />

        <Route path={adminRoute('/register')} component={Register} />
        <Route path={adminRoute('/login')} component={Login} />
        <Route path={('/forgot-password')} exact component={ForgotPassword} />
        <Route path={('/reset-password/user/:token')} component={ResetPassword} />

        <Route path={('/confirm-email/:role?/:token')} component={ConfirmEmail} />
        <Route path={'/change-password/:role?'} component={ChangePassword} />
        <Route path={adminRoute('/network-change')} component={NetworkChange} />

        <Route path={adminRoute('/admins')} component={AdminList} />
        <Route path={adminRoute('/admin-detail/:id')} component={AdminEdit} />
        <Route path={adminRoute('/admin-create')} component={AdminCreate} />

        <Route path={('/coming-soon')} component={ComingSoon} />
        <PrivateRoute exact path={adminRoute('/error')} component={ErrorPage} />
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
