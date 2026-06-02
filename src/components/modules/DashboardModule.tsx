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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const demandData = [
  { month: "Jan", signals: 120, deliveries: 95 },
  { month: "Feb", signals: 180, deliveries: 140 },
  { month: "Mar", signals: 150, deliveries: 120 },
  { month: "Apr", signals: 220, deliveries: 185 },
  { month: "May", signals: 280, deliveries: 230 },
  { month: "Jun", signals: 250, deliveries: 210 },
];

const inventoryData = [
  { name: "Healthy", value: 85, color: "#22C55E" },
  { name: "Low", value: 10, color: "#F59E0B" },
  { name: "Critical", value: 5, color: "#EF4444" },
];

const topProducts = [
  { name: "Soda 500ml", quantity: 245, category: "Beverages" },
  { name: "Sugar 1kg", quantity: 198, category: "Groceries" },
  { name: "Milk 1L", quantity: 175, category: "Dairy" },
  { name: "Bread", quantity: 156, category: "Bakery" },
  { name: "Cooking Oil 2L", quantity: 134, category: "Groceries" },
];

export default function DashboardModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select defaultValue="This Month" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-50 border border-orange-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-green-500 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">248</h3>
          <p className="text-gray-600 text-sm">Active Demand Signals</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-green-50 border border-emerald-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-green-500 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">12</h3>
          <p className="text-gray-600 text-sm">Neighborhoods Covered</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-sky-50 border border-blue-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-green-500 text-sm font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">92%</h3>
          <p className="text-gray-600 text-sm">Delivery Efficiency</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-violet-50 border border-purple-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-green-500 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">USh 24.5M</h3>
          <p className="text-gray-600 text-sm">Predicted Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-500">Merchants</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-[#1B2A4A]" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">USh 48.2K</p>
            <p className="text-xs text-gray-500">Avg Signal Value</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">5.5</p>
            <p className="text-xs text-gray-500">Signals/Merchant</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Demand Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandData}>
                <defs>
                  <linearGradient id="colorSignals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
                <Area
                  type="monotone"
                  dataKey="signals"
                  stroke="#FF6B35"
                  fillOpacity={1}
                  fill="url(#colorSignals)"
                />
              </AreaChart>
            </ResponsiveContainer>
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
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <span className="text-lg font-bold text-orange-500">{product.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Signals</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    i === 1 ? "bg-red-500" : i === 2 ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">SIG-00{i}2</p>
                    <p className="text-xs text-gray-500">Bugolobi Market • 2h ago</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
