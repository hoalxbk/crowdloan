import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import ButtonLink from '../../components/Base/ButtonLink';
import {adminRoute} from "../../utils";
import PoolForm from "./PoolForm";
import {getPoolDetail} from "../../request/pool";
import moment from "moment";
import {DATETIME_FORMAT} from "../../constants";
import BackButton from "../../components/Base/ButtonLink/BackButton";

const PoolEdit: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = true;
  const { match } = props;
  // @ts-ignore
  const id = match.params?.id;
  const [poolDetail, setPoolDetail] = useState();

  useEffect(() => {
    getPoolDetail(id)
      .then((res) => {
        const data = res.data;
        const newData = {
          ...data,
          start_time: moment.unix(data.start_time).format(DATETIME_FORMAT),
          finish_time: moment.unix(data.finish_time).format(DATETIME_FORMAT),
          release_time: moment.unix(data.release_time).format(DATETIME_FORMAT),
          start_join_pool_time: moment.unix(data.start_join_pool_time).format(DATETIME_FORMAT),
          end_join_pool_time: moment.unix(data.end_join_pool_time).format(DATETIME_FORMAT),
        };
        setPoolDetail(newData);
      });
  }, [id]);

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/campaigns')}/>
      <PoolForm
        isEdit={isEdit}
        poolDetail={poolDetail}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolEdit);
