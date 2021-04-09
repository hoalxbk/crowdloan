import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";

export const getTiers = async (campaignId: any) => {
  const baseRequest = new BaseRequest();

  let url = `/pool/${campaignId}/tiers`;
  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

// export const getWinnerUser = async (campaignId: any) => {
//   const baseRequest = new BaseRequest();
//
//   let url = `/pool/${campaignId}/winners`;
//   const response = await baseRequest.get(url) as any;
//   const resObject = await response.json();
//
//   return resObject;
// };

