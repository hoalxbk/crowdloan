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
    poolDetail
  } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>List User Join Pools:</label>
      </div>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Participant" key="1">
          <UserParticipant poolDetail={poolDetail} />
        </TabPane>
        <TabPane tab="Winner" key="2">
          <UserWinner poolDetail={poolDetail} />
        </TabPane>
        <TabPane tab="Reserve" key="3">
          {/*{winners && winners.length > 0 &&*/}
          {/*  <UserWinner*/}
          {/*    users={winners}*/}
          {/*  />*/}
          {/*}*/}
          <UserWinner poolDetail={poolDetail} s/>
        </TabPane>
      </Tabs>

    </>
  );
};

export default UserJoinPool;
