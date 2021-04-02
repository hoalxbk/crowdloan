import React from 'react';
import { Tooltip } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { convertUnixTimeToDateTime } from '../../../utils/convertDate';
import CampaignProgress from '../../../components/Base/CampaignProgress';
import _ from 'lodash';

const Campaign = (props: any) => {
  const { classNamePrefix = '', data = {} } = props;

  const title = _.get(data, 'title', '');
  const startTime = _.get(data, 'startTime', '');
  const closeTime = _.get(data, 'closeTime', '');

  return (
    <div className={`${classNamePrefix}__campaign`}>
      <div className={`${classNamePrefix}__campaign-duration`}>
        <AccessTimeIcon />
        <span>
          {convertUnixTimeToDateTime(startTime)} - {convertUnixTimeToDateTime(closeTime)}
        </span>
      </div>

      <Tooltip title={<p style={{ fontSize: 15 }}>{title}</p>}>
        <div className={`${classNamePrefix}__campaign-title ${classNamePrefix}__campaign-title--wordBreak`}>
        {title}
        </div>
      </Tooltip>

      <CampaignProgress
        campaign={data}
      />
    </div>
  );
};

export default Campaign;
