import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";
const queryString = require('query-string');

export const getParticipantUser = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  // Fetch from API Protect by Auth Admin (with prefix)
  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/participants?${queryParams}`);
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const deleteParticipantUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/participants/${data.wallet_address}/delete`);
  const response = await baseRequest.delete(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const getWinnerUser = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  // Fetch from API Protect by Auth Admin (with prefix)
  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/winners?${queryParams}`);
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

