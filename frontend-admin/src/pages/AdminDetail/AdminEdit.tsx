import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import AdminDetailPage from './Detail/AdminDetailPage';
import {Grid} from '@material-ui/core';

import {RouteComponentProps, withRouter} from 'react-router-dom';
import ButtonLink from '../../components/Base/ButtonLink';
import {useCommonStyle} from '../../styles';
import {adminRoute} from "../../utils";
import {getAdminDetail} from "../../request/admin";
import BackButton from "../../components/Base/ButtonLink/BackButton";

interface MatchParams {
  id: string;
}

const AdminEdit: React.FC<RouteComponentProps<MatchParams>> = (props: RouteComponentProps<MatchParams>) => {
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();
  const { match } = props;
  const id = match.params.id;
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);

  const getAdminInfo = async () => {
    try {
      setLoading(true);
      const resObject = await getAdminDetail(id);
      if (resObject.status === 200) {
        setAdmin(resObject.data);
        setFailure(false);
      } else {
        setFailure(true);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setFailure(true);
    }
  };

  useEffect(() => {
    getAdminInfo();
  }, []);

  return (
    <DefaultLayout>
      <div className={commonStyle.headPage}>
        <div className={commonStyle.headPageLeft}>
          <BackButton to={adminRoute('/admins')}/>
        </div>
      </div>
      <div className="contentPage">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {loading &&
              <>
                Loading
              </>
            }
            {!loading &&
              <AdminDetailPage
                admin={admin}
                loading={loading}
                failure={failure}
                isCreate={false}
              />
            }
          </Grid>
        </Grid>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(AdminEdit);
