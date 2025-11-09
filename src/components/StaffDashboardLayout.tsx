import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
}

const StaffDashboardLayout: React.FC<Props> = ({ title, children, onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {onBack && (
          <Button onClick={onBack} className="bg-green-600 text-white">
            ← Back
          </Button>
        )}
      </div>
      <Card className="p-6 glass-card border-border/50">{children}</Card>
    </div>
  </div>
);

export default StaffDashboardLayout;
