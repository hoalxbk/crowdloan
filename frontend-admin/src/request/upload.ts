import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";

export const uploadFile = async (file: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/upload-avatar');

  const form_data = new FormData();
  form_data.append('avatar', file);
  const response = await baseRequest.postImage(url, form_data);
  const resObject = await response.json();

  return resObject;
};

