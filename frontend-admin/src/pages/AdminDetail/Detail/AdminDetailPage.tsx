import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import {withRouter} from 'react-router-dom';
import useStyles from '../styles';
import FormAdmin from "./FormAdmin";

const AdminDetailPage = (props: any) => {
  const styles = useStyles();
  const { history, match, admin, loading, failure, isCreate } = props;
  console.log('isCreate', isCreate);

  const showAdminCreate = () => {
    return (
      <>
        <FormAdmin
          admin={admin || {}}
          isCreate={isCreate}
        />
      </>
    )
  };

  const showAdminDetail = () => {
    if (admin) {
      return (
        <>
          <FormAdmin
            admin={admin}
            isCreate={isCreate}
          />
        </>
      )
    } else if (failure) {
      return <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>There is no admin that does exists</p>;
    }

    return (
      <div className={styles.skeletonLoading}>
        {
          [...Array(10)].map((num, index) => (
          <div key={index}>
            <Skeleton className={styles.skeleton} width="100%" />
          </div>
          ))
        }
      </div>
    );
  };

  return (
      <div className={styles.boxCampaignDetail}>
        <div className={styles.headBoxCampaignDetail}>
          <h2 className={styles.titleBoxCampaignDetail}>
            {isCreate ? 'Admin Create' : 'Admin Detail'}
          </h2>
        </div>
        <div className="clearfix"></div>
        <div className={styles.formShow}>
          {isCreate ? showAdminCreate() : showAdminDetail()}
        </div>
      </div>
  );
};

export default withRouter(AdminDetailPage);
