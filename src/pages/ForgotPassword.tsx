import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      });

      if (error) throw error;
      toast.success("Reset email sent!", {
        description: "Please check your inbox to reset your password.",
      });
      navigate("/auth");
    } catch (err: any) {
      toast.error("Failed to send reset email.", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center px-4">
      <Card className="p-8 w-full max-w-md shadow-xl backdrop-blur-md bg-white/70">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          Forgot Password
        </h1>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={handlePasswordReset}
            className="w-full flex items-center justify-center gap-2"
            disabled={loading || !email}
          >
            <Mail className="w-4 h-4" />
            {loading ? "Sending..." : "Send Reset Email"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered your password?{" "}
          <span
            className="text-primary font-semibold cursor-pointer"
            onClick={() => navigate("/auth")}
          >
            Back to Login
          </span>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
