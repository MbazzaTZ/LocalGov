import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";

/**
 * 🧍 CitizenProtectedRoute
 * Protects all citizen pages.
 * Ensures the user is logged in, verified (if needed), and role = Citizen.
 */
const CitizenProtectedRoute = ({
  children,
  requireVerification = true,
}: {
  children: JSX.Element;
  requireVerification?: boolean;
}) => {
  const { user, profile, loading } = useCitizenAuth();
  const location = useLocation();

  // 🕓 Wait while loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-secondary/5 text-gray-600">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-medium text-gray-700">Checking your session...</p>
      </div>
    );
  }

  // 🚫 No user logged in → redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // 🚫 Wrong role → redirect to their appropriate dashboard
  if (profile?.role && profile.role !== "Citizen") {
    return <Navigate to={`/${profile.role.toLowerCase()}-dashboard`} replace />;
  }

  // ⚠️ Require verification before accessing services/dashboard
  if (requireVerification && !profile?.is_verified) {
    return <Navigate to="/verify" replace />;
  }

  // ✅ Authenticated & Verified Citizen
  return children;
};

export default CitizenProtectedRoute;
