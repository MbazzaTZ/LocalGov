import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type AdminProfile = {
  id?: string;
  full_name?: string;
  email?: string;
  role?: string;
  is_admin?: boolean;
  created_at?: string;
};

type AdminAuthContextType = {
  user: any;
  profile: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load Supabase session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ Fetch admin profile
  const refreshProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .eq("role", "Admin")
      .single();

    if (error) {
      console.error("❌ Admin profile fetch failed:", error.message);
      toast.error("Failed to load profile");
      return;
    }

    if (!data?.is_admin) {
      toast.error("Unauthorized Access", { description: "Not an admin user" });
      await supabase.auth.signOut();
      window.location.href = "/admin-login";
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    if (user) refreshProfile();
  }, [user]);

  // ✅ Login
  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Admin login error:", error.message);
      toast.error("Login failed", { description: error.message });
      throw error;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (!profileData?.is_admin) {
      toast.error("Access Denied", { description: "Not an admin account" });
      await supabase.auth.signOut();
      return;
    }

    setProfile(profileData);
    toast.success("✅ Login successful! Redirecting to admin dashboard...");
    window.location.href = "/admin-dashboard";
  };

  // ✅ Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    toast.info("You have been logged out");
    window.location.href = "/admin-login";
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, profile, loading, signIn, signOut, refreshProfile }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
