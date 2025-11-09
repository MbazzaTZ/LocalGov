import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShieldAlert, UserCheck } from "lucide-react";

const Verify = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth(); 

  const [nida, setNida] = useState(profile?.nida || "");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(profile?.is_verified || false);

  // Redirect if already verified
  if (isVerified) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  // UPDATED: Logic to collect NIDA and update the profile in Supabase
  const handleVerifyProfile = async () => {
    if (!nida || nida.length < 10) {
      toast.error("Please enter a valid NIDA number or National ID (min 10 characters).");
      return;
    }

    if (!user) {
        toast.error("You must be logged in to verify.");
        navigate('/auth');
        return;
    }
    
    setLoading(true);

    try {
      // 1. Update the profile table with NIDA and set is_verified = true
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ nida: nida, is_verified: true, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // 2. Refresh the AuthContext to get the new profile data immediately
      await refreshProfile();
      
      toast.success("✅ Identity Verification Complete! You can now use all services.");
      setIsVerified(true); // Triggers the redirect to dashboard
      
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(`❌ Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <Card className="glass-card border-border/50 p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <UserCheck className="w-12 h-12 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-foreground">Identity Verification</h2>
          <p className="text-muted-foreground text-sm">
            Please enter your **National ID (NIDA)** number to verify your identity and access all services.
          </p>
        </div>
        
        <Input
          placeholder="Enter NIDA/National ID Number"
          value={nida}
          onChange={(e) => setNida(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleVerifyProfile}
          disabled={loading || isVerified}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify My Profile
            </>
          )}
        </Button>

        <div className="text-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center mx-auto"
          >
            <ShieldAlert className="w-4 h-4 mr-1" /> Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Verify;