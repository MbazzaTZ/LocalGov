import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { toast } from "sonner";
import { ShieldCheck, UserCheck } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* 🧩 Citizen Verification Page                                               */
/* -------------------------------------------------------------------------- */
const CitizenVerify = () => {
  const { profile, refreshProfile } = useCitizenAuth();

  const [form, setForm] = useState({
    nida: profile?.nida || "",
    tin: profile?.tin || "",
    passport: profile?.passport || "",
    voter: profile?.voter_id || "",
    driver: profile?.driver_license || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🧠 HANDLE VERIFICATION SUBMIT                                              */
  /* -------------------------------------------------------------------------- */
  const handleVerify = async () => {
    if (!profile?.id) {
      toast.error("You must be logged in to verify.");
      return;
    }

    if (
      !form.nida &&
      !form.tin &&
      !form.passport &&
      !form.voter &&
      !form.driver
    ) {
      toast.warning("Please provide at least one valid document number.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          nida: form.nida,
          tin: form.tin,
          passport: form.passport,
          voter_id: form.voter,
          driver_license: form.driver,
          is_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("✅ Verification submitted successfully", {
        description: "Your details have been verified successfully.",
      });

      await refreshProfile();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Verification failed:", err.message);
      toast.error("Verification failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧩 UI RENDER                                                              */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-white/20">
        <div className="flex flex-col items-center text-center mb-6">
          <ShieldCheck className="w-12 h-12 text-yellow-400 mb-3" />
          <h2 className="text-2xl font-bold">Citizen Identity Verification</h2>
          <p className="text-white/80 mt-2 max-w-md">
            Please provide one or more official identification numbers to verify
            your account and gain access to full e-government services.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-white/80 mb-1">NIDA Number</label>
            <input
              type="text"
              name="nida"
              value={form.nida}
              onChange={handleChange}
              placeholder="Enter NIDA Number"
              className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">TIN Number</label>
            <input
              type="text"
              name="tin"
              value={form.tin}
              onChange={handleChange}
              placeholder="Enter TIN Number"
              className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Passport Number</label>
            <input
              type="text"
              name="passport"
              value={form.passport}
              onChange={handleChange}
              placeholder="Enter Passport Number"
              className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Voter ID</label>
            <input
              type="text"
              name="voter"
              value={form.voter}
              onChange={handleChange}
              placeholder="Enter Voter ID Number"
              className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Driver’s License Number</label>
            <input
              type="text"
              name="driver"
              value={form.driver}
              onChange={handleChange}
              placeholder="Enter Driver’s License Number"
              className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            />
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-8 bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-semibold flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <UserCheck className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <UserCheck className="w-5 h-5" />
              Verify Now
            </>
          )}
        </button>

        <p className="text-sm text-white/70 text-center mt-4">
          Once verified, you’ll be redirected to your dashboard.
        </p>
      </div>
    </div>
  );
};

export default CitizenVerify;
