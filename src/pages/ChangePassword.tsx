import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const ChangePassword = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("❌ Passwords do not match");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
      return;
    }

    // Mark password as changed
    await supabase
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", user.id);

    setLoading(false);
    setMessage("✅ Password changed successfully.");
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full shadow-lg bg-white/70 backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Change Your Password
        </h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          {profile?.fullName} ({profile?.email})
        </p>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </form>
        {message && (
          <p className="text-center text-sm mt-4 text-muted-foreground">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
};

export default ChangePassword;

