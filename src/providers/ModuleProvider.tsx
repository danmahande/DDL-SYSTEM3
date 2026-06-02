"use client";

import { createContext, useContext, useState } from "react";

interface ModuleContextType {
  currentModule: string;
  setCurrentModule: (module: string) => void;
}

const ModuleContext = createContext<ModuleContextType | null>(null);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [currentModule, setCurrentModule] = useState("dashboard");

  return (
    <ModuleContext.Provider value={{ currentModule, setCurrentModule }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const context = useContext(ModuleContext);
  if (!context) throw new Error("useModule must be used within ModuleProvider");
  return context;
}
