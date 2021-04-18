import { useState, useEffect } from 'react';
import axios from '../../../services/axios';

const MESSAGE_INVESTOR_SIGNATURE = process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE || "";

const useUserPurchaseSignature = (connectedAccount: string | undefined | null, campaignId: number | undefined, authSignature: string | undefined) => {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [minBuy, setMinBuy] = useState<string| undefined>("");
  const [maxBuy, setMaxBuy] = useState<string| undefined>("");
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
      const getUserSignature = async () => {
        try {
          const config = {
            headers: {
              msgSignature: MESSAGE_INVESTOR_SIGNATURE 
            }
          }
          const response = await axios.post('/user/deposit', {
            campaign_id: campaignId,
            wallet_address: connectedAccount,
            signature: authSignature
          }, config);

          if (response.data && response.status && response.status === 200) {
            const { data } = response.data;
            if(data.message) {
              console.log('err', data.message);
              throw new Error(data.message);
            }
            if (data) {
              setSignature(data.signature);
              setMinBuy(data.min_buy);
              setMaxBuy(data.max_buy);
            } 
          } 
          if (response.data && response.status && response.status !== 200) {
            const { data } = response.data;
            throw new Error(data.message);
          }
        } catch (err) {
          setError(err.message);
        }
      }
    connectedAccount && campaignId && authSignature && getUserSignature();
  }, [connectedAccount, campaignId, authSignature]);

  return {
    signature,
    minBuy,
    maxBuy,
    error
  }
}

export default useUserPurchaseSignature;

