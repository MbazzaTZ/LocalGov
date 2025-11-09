import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/admin-AuthContext";
import AdminProtectedRoute from "@/components/admin-ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SystemSettings from "@/pages/admin/SystemSettings";
import ManageUsers from "@/pages/admin/ManageUsers";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/**
 * 👑 AdminApp
 * Dedicated authentication & dashboard flow for Admin users.
 */
const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 text-foreground backdrop-blur-md transition-all duration-300">
        <Toaster />
        <Sonner />

        <Routes>
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/system-settings"
            element={
              <AdminProtectedRoute>
                <SystemSettings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <AdminProtectedRoute>
                <ManageUsers />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AdminAuthProvider>
  );
};

export default AdminApp;
