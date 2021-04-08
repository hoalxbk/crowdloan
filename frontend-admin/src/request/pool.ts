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

