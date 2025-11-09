import React, { useState } from "react";
import { toast } from "sonner";

const SystemSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    toast.success("System settings updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">System Settings</h2>

        <div className="flex items-center justify-between bg-white/10 rounded-xl p-4 mb-6">
          <span>Maintenance Mode</span>
          <input
            type="checkbox"
            checked={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.target.checked)}
            className="w-5 h-5 accent-green-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold text-lg"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;

