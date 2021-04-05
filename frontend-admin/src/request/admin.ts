import BigNumber from 'bignumber.js';
import _ from 'lodash';
import {ADMIN_URL_PREFIX, API_URL_PREFIX} from "../constants";
import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";
const queryString = require('query-string');

export const getAdminList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/admins`);
  url += '?' + queryString.stringify(queryParams);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const getAdminDetail = async (id: number | string) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/admins/${id}`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const updateAdmin = async (id: number | string, data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/admins/${id}`);
  const response = await baseRequest.put(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const createAdmin = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/admins`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();

  return resObject;
};
