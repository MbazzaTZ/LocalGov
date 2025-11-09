import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CitizenApp from "@/apps/citizen-App";
import StaffApp from "@/apps/staff-App";
import AdminApp from "@/apps/admin-App";
import NotFound from "@/pages/NotFound";

const MainApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Citizen Portal */}
        <Route path="/*" element={<CitizenApp />} />

        {/* Staff Portal */}
        <Route path="/staff/*" element={<StaffApp />} />

        {/* Admin Portal */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainApp;
