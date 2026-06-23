"use client";

import { useEffect, useState } from "react";
import { MapPin, TrendingUp, Minus, TrendingDown, Target } from "lucide-react";

interface NeighborhoodRecord {
  id: string;
  name: string;
  buyingPowerCategory: string | null;
  confidenceScore: number | null;
  totalSignals: number;
  topProductCategory: string | null;
  dominantPriceTier: string | null;
}

interface NeighborhoodStats {
  total: number;
  high: number;
  average: number;
  budget: number;
  modelAccuracy: number;
}

const categoryColors: Record<string, string> = {
  HIGH: "bg-green-100 text-green-700",
  AVERAGE: "bg-amber-100 text-amber-700",
  BUDGET: "bg-gray-100 text-gray-700",
};

export default function PurchasingPowerModule() {
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodRecord[]>([]);
  const [stats, setStats] = useState<NeighborhoodStats>({
    total: 0,
    high: 0,
    average: 0,
    budget: 0,
    modelAccuracy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const res = await fetch("/api/neighborhoods");
        const data = await res.json();
        if (data.success) {
          setNeighborhoods(data.data);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching neighborhoods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-[#1B2A4A]" />
            <span className="text-gray-500 text-sm">Neighborhoods</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">HIGH Power</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.high}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Minus className="w-5 h-5 text-amber-500" />
            <span className="text-gray-500 text-sm">AVERAGE</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.average}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500 text-sm">BUDGET</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.budget}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">Model Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {stats.modelAccuracy.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Neighborhood Analysis</h3>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Neighborhood</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Buying Power</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Confidence</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Signals</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Top Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {neighborhoods.map((nh) => (
                <tr key={nh.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{nh.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[nh.buyingPowerCategory || "BUDGET"] || categoryColors.BUDGET
                    }`}>
                      {nh.buyingPowerCategory || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {(nh.confidenceScore || 0).toFixed(0)}%
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                          style={{ width: `${nh.confidenceScore || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{nh.totalSignals}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {nh.topProductCategory || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {nh.dominantPriceTier || "N/A"}
                  </td>
                </tr>
              ))}
              {neighborhoods.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No neighborhoods found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
