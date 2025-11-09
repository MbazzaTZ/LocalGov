import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, supabaseAdmin, ensureDemoAccounts } from "@/lib/supabaseClient";
import { toast } from "sonner";

type ProfileType = {
  id?: string;
  email?: string;
  full_name?: string;
  role?: string;
  district?: string;
  ward?: string;
  phone?: string;
  nida?: string;
  address?: string;
  photo_url?: string;
  is_verified?: boolean;
  must_change_password?: boolean;
};

export type AuthContextType = {
  user: any;
  loading: boolean;
  profile: ProfileType | null;
  role: string | null;
  isVerified: boolean;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profile: null,
  role: null,
  isVerified: false,
  refreshProfile: async () => {},
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* 🔹 INITIALIZATION + DEMO ACCOUNTS (only in dev) */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const init = async () => {
      try {
        if (import.meta.env.DEV) {
          await ensureDemoAccounts(); // auto-seed demo roles locally
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err: any) {
        console.error("⚠️ Auth init error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🔹 FETCH / REFRESH PROFILE */
  /* -------------------------------------------------------------------------- */
  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setRole(data.role || "Citizen");
        setIsVerified(data.is_verified || false);

        // Force password change if required
        if (data.must_change_password && window.location.pathname !== "/change-password") {
          window.location.href = "/change-password";
        }
      }
    } catch (err: any) {
      console.warn("⚠️ Profile load error:", err.message);
    }
  };

  useEffect(() => {
    if (user) refreshProfile();
  }, [user]);

  /* -------------------------------------------------------------------------- */
  /* 🔹 SIGN UP (Citizen Users) */
  /* -------------------------------------------------------------------------- */
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const userId = data?.user?.id;
      if (!userId) return;

      // Create a profile record
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        email,
        full_name: email.split("@")[0],
        role: "Citizen",
        is_verified: false,
        must_change_password: false,
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      toast.success("🎉 Registration successful! Welcome to LocalGov.");
    } catch (err: any) {
      console.error("❌ Signup error:", err.message);
      toast.error("Signup failed", { description: err.message });
      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔹 SIGN IN (All Users) */
  /* -------------------------------------------------------------------------- */
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileErr) throw profileErr;

      setProfile(profileData);
      setRole(profileData.role);
      setIsVerified(profileData.is_verified || false);

      // Redirect if required
      if (profileData.must_change_password) {
        window.location.href = "/change-password";
      } else if (profileData.role === "Admin") {
        window.location.href = "/admin-dashboard";
      } else if (profileData.role === "District") {
        window.location.href = "/dashboard/district";
      } else if (profileData.role === "Ward") {
        window.location.href = "/dashboard/ward";
      } else if (profileData.role === "Staff") {
        window.location.href = "/dashboard/staff";
      } else {
        window.location.href = "/dashboard";
      }

      toast.success(`👋 Welcome back, ${profileData.full_name || "User"}!`);
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      toast.error("Login failed", { description: err.message });
      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔹 SIGN OUT */
  /* -------------------------------------------------------------------------- */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRole(null);
      setIsVerified(false);
      toast.info("You have been logged out.");
    } catch (err: any) {
      console.error("❌ Sign-out error:", err.message);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔹 PROVIDER VALUE */
  /* -------------------------------------------------------------------------- */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        role,
        isVerified,
        refreshProfile,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
