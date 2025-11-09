
import React from "react";
import { Routes, Route } from "react-router-dom";
import CitizenProtectedRoute from "@/components/citizen-ProtectedRoute";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import CitizenServices from "@/pages/citizen/CitizenServices";
import CitizenVerify from "@/pages/citizen/CitizenVerify";
import NotFound from "@/pages/NotFound";

const CitizenApp = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <CitizenProtectedRoute requireVerification>
            <CitizenDashboard />
          </CitizenProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <CitizenProtectedRoute requireVerification>
            <CitizenServices />
          </CitizenProtectedRoute>
        }
      />
      <Route path="/verify" element={<CitizenVerify />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CitizenApp;
