import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SubmitApplication = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 glass-card">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">
          Submit Your Application
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Fill out your application details below and submit securely to your local authority.
        </p>

        <Button
          className="w-full bg-primary text-white hover:bg-primary/80"
          onClick={() => navigate("/dashboard")}
        >
          Go Back to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default SubmitApplication;
