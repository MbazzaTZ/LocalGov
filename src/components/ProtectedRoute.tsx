import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;

  // ✅ If no user, redirect to login
  if (!user) return <Navigate to="/auth" replace />;

  return children;
};

export default ProtectedRoute;
