import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Password updated successfully!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Card className="p-8 w-full max-w-md shadow-lg glass-card">
        <h1 className="text-xl font-bold mb-4">Set New Password</h1>
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleUpdate} disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Password"}
        </Button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </Card>
    </div>
  );
};

export default UpdatePassword;
