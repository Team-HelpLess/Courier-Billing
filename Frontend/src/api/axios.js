import axios from "axios";

// const BASE_URL = `http://${import.meta.env.VITE_BACKEND_IP_ADDRESS}/api/`;
// const BASE_URL = "http://127.0.0.1:8000/";
const BASE_URL = "https://goameer030-animated-garbanzo-pw66w6q777wfr56v-8000.preview.app.github.dev/";

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
