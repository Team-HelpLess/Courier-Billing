// Imports
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Actual RequireAuth component
const RequireAuth = () => {
  // user from store
  const user = useSelector((store) => store.user);

  // If user is present return the Outlet or navigate to hompage
  return user.userAccessToken ? <Outlet /> : <Navigate to="/" />;
};
export default RequireAuth;
