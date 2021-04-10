import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import UserParticipant from "./UserParticipant";
import UserWinner from "./UserWinner";
import {getParticipantUser, getWinnerUser} from "../../../request/participants";

import {Tabs} from 'antd';
const { TabPane } = Tabs;
function callback(key: any) {
  console.log(key);
}

const UserJoinPool = (props: any) => {
  const classes = useStyles();
  const {
    register, setValue, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError,
  } = props;

  const [winners, setWinners] = useState([]);
  const [partipants, setPartipants] = useState([]);

  useEffect(() => {
    if (poolDetail && poolDetail.id) {
      getWinnerUser(poolDetail.id)
        .then((res) => {
          setWinners(res.data);
        });
    }
  }, [poolDetail]);

  useEffect(() => {
    if (poolDetail && poolDetail.id) {
      getParticipantUser(poolDetail.id)
        .then((res) => {
          setPartipants(res.data);
        });
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>List User Join Pools:</label>
      </div>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Participant" key="1">
          {partipants && partipants.length > 0 &&
            <UserParticipant
              users={partipants}
            />
          }
        </TabPane>
        <TabPane tab="Winner" key="2">
          {winners && winners.length > 0 &&
            <UserWinner
              users={winners}
            />
          }
        </TabPane>
        <TabPane tab="Reserve" key="3">
          {winners && winners.length > 0 &&
            <UserWinner
              users={winners}
            />
          }
        </TabPane>
      </Tabs>

    </>
  );
};

export default UserJoinPool;
