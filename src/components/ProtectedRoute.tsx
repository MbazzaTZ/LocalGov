import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * ✅ ProtectedRoute Component
 * Ensures that only authenticated users can access protected pages.
 * Handles session persistence and redirect fallback gracefully.
 */

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🟡 Show loading UI while checking session
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-secondary/5 text-gray-600">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm font-medium text-gray-700">Checking session...</p>
      </div>
    );
  }

  // 🔴 Redirect unauthenticated users to /auth
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // 🟢 Authenticated users continue normally
  return children;
};

export default ProtectedRoute;
