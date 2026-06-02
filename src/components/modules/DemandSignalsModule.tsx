"use client";

import { Radio, Clock, CheckCircle2, Package, Filter, Plus } from "lucide-react";

const signals = [
  {
    id: "SIG-0012",
    shopkeeper: "SK-****-3A7F",
    product: "Soda 500ml",
    category: "Beverages",
    packageSize: "Small",
    priceTier: "Mid-range",
    urgency: "Urgent",
    neighborhood: "Bugolobi Market",
    status: "Pending",
    time: "2h ago",
  },
  {
    id: "SIG-0011",
    shopkeeper: "SK-****-7B9E",
    product: "Sugar 1kg",
    category: "Groceries",
    packageSize: "Medium",
    priceTier: "Budget",
    urgency: "Normal",
    neighborhood: "Bugolobi Village",
    status: "Assigned",
    time: "3h ago",
  },
  {
    id: "SIG-0010",
    shopkeeper: "SK-****-2C5D",
    product: "Milk 1L",
    category: "Dairy",
    packageSize: "Small",
    priceTier: "Premium",
    urgency: "Low",
    neighborhood: "Kitintale",
    status: "In Transit",
    time: "4h ago",
  },
  {
    id: "SIG-0009",
    shopkeeper: "SK-****-9F4A",
    product: "Bread",
    category: "Bakery",
    packageSize: "Medium",
    priceTier: "Budget",
    urgency: "Normal",
    neighborhood: "Mbuya",
    status: "Delivered",
    time: "5h ago",
  },
];

const urgencyColors: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  Low: "bg-blue-100 text-blue-700",
};

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Transit": "bg-sky-100 text-sky-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function DemandSignalsModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-50 border border-orange-200/60 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">248</p>
              <p className="text-gray-600 text-sm">Total Signals</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-50 border border-amber-200/60 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">86</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-50 border border-green-200/60 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">162</p>
              <p className="text-gray-600 text-sm">Fulfilled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
          <option>All Categories</option>
          <option>Beverages</option>
          <option>Groceries</option>
          <option>Dairy</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
          <option>All Neighborhoods</option>
          <option>Bugolobi Market</option>
          <option>Bugolobi Village</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
          <option>All Urgency</option>
          <option>Urgent</option>
          <option>Normal</option>
          <option>Low</option>
        </select>
        <div className="ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" /> New Signal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1B2A4A] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Signal ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Shopkeeper</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pkg Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Urgency</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Neighborhood</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {signals.map((signal) => (
                <tr key={signal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{signal.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{signal.shopkeeper}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">{signal.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {signal.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{signal.packageSize}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{signal.priceTier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[signal.urgency]}`}>
                      {signal.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{signal.neighborhood}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[signal.status]}`}>
                      {signal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1 text-sm text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
