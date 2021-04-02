import { BaseRequest } from '../request/Request';

export const userAlreadyExists = async (ethAddress: string, isInvestor: boolean = false): Promise<boolean> => {
  try {
    const baseRequest = new BaseRequest();

    let url = '';

    url = !isInvestor ? '/user/check-wallet-address': 'public/check-wallet-address';

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
