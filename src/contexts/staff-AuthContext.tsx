import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* 🧩 TYPES                                                                    */
/* -------------------------------------------------------------------------- */
type StaffProfile = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  district?: string;
  ward?: string;
  role?: string;
  is_verified?: boolean;
  is_admin?: boolean;
  created_at?: string;
};

type StaffAuthContextType = {
  user: any;
  profile: StaffProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

/* -------------------------------------------------------------------------- */
/* 🧠 CONTEXT INITIALIZATION                                                   */
/* -------------------------------------------------------------------------- */
const StaffAuthContext = createContext<StaffAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

/* -------------------------------------------------------------------------- */
/* ⚙️ PROVIDER COMPONENT                                                      */
/* -------------------------------------------------------------------------- */
export const StaffAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------------------- */
  /* ✅ LOAD SESSION ON STARTUP                                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.warn("⚠️ Session load error:", error.message);

      if (data.session) {
        setUser(data.session.user);
        await fetchProfile(data.session.user.id);
      } else {
        const cached = localStorage.getItem("staffProfileCache");
        if (cached) setProfile(JSON.parse(cached));
      }

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 📦 FETCH STAFF PROFILE FROM SUPABASE                                       */
  /* -------------------------------------------------------------------------- */
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) {
      console.error("❌ Profile fetch error:", error.message);
      return;
    }

    if (data) {
      setProfile(data);
      localStorage.setItem("staffProfileCache", JSON.stringify(data));
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔄 MANUAL REFRESH                                                         */
  /* -------------------------------------------------------------------------- */
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  /* -------------------------------------------------------------------------- */
  /* 🔐 SIGN IN                                                                */
  /* -------------------------------------------------------------------------- */
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login failed", { description: error.message });
      setLoading(false);
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
      toast.success("✅ Login successful");
    }
    setLoading(false);
  };

  /* -------------------------------------------------------------------------- */
  /* 🚪 SIGN OUT                                                               */
  /* -------------------------------------------------------------------------- */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem("staffProfileCache");
    toast.success("Logged out successfully");
  };

  /* -------------------------------------------------------------------------- */
  /* 🌐 ONLINE/OFFLINE PROFILE SYNC                                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const handleOnline = async () => {
      if (user) {
        toast("🔄 Syncing your data...");
        await refreshProfile();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [user]);

  /* -------------------------------------------------------------------------- */
  /* 🧩 CONTEXT VALUE                                                          */
  /* -------------------------------------------------------------------------- */
  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    refreshProfile,
  };

  return (
    <StaffAuthContext.Provider value={value}>
      {!loading && children}
    </StaffAuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/* 🪄 CUSTOM HOOK                                                             */
/* -------------------------------------------------------------------------- */
export const useStaffAuth = () => useContext(StaffAuthContext);
