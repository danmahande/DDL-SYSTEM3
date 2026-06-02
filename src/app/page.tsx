"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import LoginPage from "@/components/auth/LoginPage";
import AppContent from "@/components/layout/AppContent";

export default function Home() {
  const { user, isLoading, checkSession } = useAuth();
  
  useEffect(() => {
    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AppContent />;
}
