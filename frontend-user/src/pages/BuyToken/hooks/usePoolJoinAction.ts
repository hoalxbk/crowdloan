import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import axios from '../../../services/axios';
import { connectorNames } from '../../../constants/connectors';
import { getParamsWithConnector } from '../../../store/actions/user';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
}

const usePoolJoinAction = ({ poolId }: PoolDepositActionParams) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const [poolJoinLoading, setPoolJoinLoading] = useState<boolean>(false);
  const connector = useTypedSelector(state => state.connector).data;

  const joinPool = useCallback(async () => {
    if (account && poolId && library) {
      setPoolJoinLoading(true);

      const paramsWithConnector = getParamsWithConnector(account)[connector as connectorNames];
      const provider = library.provider;

      provider && await (provider as any).sendAsync({
          method: paramsWithConnector.method,
          params: paramsWithConnector.params
      }, async function(err: Error, result: any) {
        if (err || result.error) {
           const errMsg = (err.message || (err as any).error) || result.error.message
           console.log('Error when signing message: ', errMsg);
        } else {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("investor_access_token")}`,
              msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
            }
          }

          const response = await axios.post(`/user/join-campaign`, {
            signature: result.result,
            wallet_address: account,
            campaign_id: poolId
          }, config) as any;


          if (response.data) {
            if (response.data.status === 200) {
              dispatch(alertSuccess("Join Pool Successful!"));
            }

            if (response.data.status !== 200) {
              dispatch(alertFailure(response.data.message));
            }
          } 

          setPoolJoinLoading(false);
        }
      });
    }
  }, [poolId, account]);

  return {
    joinPool,
    poolJoinLoading
  }
}

export default usePoolJoinAction;
