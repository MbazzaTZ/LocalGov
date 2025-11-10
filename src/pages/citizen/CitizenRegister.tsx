import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* ⚙️ Citizen Registration Page                                                */
/* -------------------------------------------------------------------------- */
const CitizenRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    nida: "",
    phone: "",
    address: "",
  });

  const [location, setLocation] = useState({
    region: "",
    district: "",
    ward: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🧩 HANDLE REGISTRATION                                                     */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.fullName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Sign up the user via Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error("User ID missing after signup.");

      // 2️⃣ Save citizen profile
      const { error: insertError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        nida: form.nida,
        address: form.address,
        role: "Citizen",
        region: location.region,
        district: location.district,
        ward: location.ward,
        is_verified: false,
        created_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      toast.success("✅ Registration Successful", {
        description: "Welcome to SmartGov! Please verify your account.",
      });

      navigate("/verify");
    } catch (err: any) {
      console.error("❌ Registration error:", err.message);
      toast.error("Registration failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧠 RENDER                                                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl p-8 glass-card shadow-2xl border border-border/50 backdrop-blur-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <ShieldCheck className="w-10 h-10 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-foreground">Citizen Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register to access local government e-services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🧾 Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border border-border p-2 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">NIDA Number</label>
              <input
                type="text"
                name="nida"
                value={form.nida}
                onChange={handleChange}
                placeholder="e.g. 19981234-5678-00001"
                className="w-full border border-border p-2 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 📞 Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-border p-2 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+255..."
                className="w-full border border-border p-2 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 🏠 Address */}
          <div>
            <label className="block text-sm mb-1 text-muted-foreground">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-border p-2 rounded-lg bg-background focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 🌍 Location Selector */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Location Details
            </label>
            <LocationSelector onChange={setLocation} />
          </div>

          {/* 🔐 Password */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-border p-2 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 🧭 Submit */}
          <div className="pt-4 flex flex-col items-center">
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 px-6 py-2"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Now"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Already registered?{" "}
              <span
                className="text-primary font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/auth")}
              >
                Log in
              </span>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CitizenRegister;
