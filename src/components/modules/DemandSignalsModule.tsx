"use client";

import { Radio, Clock, CheckCircle2, Package, Filter, Plus, MapPin, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface DemandSignal {
  id: string;
  signalId: string;
  shopkeeperId: string;
  businessName: string;
  neighborhood: string;
  productCategory: string;
  productLabel: string;
  productId: string;
  packageSize: string;
  priceTier: string;
  quantity: number;
  urgency: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  source: string;
  notes: string | null;
  isSynced: boolean;
  syncedAt: string | null;
  privacyApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  pending: number;
  active: number;
  delivered: number;
}

const urgencyColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  normal: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  in_transit: "bg-sky-100 text-sky-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const sourceColors: Record<string, string> = {
  retailer_app: "bg-orange-100 text-orange-700",
  field_agent: "bg-purple-100 text-purple-700",
  manual: "bg-gray-100 text-gray-700",
};

export default function DemandSignalsModule() {
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, active: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    neighborhood: "",
    urgency: "",
  });

  const fetchSignals = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.neighborhood) params.append("neighborhood", filters.neighborhood);
      if (filters.urgency) params.append("urgency", filters.urgency);

      const res = await fetch(`/api/signals?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSignals(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (id: string) => {
    try {
      const res = await fetch(`/api/signals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "assigned" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSignals();
      }
    } catch (error) {
      console.error("Error assigning signal:", error);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [filters]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-50 border border-orange-200/60 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              <p className="text-gray-600 text-sm">Fulfilled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Beverages">Beverages</option>
          <option value="Groceries">Groceries</option>
          <option value="Dairy">Dairy</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
          value={filters.neighborhood}
          onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
        >
          <option value="">All Neighborhoods</option>
          <option value="Bugolobi Market">Bugolobi Market</option>
          <option value="Bugolobi Village">Bugolobi Village</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
          value={filters.urgency}
          onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
        >
          <option value="">All Urgency</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <div className="ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" /> New Signal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {signals.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Signals Yet</h3>
            <p className="text-gray-500">Connect retailer apps to start receiving demand signals</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1B2A4A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Signal ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Business</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Pkg Size</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Urgency</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {signals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{signal.signalId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{signal.businessName || signal.shopkeeperId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-900">{signal.productLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {signal.productCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{signal.packageSize}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceColors[signal.source]}`}>
                        {signal.source === "retailer_app" ? "Retailer App" : signal.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[signal.urgency]}`}>
                        {signal.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {signal.latitude && signal.longitude ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{signal.latitude.toFixed(4)}, {signal.longitude.toFixed(4)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No location</span>
                      )}
                    </td>
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
                        {signal.status === "pending" && (
                          <button
                            onClick={() => handleAssign(signal.id)}
                            className="px-3 py-1 text-sm text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}