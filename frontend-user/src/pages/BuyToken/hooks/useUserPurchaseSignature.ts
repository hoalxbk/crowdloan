import { useState, useEffect } from 'react';
import axios from '../../../services/axios';


const useUserPurchaseSignature = (connectedAccount: string | undefined | null, campaignId: number | undefined) => {
  const [signature, setSignature] = useState<string | undefined>(undefined);

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

        console.log(response);
      }
    connectedAccount && campaignId && getUserSignature()  ;
  }, [connectedAccount, campaignId]);
}

export default useUserPurchaseSignature;

