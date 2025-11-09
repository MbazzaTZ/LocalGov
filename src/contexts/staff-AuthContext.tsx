import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type StaffProfile = {
  id?: string;
  full_name?: string;
  email?: string;
  role?: string;
  district?: string;
  ward?: string;
  is_verified?: boolean;
};

type StaffAuthContextType = {
  user: any;
  profile: StaffProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const StaffAuthContext = createContext<StaffAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const StaffAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const refreshProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) setProfile(data);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error("Login failed", { description: error.message });
      throw error;
    }
    toast.success("Welcome Staff Member");
    window.location.href = "/dashboard";
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    window.location.href = "/auth";
  };

  return (
    <StaffAuthContext.Provider
      value={{ user, profile, loading, signIn, signOut, refreshProfile }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
};

export const useStaffAuth = () => useContext(StaffAuthContext);

