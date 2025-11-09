import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2, Lock, User } from "lucide-react";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Login Error:", error.message);
        toast.error("Login failed", { description: error.message });
        return;
      }

      const user = data.user;
      if (!user) {
        toast.error("Login failed", { description: "No user found." });
        return;
      }

      // Step 2: Fetch user profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, email, full_name, role, district, ward, is_admin, is_district_staff, is_ward_staff, is_village_staff"
        )
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Admin Login Error:", profileError.message);
        toast.error("Profile load failed", { description: profileError.message });
        return;
      }

      console.log("✅ Login successful:", profile);

      // Step 3: Handle role-based redirection
      if (profile.is_admin || profile.role === "Admin") {
        toast.success("✅ Login successful! Redirecting to admin dashboard.");
        navigate("/admin");
      } else if (profile.is_district_staff || profile.role === "District") {
        toast.success("✅ District login successful!");
        navigate("/dashboard/district");
      } else if (profile.is_ward_staff || profile.role === "Ward") {
        toast.success("✅ Ward login successful!");
        navigate("/dashboard/ward");
      } else if (profile.is_village_staff || profile.role === "Staff") {
        toast.success("✅ Staff login successful!");
        navigate("/dashboard/staff");
      } else {
        toast.warning("Access Denied", {
          description: "This account is not authorized for admin access.",
        });
        navigate("/auth");
      }
    } catch (err: any) {
      console.error("⚠️ Unexpected Error:", err.message);
      toast.error("Something went wrong", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20 p-4">
      <div className="bg-white/90 shadow-lg rounded-2xl w-full max-w-md p-8 backdrop-blur-md">
        <div className="text-center mb-6">
          <img
            src="https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png"
            alt="Logo"
            className="mx-auto w-16 h-16 mb-3"
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            Local Government Portal
          </h1>
          <p className="text-gray-500">Admin & Staff Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white/50">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800"
                placeholder="admin@localgov.co.tz"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white/50">
              <Lock className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
