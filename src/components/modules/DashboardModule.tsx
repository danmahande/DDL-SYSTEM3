"use client";

import {
  Radio,
  MapPin,
  Truck,
  DollarSign,
  Store,
  Package,
  BarChart3,
  Target,
  Activity,
  AlertCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DemandSignal {
  id: string;
  signalId: string;
  productLabel: string;
  productCategory: string;
  neighborhood: string;
  urgency: string;
  status: string;
  createdAt: string;
  source: string;
}

interface Stats {
  total: number;
  pending: number;
  active: number;
  delivered: number;
}

const inventoryColors = {
  Healthy: "#22C55E",
  Low: "#F59E0B",
  Critical: "#EF4444",
};

function getStockStatus(currentStock: number, minStock: number) {
  if (currentStock <= minStock * 0.3) return "Critical";
  if (currentStock <= minStock) return "Low";
  return "Healthy";
}

export default function DashboardModule() {
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, active: 0, delivered: 0 });
  const [inventoryData, setInventoryData] = useState([
    { name: "Healthy", value: 0, color: inventoryColors.Healthy },
    { name: "Low", value: 0, color: inventoryColors.Low },
    { name: "Critical", value: 0, color: inventoryColors.Critical },
  ]);
  const [merchantCount, setMerchantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [retailerConnected, setRetailerConnected] = useState(false);
  const [lastRetailerSignal, setLastRetailerSignal] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [signalsRes, productsRes, merchantsRes] = await Promise.all([
        fetch("/api/signals"),
        fetch("/api/products"),
        fetch("/api/merchants"),
      ]);

      const signalsData = await signalsRes.json();
      if (signalsData.success) {
        setSignals(signalsData.data);
        setStats(signalsData.stats);

        const retailerSignals = signalsData.data.filter(
          (s: DemandSignal) => s.source === "retailer_app"
        );
        if (retailerSignals.length > 0) {
          setRetailerConnected(true);
          setLastRetailerSignal(retailerSignals[0].createdAt);
        }
      }

      const productsData = await productsRes.json();
      if (productsData.success) {
        const counts = { Healthy: 0, Low: 0, Critical: 0 };
        productsData.data.forEach((product: { currentStock: number; minStock: number }) => {
          const status = getStockStatus(product.currentStock, product.minStock);
          counts[status as keyof typeof counts] += 1;
        });
        setInventoryData([
          { name: "Healthy", value: counts.Healthy, color: inventoryColors.Healthy },
          { name: "Low", value: counts.Low, color: inventoryColors.Low },
          { name: "Critical", value: counts.Critical, color: inventoryColors.Critical },
        ]);
      }

      const merchantsData = await merchantsRes.json();
      if (merchantsData.success) {
        setMerchantCount(merchantsData.stats?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getTopProducts = () => {
    const productCounts: Record<string, number> = {};
    signals.forEach((signal) => {
      productCounts[signal.productLabel] = (productCounts[signal.productLabel] || 0) + 1;
    });
    return Object.entries(productCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]"></div>
      </div>
    );
  }

  const topProducts = getTopProducts();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <select defaultValue="This Month" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${retailerConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-600">
              {retailerConnected ? "Retailer Connected" : "No Retailer Connection"}
            </span>
          </div>
          {lastRetailerSignal && (
            <span className="text-xs text-gray-500">
              Last signal: {new Date(lastRetailerSignal).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-50 border border-orange-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          <p className="text-gray-600 text-sm">Active Demand Signals</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-green-50 border border-emerald-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {new Set(signals.map((s) => s.neighborhood)).size}
          </h3>
          <p className="text-gray-600 text-sm">Neighborhoods Covered</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-sky-50 border border-blue-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
          </h3>
          <p className="text-gray-600 text-sm">Delivery Efficiency</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-violet-50 border border-purple-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">USh 0</h3>
          <p className="text-gray-600 text-sm">Predicted Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{merchantCount}</p>
            <p className="text-xs text-gray-500">Merchants</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-[#1B2A4A]" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{topProducts.length}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">USh 0</p>
            <p className="text-xs text-gray-500">Avg Signal Value</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {merchantCount > 0 ? (stats.total / merchantCount).toFixed(1) : 0}
            </p>
            <p className="text-xs text-gray-500">Signals/Merchant</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Demand Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No trend data available yet
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Health</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {inventoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Demanded Products</h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No products yet</div>
            ) : (
              topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </div>
                  <span className="text-lg font-bold text-orange-500">{product.quantity}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Signals</h3>
          <div className="space-y-3">
            {signals.slice(0, 5).map((signal, i) => (
              <div key={signal.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    signal.urgency === "urgent" ? "bg-red-500" : signal.urgency === "normal" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{signal.signalId}</p>
                    <p className="text-xs text-gray-500">
                      {signal.neighborhood} • {new Date(signal.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 capitalize">{signal.status}</span>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="text-center py-8 text-gray-500">No signals yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}