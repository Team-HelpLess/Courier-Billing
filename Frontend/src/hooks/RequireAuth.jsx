import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = () => {
  const user = useSelector((store) => store.user);

  return user.userAccessToken ? <Outlet /> : <Navigate to="/" />;
};
export default RequireAuth;
