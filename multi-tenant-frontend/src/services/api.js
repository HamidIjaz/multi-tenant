import axios from "axios";
import { getSubdomain } from "../utils/getSubdomain";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const subdomain = getSubdomain();
    if (subdomain) {
      config.headers["X-Tenant-ID"] = subdomain;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
