import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Wallet,
  RefreshCw,
  Plus,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Application = {
  id: string;
  user_id: string;
  service_name: string;
  amount: number; 
  payment_status: "paid" | "unpaid" | "failed";
  status: "pending" | "in_progress" | "approved" | "declined"; 
  created_at: string;
};

const PaymentServices: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [payments, setPayments] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // ✅ FIX: Fetch applications that are NOT paid (payment_status: 'unpaid')
    const { data, error } = await supabase
      .from("applications")
      .select("id, user_id, service_name, amount, payment_status, status, created_at")
      .eq("user_id", user.id)
      .eq("payment_status", "unpaid") // Filter for pending payments
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending payments:", error);
      toast.error("Failed to load pending payments.");
    } else {
      setPayments(data as Application[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);
  
  // ✅ FIX: Mock payment logic - updates payment_status and application status
  const handlePayNow = async (applicationId: string) => {
    setUpdatingId(applicationId);

    try {
      // Simulate external payment gateway success delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the application record: set payment_status to 'paid' and status to 'in_progress'
      const { error } = await supabase
        .from("applications")
        .update({ 
          payment_status: "paid", 
          status: "in_progress", 
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast.success("✅ Payment successful! Your application is now being processed.");
      
      // Remove the paid application from the local state list
      setPayments(prev => prev.filter(app => app.id !== applicationId));

    } catch (error: any) {
      console.error("Payment update failed:", error.message);
      toast.error("❌ Payment failed to update status. Please check your dashboard.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="link"
          className="text-muted-foreground mb-6 flex items-center gap-1 p-0"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <Card className="glass-card border-border/50 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" /> Pending Payments
            </h1>
            <Button variant="outline" size="sm" onClick={fetchApplications}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            The services listed below require payment before they can be processed by staff.
          </p>
          
          {loading ? (
            <p className="flex items-center gap-2 text-muted-foreground mb-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading pending payments...
            </p>
          ) : payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between items-center bg-white/60 border rounded-lg p-3 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{a.service_name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{a.id}</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={updatingId === a.id}
                    className={`
                      ${updatingId === a.id ? "bg-gray-400" : "bg-primary hover:bg-primary/90"} 
                      text-white flex items-center gap-1
                    `}
                    onClick={() => handlePayNow(a.id)}
                  >
                    {updatingId === a.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    {updatingId === a.id
                      ? "Processing..."
                      : `Pay ${a.amount.toLocaleString()} TSh`}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-6">
              You have no pending payments. Great job!
            </p>
          )}

          <Button
            className="mt-6 bg-gradient-to-r from-primary to-primary/80 text-white flex items-center gap-2"
            onClick={() => navigate("/services")}
          >
            <Plus className="w-4 h-4" /> Apply for New Service
          </Button>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-12">
          © {new Date().getFullYear()} Tanzania Local Government | Smart Digital
          Gateway
        </p>
      </div>
    </div>
  );
};


export default PaymentServices;
