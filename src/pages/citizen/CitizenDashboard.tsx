import React, { useEffect, useState } from "react";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldAlert, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/* 🧭 Citizen Dashboard                                                        */
/* -------------------------------------------------------------------------- */
const CitizenDashboard = () => {
  const { profile, user, signOut } = useCitizenAuth();
  const [loading, setLoading] = useState(false);
  const [liveProfile, setLiveProfile] = useState<any>(null);

  /* -------------------------------------------------------------------------- */
  /* 🔄 Fetch Live Profile Data                                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to load profile:", error.message);
        toast.error("Could not load your profile.");
      } else {
        setLiveProfile(data);
        localStorage.setItem("citizenProfile", JSON.stringify(data));
      }

      setLoading(false);
    };

    // Try cached data first
    const cached = localStorage.getItem("citizenProfile");
    if (cached) setLiveProfile(JSON.parse(cached));
    fetchProfile();
  }, [user]);

  const citizen = liveProfile || profile;

  /* -------------------------------------------------------------------------- */
  /* 🚨 Verification Notice                                                    */
  /* -------------------------------------------------------------------------- */
  const VerificationBanner = () => {
    if (!citizen) return null;

    if (!citizen.is_verified) {
      return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-yellow-800 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-yellow-600" />
            <p>
              Your NIDA or identity is <strong>not yet verified</strong>.{" "}
              <a
                href="/verify"
                className="text-blue-700 font-semibold underline hover:text-blue-900"
              >
                Click here to verify
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-green-100 border-l-4 border-green-500 p-4 text-green-800 rounded-lg mb-6 flex items-center space-x-2">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        <p>
          Identity verified. Welcome back,{" "}
          <span className="font-semibold">{citizen.full_name}</span> 🎉
        </p>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 🧩 Dashboard Content                                                      */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      <div className="p-6 md:p-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-center border border-white/20">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <Globe2 className="w-12 h-12 text-yellow-300 mb-3" />
            <h2 className="text-3xl font-semibold mb-1">
              Welcome, {citizen?.full_name || "Citizen"} 👋
            </h2>
            <p className="text-white/80">
              Logged in as{" "}
              <span className="text-yellow-300">{citizen?.email || "unknown"}</span>
            </p>
          </div>

          {/* Verification */}
          <VerificationBanner />

          {/* Profile Summary */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-yellow-300" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70">Region</p>
                <p className="text-lg font-semibold">{citizen?.region || "—"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70">District</p>
                <p className="text-lg font-semibold">{citizen?.district || "—"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70">Ward</p>
                <p className="text-lg font-semibold">{citizen?.ward || "—"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70">NIDA</p>
                <p className="text-lg font-semibold">
                  {citizen?.nida || "Not provided"}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => (window.location.href = "/services")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl"
            >
              Explore Services
            </Button>
            <Button
              onClick={() => (window.location.href = "/applications")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
            >
              My Applications
            </Button>
            <Button
              onClick={() => toast.info("Coming Soon: Payment Portal")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-xl"
            >
              Pay Bills
            </Button>
            <Button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
