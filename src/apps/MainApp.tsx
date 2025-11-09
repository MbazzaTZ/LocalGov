import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CitizenApp from "@/apps/citizen-App";
import StaffApp from "@/apps/staff-App";
import AdminApp from "@/apps/admin-App";
import { Navigate } from "react-router-dom";

const MainApp = () => {
  const { profile, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role) setRole(profile.role);
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
        <p className="text-gray-600">Loading user session...</p>
      </div>
    );
  }

  if (!role) return <Navigate to="/auth" replace />;

  switch (role) {
    case "Admin":
      return <AdminApp />;
    case "Staff":
    case "Ward":
    case "District":
    case "Village":
    case "Street":
      return <StaffApp />;
    default:
      return <CitizenApp />;
  }
};

export default MainApp;
