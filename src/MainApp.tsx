
import React from "react";
import { useAdminAuth } from "@/contexts/admin-AuthContext";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import AdminApp from "@/apps/admin-App";
import CitizenApp from "@/apps/citizen-App";
import StaffApp from "@/apps/staff-App";

const MainApp = () => {
  const { user: adminUser, role: adminRole } = useAdminAuth();
  const { user: citizenUser } = useCitizenAuth();

  if (adminUser && adminRole === "Admin") return <AdminApp />;
  if (citizenUser) return <CitizenApp />;
  // add logic for staff here

  return <CitizenApp />; // default (visitor mode)
};

export default MainApp;
