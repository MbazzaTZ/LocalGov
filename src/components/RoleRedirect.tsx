// src/components/RoleRedirect.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RoleRedirect: React.FC = () => {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    switch (role) {
      case "Admin":
        navigate("/admin-dashboard");
        break;
      case "District":
        navigate("/dashboard/district");
        break;
      case "Ward":
        navigate("/dashboard/ward");
        break;
      case "Staff":
      case "Village":
      case "Street":
        navigate("/dashboard/staff");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  }, [role, loading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      Redirecting to your dashboard...
    </div>
  );
};

export default RoleRedirect;
