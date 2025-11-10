import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CitizenAuthProvider } from "@/contexts/citizen-AuthContext";
import CitizenProtectedRoute from "@/components/citizen-ProtectedRoute";
import CitizenDashboard from "@/pages/CitizenDashboard";
import CitizenVerify from "@/pages/CitizenVerify";
import CitizenRegister from "@/pages/CitizenRegister";
import Auth from "@/pages/Auth";
import Services from "@/pages/Services";
import MyApplications from "@/pages/MyApplications";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* ⚙️ Query Client Setup                                                      */
/* -------------------------------------------------------------------------- */
const queryClient = new QueryClient();

/* -------------------------------------------------------------------------- */
/* 🧭 Citizen App Main                                                        */
/* -------------------------------------------------------------------------- */
const CitizenApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CitizenAuthProvider>
            <Routes>
              {/* 🔓 Public Routes */}
              <Route path="/" element={<Navigate to="/auth" />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/citizen-register" element={<CitizenRegister />} />

              {/* 🔐 Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <CitizenProtectedRoute>
                    <CitizenDashboard />
                  </CitizenProtectedRoute>
                }
              />
              <Route
                path="/verify"
                element={
                  <CitizenProtectedRoute>
                    <CitizenVerify />
                  </CitizenProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <CitizenProtectedRoute>
                    <Services />
                  </CitizenProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <CitizenProtectedRoute>
                    <MyApplications />
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

              {/* 🚫 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CitizenAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default CitizenApp;
