import axios from "axios";

export type Token = string;

export type SetToken = () => void;

let token: Token = "";

export const setTokenInAxios: SetToken = () => {
  token = `Bearer ${sessionStorage.getItem("accessToken") || ""}`;
  axios.defaults.headers.common.Authorization = token;
};

export default axios;
