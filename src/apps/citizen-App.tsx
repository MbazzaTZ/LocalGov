import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CitizenLayout from "@/layouts/CitizenLayout";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import CitizenVerify from "@/pages/citizen/CitizenVerify";
import CitizenRegistration from "@/pages/citizen/CitizenRegistration";
import CitizenServices from "@/pages/citizen/CitizenServices";
import CitizenApplications from "@/pages/citizen/CitizenApplications";
import CitizenPayments from "@/pages/citizen/CitizenPayments";
import CitizenProfile from "@/pages/citizen/CitizenProfile";
import CitizenProtectedRoute from "@/components/citizen-ProtectedRoute";
import { Toaster } from "sonner";

const CitizenApp = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Default route → Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth and Verification */}
        <Route path="/register" element={<CitizenRegistration />} />
        <Route path="/verify" element={<CitizenVerify />} />

        {/* Protected Layout Routes */}
        <Route
          path="/dashboard"
          element={
            <CitizenProtectedRoute>
              <CitizenLayout>
                <CitizenDashboard />
              </CitizenLayout>
            </CitizenProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <CitizenProtectedRoute requireVerified>
              <CitizenLayout>
                <CitizenServices />
              </CitizenLayout>
            </CitizenProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <CitizenProtectedRoute requireVerified>
              <CitizenLayout>
                <CitizenApplications />
              </CitizenLayout>
            </CitizenProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <CitizenProtectedRoute requireVerified>
              <CitizenLayout>
                <CitizenPayments />
              </CitizenLayout>
            </CitizenProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <CitizenProtectedRoute>
              <CitizenLayout>
                <CitizenProfile />
              </CitizenLayout>
            </CitizenProtectedRoute>
          }
        />

        {/* Catch-all 404 fallback */}
        <Route path="*" element={<h2 className="text-center mt-20 text-white">404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default CitizenApp;
