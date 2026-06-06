"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ModuleProvider, useModule } from "@/providers/ModuleProvider";
import { SignalProvider } from "@/providers/SignalProvider";
import { NewSignalPopup } from "@/components/modules/NewSignalPopup";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardModule from "@/components/modules/DashboardModule";
import DemandMapModule from "@/components/modules/DemandMapModule";
import DemandSignalsModule from "@/components/modules/DemandSignalsModule";
import PurchasingPowerModule from "@/components/modules/PurchasingPowerModule";
import RouteOptimizationModule from "@/components/modules/RouteOptimizationModule";
import DeliveriesModule from "@/components/modules/DeliveriesModule";
import RunsheetsModule from "@/components/modules/RunsheetsModule";
import AnalyticsModule from "@/components/modules/AnalyticsModule";
import PredictionsModule from "@/components/modules/PredictionsModule";
import MerchantsModule from "@/components/modules/MerchantsModule";
import DriversModule from "@/components/modules/DriversModule";
import InventoryModule from "@/components/modules/InventoryModule";
import UsersModule from "@/components/modules/UsersModule";
import SettingsModule from "@/components/modules/SettingsModule";

function ModuleRenderer() {
  const { currentModule } = useModule();

  const modules: Record<string, React.ComponentType> = {
    dashboard: DashboardModule,
    demand_map: DemandMapModule,
    demand_signals: DemandSignalsModule,
    purchasing_power: PurchasingPowerModule,
    route_optimization: RouteOptimizationModule,
    deliveries: DeliveriesModule,
    runsheets: RunsheetsModule,
    analytics: AnalyticsModule,
    predictions: PredictionsModule,
    merchants: MerchantsModule,
    drivers: DriversModule,
    inventory: InventoryModule,
    users: UsersModule,
    settings: SettingsModule,
  };

  const ModuleComponent = modules[currentModule] || DashboardModule;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentModule}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-auto"
      >
        <ModuleComponent />
      </motion.div>
    </AnimatePresence>
  );
}

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <ModuleRenderer />
      </div>
      <NewSignalPopup />
    </div>
  );
}

export default function AppContent() {
  return (
    <SignalProvider>
      <ModuleProvider>
        <AppLayout />
      </ModuleProvider>
    </SignalProvider>
  );
}
