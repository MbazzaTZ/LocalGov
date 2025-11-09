import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/admin-AuthContext";
import AdminProtectedRoute from "@/components/admin-ProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageUsers from "@/pages/admin/ManageUsers";
import SystemSettings from "@/pages/admin/SystemSettings";

const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminProtectedRoute>
              <SystemSettings />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminApp;
