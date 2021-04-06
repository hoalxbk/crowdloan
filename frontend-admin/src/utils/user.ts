import { BaseRequest } from '../request/Request';
import {apiRoute} from "./index";

export const userAlreadyExists = async (ethAddress: string, isInvestor: boolean = false): Promise<boolean> => {
  try {
    const baseRequest = new BaseRequest();

    let url = '';

    url = apiRoute('/check-wallet-address');

    if (ethAddress) {
      const response = await baseRequest.post(url, {
        wallet_address: ethAddress
      }) as any;
      const resObj = await response.json();

      if (resObj.status === 200) {
        return true;
      } else if (resObj.status === 404) {
        return false;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};
