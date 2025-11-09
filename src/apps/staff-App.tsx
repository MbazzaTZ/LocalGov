import React from "react";
import { Routes, Route } from "react-router-dom";
import StaffProtectedRoute from "@/components/staff-ProtectedRoute";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffApplications from "@/pages/staff/StaffApplications";
import StaffReports from "@/pages/staff/StaffReports";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/**
 * 🧑‍💼 StaffApp
 * For Ward / District / Village staff accounts — themed to match portal.
 */
const StaffApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 text-foreground backdrop-blur-md transition-all duration-300">
      <Toaster />
      <Sonner />

      <Routes>
        <Route
          path="/dashboard"
          element={
            <StaffProtectedRoute>
              <StaffDashboard />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <StaffProtectedRoute>
              <StaffApplications />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <StaffProtectedRoute>
              <StaffReports />
            </StaffProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default StaffApp;

