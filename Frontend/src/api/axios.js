import axios from "axios";

const BASE_URL = `https://${import.meta.env.VITE_BACKEND_ADDRESS}/api/`;

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
