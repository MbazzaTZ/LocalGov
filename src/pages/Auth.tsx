import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, ShieldCheck, ArrowLeft } from "lucide-react";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleAuth = async () => {
    try {
      setLoading(true);

      if (!email || !password) {
        toast.warning("Please fill in all fields.");
        return;
      }

      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { is_verified: true },
          },
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      const { error, data } = result;
      if (error) throw error;

      if (data?.user) {
        toast.success("Welcome! You’re logged in 🎉");
        navigate("/dashboard");
      } else {
        toast.success("Check your email to confirm your account.");
      }
    } catch (err: any) {
      toast.error("Authentication failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md shadow-2xl backdrop-blur-md bg-white/70">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary w-6 h-6" />
            <h1 className="text-xl font-bold text-foreground">LocalGov Portal</h1>
          </div>
        </div>

        {/* Auth Form */}
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleAuth}
            disabled={loading}
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => setMode("signup")}
                  className="text-primary cursor-pointer hover:underline"
                >
                  Create one
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-primary cursor-pointer hover:underline"
                >
                  Log in
                </span>
              </>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-2">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-primary cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
