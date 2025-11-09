import React from "react";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { toast } from "sonner";

const CitizenDashboard = () => {
  const { profile, signOut } = useCitizenAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      <div className="p-6 md:p-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-2">Welcome, {profile?.full_name || "Citizen"} 👋</h2>
          <p className="text-white/80 mb-6">
            You’re logged in with <span className="text-yellow-300">{profile?.email}</span>
          </p>

          <div className="space-x-3">
            <button
              onClick={() => (window.location.href = "/services")}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold"
            >
              Explore Services
            </button>
            <button
              onClick={() => toast.info("Coming Soon: Payment Portal")}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold"
            >
              Pay Bills
            </button>
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;

