import React from "react";
import { Routes, Route } from "react-router-dom";
import { CitizenAuthProvider } from "@/contexts/citizen-AuthContext";
import CitizenProtectedRoute from "@/components/citizen-ProtectedRoute";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import CitizenServices from "@/pages/citizen/CitizenServices";
import CitizenVerify from "@/pages/citizen/CitizenVerify";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/**
 * 🧍 CitizenApp
 * Themed for citizens — includes login/session context & verification flow.
 */
const CitizenApp = () => {
  return (
    <CitizenAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 text-foreground backdrop-blur-md transition-all duration-300">
        <Toaster />
        <Sonner />

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
          <Route
            path="/profile"
            element={
              <CitizenProtectedRoute>
                <Profile />
              </CitizenProtectedRoute>
            }
          />
          <Route path="/verify" element={<CitizenVerify />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CitizenAuthProvider>
  );
};

export default CitizenApp;
