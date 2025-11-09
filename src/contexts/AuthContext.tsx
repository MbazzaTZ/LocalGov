import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

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
  must_change_password?: boolean;
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

  // Hardcoded default credentials (admin + demo users)
  const demoAccounts = [
    { email: "admin@localgov.co.tz", password: "LocalGov@123", role: "Admin" },
    { email: "district@localgov.co.tz", password: "LocalGov@123", role: "District" },
    { email: "ward@localgov.co.tz", password: "LocalGov@123", role: "Ward" },
    { email: "staff@localgov.co.tz", password: "LocalGov@123", role: "Staff" },
  ];

  // ✅ Ensure all demo accounts exist in Supabase
  const ensureDemoAccountsExist = async () => {
    try {
      for (const acc of demoAccounts) {
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", acc.email)
          .single();

        if (error && error.code !== "PGRST116") console.warn(error.message);

        if (!data) {
          console.log(`🆕 Creating demo account: ${acc.email}`);

          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: acc.email,
            password: acc.password,
          });

          if (signupError && !signupError.message.includes("already")) {
            console.error("❌ Demo signup error:", signupError.message);
            continue;
          }

          const userId = signupData?.user?.id;
          if (!userId) continue;

          await supabase.from("profiles").upsert({
            id: userId,
            email: acc.email,
            full_name: acc.role + " User",
            role: acc.role,
            district: acc.role === "District" ? "Demo District" : "",
            ward: acc.role === "Ward" ? "Demo Ward" : "",
            must_change_password: true,
            created_at: new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      console.error("⚠️ Failed to seed demo accounts:", err.message);
    }
  };

  // ✅ Load Supabase session on mount
  useEffect(() => {
    const getSession = async () => {
      await ensureDemoAccountsExist();

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
        must_change_password: data.must_change_password || false,
      });
      setRole(data.role || null);
      setIsVerified(data.is_verified || false);

      // Redirect if must change password
      if (data.must_change_password && window.location.pathname !== "/change-password") {
        window.location.href = "/change-password";
      }
    } else if (error && error.code !== "PGRST116") {
      console.error("❌ Profile fetch error:", error.message);
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
      toast.error("Signup failed", { description: error.message });
      throw error;
    }

    // Immediately log in the user
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
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Sign-in error:", error.message);
      toast.error("Login failed", { description: error.message });
      throw error;
    }

    // If demo user has must_change_password flag
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileData?.must_change_password) {
      window.location.href = "/change-password";
    } else {
      toast.success("Welcome back!");
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
