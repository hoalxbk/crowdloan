import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";
const queryString = require('query-string');

/**
 * PARTICIPANTS
 */
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

export const addParticipantUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/participants/add`);
  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const pickerRandomWinner = async (campaignId: any, numberRandom: any = 100) => {
  const baseRequest = new BaseRequest();
  console.log('campaignId', campaignId);

  // pool/winner-random/:campaignId/:number
  let url = apiRoute(`/pool/winner-random/${campaignId}/${numberRandom}`);
  const response = await baseRequest.post(url, {}) as any;
  const resObject = await response.json();

  return resObject;
};

export const addParticipantUserToWinner = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/winners/add-to-winner`);
  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

/**
 * WINNERS
 */
export const getWinnerUser = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  // Fetch from API Protect by Auth Admin (with prefix)
  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/winners?${queryParams}`);
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const deleteWinnerUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/winners/${data.wallet_address}/delete`);
  const response = await baseRequest.delete(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

/**
 * RESERVE USERS
 */
export const getReserveUser = async (campaignId: any, params: any = {}) => {
  const baseRequest = new BaseRequest();

  // Fetch from API Protect by Auth Admin (with prefix)
  const queryParams = queryString.stringify(params);
  let url = apiRoute(`/pool/${campaignId}/reserves?${queryParams}`);
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const deleteReservesUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/reserves/${data.wallet_address}/delete`);
  const response = await baseRequest.delete(url, data) as any;
  const resObject = await response.json();

  return resObject;
};


export const addReservesUser = async (campaignId: any, data: any = {}) => {
  const baseRequest = new BaseRequest();

  let url = apiRoute(`/pool/${campaignId}/reserves/add`);
  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();

  return resObject;
};
