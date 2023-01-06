import axios from "axios";
import { SessionStorage } from "./GlobalVariables";

const baseURL = process.env.REACT_APP_BASE_URL;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(SessionStorage.authToken);
  config.headers["Authorization"] = token ? `Bearer ${token}` : null;
  return config;
});

export { api };
