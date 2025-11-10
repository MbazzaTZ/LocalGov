import React from "react";
import { Navigate } from "react-router-dom";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { Loader2 } from "lucide-react";

/**
 * 🛡️ CitizenProtectedRoute
 * Guards all citizen routes, enforcing:
 * - Login required
 * - Verification (NIDA, TIN, etc.) check
 */
const CitizenProtectedRoute = ({
  children,
  requireVerified = false,
}: {
  children: JSX.Element;
  requireVerified?: boolean;
}) => {
  const { user, loading, profile } = useCitizenAuth();

  // 🌀 Show loading state while auth initializes
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-yellow-300" />
        <p className="text-lg font-medium">Loading your account...</p>
      </div>
    );
  }

  // 🔒 Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ⚠️ Redirect to verification page if required and not verified
  if (requireVerified && !profile?.is_verified) {
    return <Navigate to="/verify" replace />;
  }

  // ✅ Access granted
  return children;
};

export default CitizenProtectedRoute;
