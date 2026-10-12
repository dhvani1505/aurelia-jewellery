
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
