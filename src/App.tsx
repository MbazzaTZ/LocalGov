import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainApp from "@/apps/MainApp";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * 🌍 App.tsx
 * Retains gradient, glassy layout and transitions from your main theme.
 */
const App = () => {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 backdrop-blur-md text-foreground">
          {/* Global Notifications */}
          <Toaster />
          <Sonner />
          
          {/* Router */}
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<MainApp />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default App;
