import axios from "axios";

const BASE_URL = `https://${import.meta.env.VITE_BACKEND_ADDRESS}/api/`;

export default axios.create({
  baseURL: `${BASE_URL}api/`,
});

export const axiosPrivate = axios.create({
  baseURL: `${BASE_URL}api/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
