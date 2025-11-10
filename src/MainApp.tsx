import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";

import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { useStaffAuth } from "@/contexts/staff-AuthContext";
import { useAdminAuth } from "@/contexts/admin-AuthContext";

import CitizenApp from "@/citizen-App";
import StaffApp from "@/staff-App";
import AdminApp from "@/admin-App";

/* -------------------------------------------------------------------------- */
/* 🧠 MainApp — Role-based entry point                                        */
/* -------------------------------------------------------------------------- */
/**
 * Detects logged-in user role (citizen, staff, or admin)
 * and mounts the correct App flow.
 */
const MainApp = () => {
  const { user: citizenUser, role: citizenRole, loading: citizenLoading } = useCitizenAuth();
  const { user: staffUser, role: staffRole, loading: staffLoading } = useStaffAuth();
  const { user: adminUser, role: adminRole, loading: adminLoading } = useAdminAuth();

  const loading = citizenLoading || staffLoading || adminLoading;

  // 🕒 Show loading spinner while checking sessions
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p>Checking your account...</p>
      </div>
    );
  }

  // 🧭 Decide which app to load
  if (adminUser || adminRole === "Admin") {
    return (
      <Router>
        <Toaster position="top-right" />
        <AdminApp />
      </Router>
    );
  }

  if (staffUser || ["Staff", "District", "Ward"].includes(staffRole)) {
    return (
      <Router>
        <Toaster position="top-right" />
        <StaffApp />
      </Router>
    );
  }

  if (citizenUser || citizenRole === "Citizen") {
    return (
      <Router>
        <Toaster position="top-right" />
        <CitizenApp />
      </Router>
    );
  }

  // 🚪 Default: no user found → direct to Citizen login/register
  return (
    <Router>
      <Toaster position="top-right" />
      <CitizenApp />
    </Router>
  );
};

export default MainApp;
