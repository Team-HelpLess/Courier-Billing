import axios from "axios";

const BASE_URL = `https://${import.meta.env.VITE_BACKEND_ADDRESS}/`;

export const axiosPublic = axios.create({baseURL:BASE_URL});

export default axios.create({
  baseURL: `${BASE_URL}api/`,
});

export const axiosPrivate = axios.create({
  baseURL: `${BASE_URL}api/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
