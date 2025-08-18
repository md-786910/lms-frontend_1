import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
