import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export type CitizenProfile = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  nida?: string;
  address?: string;
  is_verified?: boolean;
  created_at?: string;
};

export type CitizenAuthContextType = {
  user: any;
  profile: CitizenProfile | null;
  loading: boolean;
  isVerified: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const CitizenAuthContext = createContext<CitizenAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isVerified: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const CitizenAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Load session
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch user profile
  const refreshProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile(data);
      setIsVerified(data.is_verified || false);
    }
  };

  useEffect(() => {
    if (user) refreshProfile();
  }, [user]);

  // Citizen Signup
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: null },
    });

    if (error) {
      toast.error("Signup failed", { description: error.message });
      throw error;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: "New Citizen",
        role: "Citizen",
        is_verified: false,
      });
      toast.success("Welcome!", { description: "Account created successfully" });
    }
  };

  // Citizen Signin
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error("Login failed", { description: error.message });
      throw error;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("email", email)
      .single();

    if (profileData?.is_verified) {
      toast.success("Welcome back!");
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/verify";
    }
  };

  // Citizen Signout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsVerified(false);
    toast.success("Logged out successfully");
    window.location.href = "/auth";
  };

  return (
    <CitizenAuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isVerified,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </CitizenAuthContext.Provider>
  );
};

export const useCitizenAuth = () => useContext(CitizenAuthContext);
