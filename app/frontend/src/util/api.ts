import axios, { AxiosError } from "axios";
import { SessionStorage } from "./GlobalVariables";

const baseURL = process.env.REACT_APP_BASE_URL;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(SessionStorage.authToken);
  config.headers["Authorization"] = token ? `Bearer ${token}` : null;
  config.headers["Access-Control-Allow-Origin"] = '*';
  return config;
});

const parseError = (err: AxiosError): string => {
  const responseError = err.response.data;
  return `Status code: ${responseError["statusCode"]}, Message: ${responseError["message"]}`
}

export { api, parseError };
