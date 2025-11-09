import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/admin-AuthContext";

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, profile } = useAdminAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading admin session...
      </div>
    );

  if (!user || !profile?.is_admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
