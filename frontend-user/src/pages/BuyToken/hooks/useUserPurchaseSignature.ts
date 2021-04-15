import { useState, useEffect } from 'react';
import axios from '../../../services/axios';


const useUserPurchaseSignature = (connectedAccount: string | undefined | null, campaignId: number | undefined) => {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [deadLine, setDeadLine] = useState<string| undefined>("");
  const [maxBuy, setMaxBuy] = useState<string| undefined>("");

  useEffect(() => {
      const getUserSignature = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("investor_access_token")}`
          }
        }
        const response = await axios.post('/user/deposit', {
          campaign_id: campaignId,
          wallet_address: connectedAccount
        }, config);

        if (response.data && response.status && response.status === 200) {
          const { data } = response.data;
          if (data) {
            setSignature(data.signature);
            setDeadLine(data.dead_line);
            setMaxBuy(data.max_buy);
          }
        }
      }
    connectedAccount && campaignId && getUserSignature()  ;
  }, [connectedAccount, campaignId]);

  return {
    signature,
    deadLine,
    maxBuy
  }
}

export default useUserPurchaseSignature;

