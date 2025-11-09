import React from "react";
import { toast } from "sonner";

const StaffReports = () => {
  const generateReport = () => {
    toast.success("Report generated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-700 to-cyan-600 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>
        <p className="text-white/80 mb-6">
          Download summary reports of applications handled in your ward or district.
        </p>

        <button
          onClick={generateReport}
          className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-xl font-semibold text-lg"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default StaffReports;
