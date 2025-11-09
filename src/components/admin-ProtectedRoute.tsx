import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/admin-AuthContext";

/**
 * 👑 AdminProtectedRoute
 * Restricts routes to Admin users only.
 * Redirects others (staff, citizen, unverified) away.
 */
const AdminProtectedRoute = ({
  children,
  allowedRoles = ["Admin"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const { user, profile, loading } = useAdminAuth();
  const location = useLocation();

  // ⏳ Show loading screen during session validation
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-secondary/5 text-gray-600">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-medium text-gray-700">Verifying admin access...</p>
      </div>
    );
  }

  // 🚫 Not logged in → redirect to admin login
  if (!user) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  // 🚫 No profile data or unauthorized role → deny access
  if (!profile || !allowedRoles.includes(profile?.role || "")) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message: "You do not have permission to access the admin area.",
        }}
      />
    );
  }

  // ⚠️ If admin must change password before proceeding
  if (profile?.must_change_password && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  // ✅ Authorized admin
  return children;
};

export default AdminProtectedRoute;
