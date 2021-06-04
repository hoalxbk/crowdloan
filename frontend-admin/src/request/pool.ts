import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";

export const createPool = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/pool/create');

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const updatePool = async (data: any, id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${id}/update`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const getPoolDetail = async (id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${id}`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();
  return resObject;
};

export const updateDeploySuccess = async (data: any, id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${id}/deploy-success`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const changeDisplayStatus = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${data.poolId}/change-display`);

  const response = await baseRequest.post(url, {
    is_display: data.isDisplay,
  }) as any;

  const resObject = await response.json();
  return resObject;
};

export const changePublicWinnerStatus = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/pool/${data.pool_id}/change-public-winner-status`);

  const response = await baseRequest.post(url, {
    public_winner_status: data.public_winner_status,
  }) as any;

  const resObject = await response.json();
  return resObject;
};

export const depositPoolAdmin = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/deposit-admin');

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};
