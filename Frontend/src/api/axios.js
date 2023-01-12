import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

export const axiosPublic = axios.create({
  baseURL: `${BASE_URL}drs/`,
});

export default axios.create({
  baseURL: `${BASE_URL}api/`,
});

export const axiosPrivate = axios.create({
  baseURL: `${BASE_URL}api/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
