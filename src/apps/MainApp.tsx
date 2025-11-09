import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import CitizenApp from "@/apps/citizen-App";
import StaffApp from "@/apps/staff-App";
import AdminApp from "@/apps/admin-App";

/**
 * 🧭 MainApp
 * Auto-selects which role-based subapp to render.
 * Keeps consistent glass design and fade transitions.
 */
const MainApp = () => {
  const { profile, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role) setRole(profile.role);
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 text-gray-600 transition-all duration-300">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-medium text-foreground/70">
          Checking your account access...
        </p>
      </div>
    );
  }

  if (!role) return <Navigate to="/auth" replace />;

  return (
    <div className="animate-fadeIn min-h-screen">
      {role === "Admin" ? (
        <AdminApp />
      ) : ["Staff", "Ward", "District", "Village"].includes(role) ? (
        <StaffApp />
      ) : (
        <CitizenApp />
      )}
    </div>
  );
};

export default MainApp;
