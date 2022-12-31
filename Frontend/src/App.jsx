import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./hooks/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import RefreshToken from "./hooks/RefreshToken";

function App() {
  const aT = useSelector((state) => state.user.userAccessToken);

  const [isloading, setIsLoading] = useState(true);
  const refresh = RefreshToken();
  useEffect(() => {
    const verifyRefresh = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !aT ? verifyRefresh() : setIsLoading(false);
  }, []);

  return (
    <>
      {isloading ? (
        <P>Loading...</P>
      ) : (
        <AppWrapper>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />

              <Route element={<PersistLogin />}>
                <Route element={<RequireAuth />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AppWrapper>
      )}
    </>
  );
}

export default App;

const P = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: black;
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  margin: auto;

  @media (max-width: 400px) {
    width: 100%;
  }
`;
