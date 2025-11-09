import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

type ProfileType = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  nida?: string;
  address?: string;
  photoURL?: string;
  role?: string;
  district?: string;
  ward?: string;
  street?: string;
};

export type AuthContextType = {
  user: any;
  loading: boolean;
  isVerified: boolean;
  profile: ProfileType | null;
  role: string | null;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isVerified: false,
  profile: null,
  role: null,
  refreshProfile: async () => {},
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ✅ Load Supabase session on mount
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

  // ✅ Fetch user profile
  const refreshProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile({
        id: data.id,
        fullName: data.full_name || user.email,
        email: data.email || user.email,
        phone: data.phone || "",
        nida: data.nida || "",
        address: data.address || "",
        photoURL: data.photo_url || "",
        role: data.role || "Citizen",
        district: data.district || "",
        ward: data.ward || "",
        street: data.street || "",
      });
      setRole(data.role || null);
      setIsVerified(data.is_verified || false);
    }
  };

  useEffect(() => {
    if (user) refreshProfile();
  }, [user]);

  // ✅ Auto-verify signup (no email confirmation required)
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null,
      },
    });

    if (error) {
      console.error("❌ Signup error:", error.message);
      throw error;
    }

    // Immediately log in the user (bypass confirmation)
    if (data.user) {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) console.error("⚠️ Auto-login failed:", loginError.message);
    }
  };

  // ✅ Normal sign-in
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("❌ Sign-in error:", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsVerified(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isVerified,
        profile,
        role,
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
