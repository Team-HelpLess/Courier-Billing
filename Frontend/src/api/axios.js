import axios from "axios";

// const BASE_URL = `http://${import.meta.env.VITE_BACKEND_IP_ADDRESS}/api/`;
const BASE_URL = "http://127.0.0.1:8000/api/";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
