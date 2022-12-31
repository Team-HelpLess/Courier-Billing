import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import RefreshToken from "../hooks/RefreshToken";
import styled from "styled-components";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = RefreshToken();
  const aT = useSelector((state) => state.user.userAccessToken);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !aT ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <P>Loading...</P> : <Outlet />}</>;
};
export default PersistLogin;

const P = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: black;
`;
