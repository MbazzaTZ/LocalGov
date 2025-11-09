import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRedirect from "@/components/RoleRedirect";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import useAuditSync from "@/hooks/useAuditSync"; // ✅ fixed import
import { formatDistanceToNow } from "date-fns";

/* -------------------------------------------------------------------------- */
/* ✅ Public Pages */
/* -------------------------------------------------------------------------- */
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Verify from "./pages/Verify";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import InfoCenter from "./pages/InfoCenter";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
/* -------------------------------------------------------------------------- */
/* ✅ User / Service Pages */
/* -------------------------------------------------------------------------- */
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyApplications from "./pages/MyApplications";

import ResidentCertificate from "./pages/services/ResidentCertificate";
import IntroductionLetter from "./pages/services/IntroductionLetter";
import BusinessPermit from "./pages/services/BusinessPermit";
import ConstructionPermit from "./pages/services/ConstructionPermit";
import EventPermit from "./pages/services/EventPermit";
import BurialPermit from "./pages/services/BurialPermit";
import OpenCase from "./pages/services/OpenCase";
import PaymentServices from "./pages/PaymentServices";

/* -------------------------------------------------------------------------- */
/* ✅ Admin & Staff Dashboards */
/* -------------------------------------------------------------------------- */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";
import WardDashboard from "./pages/WardDashboard";
import StaffDashboard from "./pages/StaffDashboard";

/* -------------------------------------------------------------------------- */
/* ✅ Initialize Query Client */
/* -------------------------------------------------------------------------- */
const queryClient = new QueryClient();

/* -------------------------------------------------------------------------- */
/* ✅ RoleProtectedRoute — Enforces Role-Based Access Control */
/* -------------------------------------------------------------------------- */
const RoleProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: JSX.Element;
}) => {
  const { role, loading } = useAuth();

  if (loading)
    return (
      <div className="text-center mt-20 text-muted-foreground">
        Checking permissions...
      </div>
    );

  if (!allowedRoles.includes(role || "")) {
    toast.warning("Access Denied", {
      description: "You are not authorized to access this page.",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* -------------------------------------------------------------------------- */
/* ✅ Dashboard Wrapper with Live Audit Indicator */
/* -------------------------------------------------------------------------- */
const DashboardWithAudit = ({ children }: { children: JSX.Element }) => {
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  useAuditSync(setAuditLogs);
  const latestAudit = auditLogs?.[0];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 backdrop-blur-md">
      {latestAudit && (
        <div className="flex items-center gap-2 p-3 bg-white/10 border-b border-border/40 text-sm text-muted-foreground backdrop-blur-md sticky top-0 z-50 shadow-sm rounded-b-lg">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-foreground/90">
            <span className="font-medium text-foreground">Last Action:</span>{" "}
            {latestAudit.action} by{" "}
            <span className="text-primary font-medium">
              {latestAudit.role || "Admin"}
            </span>{" "}
            •{" "}
            {formatDistanceToNow(
              new Date(latestAudit.created_at || latestAudit.timestamp),
              { addSuffix: true }
            )}
          </p>
        </div>
      )}
      <div className="p-4 md:p-8">{children}</div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ✅ Main Application Component */
/* -------------------------------------------------------------------------- */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/info" element={<InfoCenter />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />        
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            {/* 👤 User Routes (Protected) */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <ProtectedRoute>
                  <Verify />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 🎯 Role-Based Dashboards */}
            <Route
              path="/dashboard/district"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={["District", "Admin"]}>
                    <DashboardWithAudit>
                      <DistrictDashboard />
                    </DashboardWithAudit>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/ward"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={["Ward", "Admin"]}>
                    <DashboardWithAudit>
                      <WardDashboard />
                    </DashboardWithAudit>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/staff"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={["Staff", "Village", "Street", "Admin"]}
                  >
                    <DashboardWithAudit>
                      <StaffDashboard />
                    </DashboardWithAudit>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* 👑 Admin Dashboard & Login */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={["Admin"]}>
                    <DashboardWithAudit>
                      <AdminDashboard />
                    </DashboardWithAudit>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={["Admin"]}>
                    <DashboardWithAudit>
                      <AdminDashboard />
                    </DashboardWithAudit>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* 🧾 Verified Services */}
            <Route
              path="/services/resident-certificate"
              element={
                <ProtectedRoute requireVerification>
                  <ResidentCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/introduction-letter"
              element={
                <ProtectedRoute requireVerification>
                  <IntroductionLetter />
                </ProtectedRoute>
              }
            />

            {/* 💼 General Services */}
            <Route
              path="/services/business-permit"
              element={
                <ProtectedRoute>
                  <BusinessPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/construction-permit"
              element={
                <ProtectedRoute>
                  <ConstructionPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/event-permit"
              element={
                <ProtectedRoute>
                  <EventPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/burial-permit"
              element={
                <ProtectedRoute>
                  <BurialPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/open-case"
              element={
                <ProtectedRoute>
                  <OpenCase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/payments"
              element={
                <ProtectedRoute>
                  <PaymentServices />
                </ProtectedRoute>
              }
            />

            {/* 🚫 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
