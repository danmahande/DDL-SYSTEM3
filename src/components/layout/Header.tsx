"use client";

import { Menu } from "lucide-react";
import { useModule } from "@/providers/ModuleProvider";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const moduleNames: Record<string, string> = {
  dashboard: "Dashboard",
  demand_map: "Demand Map",
  demand_signals: "Demand Signals",
  purchasing_power: "Purchasing Power",
  route_optimization: "Route Optimization",
  deliveries: "Deliveries",
  runsheets: "Runsheets",
  analytics: "Analytics",
  predictions: "Predictions",
  merchants: "Merchants",
  drivers: "Drivers",
  inventory: "Inventory",
  users: "Users",
  settings: "Settings",
};

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { currentModule } = useModule();

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-6">
      <button
        className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg"
        onClick={onMobileMenuToggle}
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>
      <h1 className="text-xl font-bold text-[#1B2A4A]">
        {moduleNames[currentModule] || "Dashboard"}
      </h1>
      <div className="ml-auto flex items-center gap-4">
        <span className="px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium">
          Supplier View
        </span>
      </div>
    </header>
  );
}
