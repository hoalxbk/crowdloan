import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import { convertUnixTimeToDateTime } from '../../../utils/convertDate';
import CampaignProgress from '../../../components/Base/CampaignProgress';
import _ from 'lodash';

const Tiers = (props: any) => {
  const { classNamePrefix = '', data = {} } = props;

  const title = _.get(data, 'title', '');
  const startTime = _.get(data, 'startTime', '');
  const closeTime = _.get(data, 'closeTime', '');
  const maxToken = _.get(data, 'maxToekn', '');
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  console.log('tiers', tiers)

  useEffect(() => {
    console.log('here', tiers)
  }, [tiers]);


  return (
    <div className={`${classNamePrefix}__tiers`}>
      <ul className={`${classNamePrefix}__list`}>
        {tiers.length > 0 && tiers.map((tier: any) => {
          if(tier != 0) {
            return <div key={tier}>
              <li>{tier}</li>
              <Tooltip title={<p style={{ fontSize: 15 }}>{tier}</p>}>
                <div className={`${classNamePrefix}__tier-title ${classNamePrefix}__tier-title--wordBreak`}>
                  {tier}
                </div>
              </Tooltip>
            </div>
          }
        })}
      </ul>
    </div>
  );
};

export default Tiers;
