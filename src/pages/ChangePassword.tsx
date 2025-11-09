import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success("Password updated successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Failed to update password.", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 flex items-center justify-center px-4">
      <Card className="p-8 w-full max-w-md shadow-xl backdrop-blur-md bg-white/70">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          Change Your Password
        </h1>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button
            onClick={handleChangePassword}
            className="w-full flex items-center justify-center gap-2"
            disabled={loading || !password || !confirm}
          >
            {loading ? "Updating..." : <Check className="w-4 h-4" />}{" "}
            {loading ? "" : "Update Password"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Once changed, you’ll be redirected to your dashboard.
        </p>
      </Card>
    </div>
  );
};

export default ChangePassword;
