import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Check your email for the reset link!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Card className="p-8 w-full max-w-md shadow-lg glass-card">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleReset} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </Card>
    </div>
  );
};

export default ResetPassword;
