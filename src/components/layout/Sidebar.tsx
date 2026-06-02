"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Radio,
  TrendingUp,
  Route,
  Truck,
  ClipboardList,
  BarChart3,
  Brain,
  Store,
  Package,
  UserCog,
  Settings,
  Package as PackageIcon,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useModule } from "@/providers/ModuleProvider";

const modules = [
  { section: "OVERVIEW", items: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "demand_map", label: "Demand Map", icon: Map },
  ]},
  { section: "DEMAND", items: [
    { key: "demand_signals", label: "Demand Signals", icon: Radio },
    { key: "purchasing_power", label: "Purchasing Power", icon: TrendingUp },
  ]},
  { section: "LOGISTICS", items: [
    { key: "route_optimization", label: "Route Optimization", icon: Route },
    { key: "deliveries", label: "Deliveries", icon: Truck },
    { key: "runsheets", label: "Runsheets", icon: ClipboardList },
  ]},
  { section: "INTELLIGENCE", items: [
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "predictions", label: "Predictions", icon: Brain },
  ]},
  { section: "MANAGEMENT", items: [
    { key: "merchants", label: "Merchants", icon: Store },
    { key: "drivers", label: "Drivers", icon: Truck },
    { key: "inventory", label: "Inventory", icon: Package },
    { key: "users", label: "Users", icon: UserCog },
  ]},
  { section: "SYSTEM", items: [
    { key: "settings", label: "Settings", icon: Settings },
  ]},
];

const COLORS = ['#FF6B35', '#1B2A4A', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'];

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { currentModule, setCurrentModule } = useModule();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : (isMobileOpen ? 0 : -288) }}
        className="fixed inset-y-0 left-0 z-50 w-72 lg:w-[264px] lg:static bg-gradient-to-b from-[#1B2A4A] to-[#0F1A2E] border-r border-[rgba(255,255,255,0.1)]"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">DDL Platform</h2>
              <p className="text-blue-200/60 text-xs">Demand → Logistics</p>
            </div>
            <button
              className="lg:hidden ml-auto text-blue-200/60 hover:text-white"
              onClick={onMobileClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-6">
            {modules.map((group) => (
              <div key={group.section}>
                <p className="text-[10px] uppercase text-blue-200/40 tracking-wider mb-2 px-2">
                  {group.section}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentModule === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setCurrentModule(item.key);
                          onMobileClose();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/25"
                            : "text-blue-200/70 hover:bg-white/8"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: COLORS[0] }}
              >
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.name}</p>
                <span className="inline-block px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-200/60 hover:text-white hover:bg-white/8 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
