import React from "react";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { toast } from "sonner";

const CitizenVerify = () => {
  const { profile, refreshProfile } = useCitizenAuth();

  const handleVerify = async () => {
    // Temporary simulation
    toast.success("Verification submitted", {
      description: "Your NIDA verification will be reviewed shortly.",
    });
    await refreshProfile();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Citizen Verification</h2>
        <p className="text-white/80 mb-6">
          Please verify your identity using your NIDA number or phone number to access
          full services.
        </p>

        <input
          type="text"
          placeholder="Enter NIDA Number"
          className="w-full mb-4 p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-semibold"
        >
          Verify Now
        </button>
      </div>
    </div>
  );
};

export default CitizenVerify;

