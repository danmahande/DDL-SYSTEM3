"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import LoginPage from "@/components/auth/LoginPage";
import RegisterPage from "@/components/auth/RegisterPage";
import AppContent from "@/components/layout/AppContent";

export default function Home() {
  const { user, isLoading, checkSession } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A]">
        <div className="animate-pulse text-2xl font-bold text-orange-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return isRegistering ? (
      <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  return <AppContent />;
}
