import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStaffAuth } from "@/contexts/staff-AuthContext";

/**
 * ✅ StaffProtectedRoute
 * Restricts access to staff-only routes.
 * Automatically redirects unauthorized or unauthenticated users.
 */
const StaffProtectedRoute = ({
  children,
  allowedRoles = ["Staff", "Ward", "District", "Village", "Street"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const { user, loading, profile } = useStaffAuth();
  const location = useLocation();

  // 🟡 Show loading UI while checking session
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-secondary/5 text-gray-600">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm font-medium text-gray-700">
          Checking your access...
        </p>
      </div>
    );
  }

  // 🚫 If no active user, send to staff-login
  if (!user) {
    return <Navigate to="/staff-login" replace state={{ from: location }} />;
  }

  // 🚫 If user has no staff-related role
  if (!allowedRoles.includes(profile?.role || "")) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ message: "You are not authorized to access this section." }}
      />
    );
  }

  // ⚠️ If the user must change their password first
  if (profile?.must_change_password && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  // ✅ Authorized staff → render route content
  return children;
};

export default StaffProtectedRoute;
