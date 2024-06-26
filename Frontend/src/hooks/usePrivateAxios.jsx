// Imports
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import RefreshToken from "./RefreshToken";

// Functional component creating custom hook useAxiosPrivate
const useAxiosPrivate = () => {
  // accessToken from store and refresh instance from refreshToken component
  const accessToken = useSelector((state) => state.user.userAccessToken);
  const refresh = RefreshToken();

  // Actual logic to integrate the bearer token in the header for authorization
  useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return axiosPrivate;
};
export default useAxiosPrivate;
