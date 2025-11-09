import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ Password reset link sent to your email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full shadow-lg bg-white/70 backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {message && (
          <p className="text-center text-sm mt-4 text-muted-foreground">
            {message}
          </p>
        )}
        <Button
          variant="link"
          className="w-full mt-4 text-sm flex items-center justify-center"
          onClick={() => navigate("/auth")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Button>
      </Card>
    </div>
  );
};

export default ForgotPassword;
