import React from 'react';
import useStyles from "../style";
import UserParticipant from "./UserWinner/UserParticipant";
import UserWinner from "./UserWinner/UserWinner";

import {Tabs} from 'antd';
import UserReverse from "./UserWinner/UserReverse";
import PublicWinnerSetting from "./UserWinner/PublicWinnerSetting";

const { TabPane } = Tabs;
function callback(key: any) {
  console.log(key);
}

const UserJoinPool = (props: any) => {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail,
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

          <div style={{
            paddingBottom: 20
          }}>
            <PublicWinnerSetting
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
            />
          </div>

          <UserWinner poolDetail={poolDetail} />
        </TabPane>
        <TabPane tab="Reserve" key="3">
          <UserReverse poolDetail={poolDetail} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default UserJoinPool;
