import BigNumber from 'bignumber.js';
import _ from 'lodash';
import {ADMIN_URL_PREFIX, API_URL_PREFIX, ETHERSCAN_BASE_URL, IMAGE_URL_PREFIX, NETWORK_AVAILABLE} from "../constants";
import axios from "axios";

// const ETHERSCAN_BASE_URL: any = {
//   '1': 'https://etherscan.io/address',
//   '4': 'https://rinkeby.etherscan.io/address',
//   '5': 'https://goerli.etherscan.io/address',
//   '97': 'https://testnet.bscscan.com/address',
// };

export function formatPrecisionAmount(amount: any, precision: number = 18): string {
  const rawValue = new BigNumber(`${amount}`).toFixed(precision);
  return (amount && parseFloat(amount) !== Infinity) ? new BigNumber(rawValue).toFormat() : '0';
}

export const routeWithPrefix = (prefix = ADMIN_URL_PREFIX, url = '') => {
  const truncateUrl = _.trim(url, '/');
  return `/${prefix}/${truncateUrl}`;
};

export const adminRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${ADMIN_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const publicRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${truncateUrl}`;
  return resUrl;
};

export const checkIsAdminRoute = (pathname: string) => {
  return (pathname.indexOf(`/${ADMIN_URL_PREFIX}`) !== -1) || (pathname === '/dashboard/login');
};

export const checkIsLoginRoute = (pathname: string) => {
  return pathname.indexOf(`/login`) !== -1;
};

export const checkIsInvestorRoute = (pathname: string) => {
  return false;
  // return (pathname.indexOf(`/buy-token`) !== -1) ||  (pathname === '/login');
};

export const apiRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${API_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const imageRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `${process.env.REACT_APP_API_BASE_URL || ''}/${IMAGE_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

// export const etherscanAddressRoute = (address = '', poolDetail: any = null) => {
//   return etherscanRoute(`address/${address}`, poolDetail);
// };
//
// export const etherscanTransactionRoute = (address = '', poolDetail: any = null) => {
//   return etherscanRoute(`tx/${address}`, poolDetail);
// };

export const etherscanRoute = (address = '', poolDetail: any = null) => {
  let network = '';
  if (poolDetail) {
    if (poolDetail.network_available === NETWORK_AVAILABLE.BSC) {
      network = process.env.REACT_APP_BSC_NETWORK_ID + '';
    } else {
      network = process.env.REACT_APP_NETWORK_ID + '';
    }
  }

  const networkId = network || localStorage.getItem('NETWORK_ID') || process.env.REACT_APP_NETWORK_ID || '1';
  const baseUrl = ETHERSCAN_BASE_URL[networkId];
  const truncateUrl = _.trim(address, '/');
  const resUrl = `${baseUrl}/${truncateUrl}`;
  return resUrl;
};

export const getTransactionRowType = (transaction: any) => {
  if (transaction?.type === 'Refund') {
    return 'Refund';
  }
  if (transaction?.type === 'TokenClaimed') {
    return 'Claim';
  }
  return 'Buy';
};

export const getETHPrices = async () => {
  // To use:
  // useEffect(() => {
  //   getETHPrices().then((resPrices: any) => {
  //     console.log(resPrices);
  //   });
  // }, []);

  return await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(function (response) {
      let resData = JSON.parse(JSON.stringify(response));
      resData = (resData && resData.data) || {};
      return (resData && resData.ethereum && resData.ethereum.usd) || 0;
    })
    .catch(function (error) {
      console.log(error);
    });
};
