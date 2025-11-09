import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient"; // ✅ fixed import path
import { toast } from "sonner";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to determine the correct dashboard path based on role
  const getDashboardPath = (profile: any) => {
    if (profile.is_admin) return "/admin-dashboard";
    if (profile.is_district_staff) return "/dashboard/district";
    if (profile.is_ward_staff) return "/dashboard/ward";
    if (profile.is_village_staff) return "/dashboard/staff";
    return null; // No staff/admin role found
  };

  // ✅ FIX: Use Supabase login and check for staff roles in the profiles table
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);

      const userId = authData.user?.id;
      if (!userId) throw new Error("Authentication succeeded but user ID is missing.");

      // 2. Check user's role in the 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          is_admin, 
          is_district_staff, 
          is_ward_staff, 
          is_village_staff
        `)
        .eq("id", userId)
        .single();

      if (profileError) throw new Error(profileError.message);
      if (!profileData) throw new Error("User profile not found after login.");

      const dashboardPath = getDashboardPath(profileData);

      if (dashboardPath) {
        toast.success(`✅ Login successful! Redirecting to ${dashboardPath.replace("/", "").replace("-", " ")}.`);
        navigate(dashboardPath, { replace: true });
      } else {
        // User is a citizen trying to log into the admin portal
        await supabase.auth.signOut(); // Log them out immediately
        toast.error("❌ Access Denied: You do not have staff privileges.");
      }
    } catch (error: any) {
      console.error("Admin Login Error:", error.message);
      toast.error(`❌ Login failed: Invalid credentials or insufficient privileges.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Card className="p-8 shadow-lg border-border/50 w-full max-w-md">
        <Button
          variant="link"
          className="text-muted-foreground mb-4 flex items-center gap-1 p-0"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-4">
            Staff / Admin Login
          </h2>
          <p className="text-muted-foreground text-sm">
            Restricted access for authorized staff only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Staff Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" className="w-full bg-primary text-white" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Button
          variant="link"
          className="mt-4 text-sm text-muted-foreground hover:text-primary"
          onClick={() => navigate("/auth")}
        >
          Are you a Citizen? Login here
        </Button>
      </Card>
    </div>
  );
};

export default AdminLogin;
