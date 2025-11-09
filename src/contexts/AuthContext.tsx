import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type ProfileType = {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  district?: string;
  ward?: string;
  is_verified?: boolean;
  must_change_password?: boolean;
};

type AuthContextType = {
  user: any;
  profile: ProfileType | null;
  role: string | null;
  loading: boolean;
  isVerified: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  isVerified: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧠 Refresh profile from Supabase
  const refreshProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ Failed to load profile:", error.message);
      return;
    }

    setProfile(data);
    setRole(data.role || null);
    setIsVerified(data.is_verified || false);

    // 🔁 Force change password if flagged
    if (data.must_change_password && window.location.pathname !== "/change-password") {
      window.location.href = "/change-password";
    }
  };

  // 🔐 On mount → load session
  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        await refreshProfile();
      }
      setLoading(false);
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) refreshProfile();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🧩 Citizen Sign Up with Auto-Profile
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Sign up failed", { description: error.message });
      return;
    }

    // Auto-create profile
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: email.split("@")[0],
        role: "Citizen",
        is_verified: false,
        must_change_password: false,
        created_at: new Date().toISOString(),
      });

      toast.success("Welcome!", { description: "Your account has been created." });

      // Auto login after sign up
      await supabase.auth.signInWithPassword({ email, password });
      window.location.href = "/dashboard";
    }
  };

  // 🔑 Sign In (Admin, Staff, Citizen)
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Login failed", { description: error.message });
      throw error;
    }

    await refreshProfile();
    toast.success("Welcome back!");

    // Redirect by role
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single();

    const userRole = data?.role;
    switch (userRole) {
      case "Admin":
        window.location.href = "/admin-dashboard";
        break;
      case "District":
        window.location.href = "/dashboard/district";
        break;
      case "Ward":
        window.location.href = "/dashboard/ward";
        break;
      case "Staff":
        window.location.href = "/dashboard/staff";
        break;
      default:
        window.location.href = "/dashboard";
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
    setIsVerified(false);
    toast.info("You have been signed out.");
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, isVerified, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
