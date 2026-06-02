"use client";

import { MapPin, TrendingUp, Minus, TrendingDown, Target, ExternalLink } from "lucide-react";

const neighborhoods = [
  { name: "Bugolobi Market", category: "HIGH", confidence: 92, signals: 87, topCategory: "Beverages", avgPkg: "Medium" },
  { name: "Bugolobi Village", category: "HIGH", confidence: 88, signals: 65, topCategory: "Groceries", avgPkg: "Large" },
  { name: "Kitintale", category: "AVERAGE", confidence: 76, signals: 43, topCategory: "Dairy", avgPkg: "Small" },
  { name: "Mbuya", category: "AVERAGE", confidence: 71, signals: 38, topCategory: "Bakery", avgPkg: "Medium" },
  { name: "Bugolobi Industrial", category: "BUDGET", confidence: 65, signals: 15, topCategory: "Beverages", avgPkg: "Small" },
];

const categoryColors: Record<string, string> = {
  HIGH: "bg-green-100 text-green-700",
  AVERAGE: "bg-amber-100 text-amber-700",
  BUDGET: "bg-gray-100 text-gray-700",
};

export default function PurchasingPowerModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-[#1B2A4A]" />
            <span className="text-gray-500 text-sm">Neighborhoods</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">HIGH Power</span>
          </div>
          <p className="text-2xl font-bold text-green-600">4</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Minus className="w-5 h-5 text-amber-500" />
            <span className="text-gray-500 text-sm">AVERAGE</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">5</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500 text-sm">BUDGET</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">3</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">Model Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">84%</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Neighborhood Analysis</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <ExternalLink className="w-4 h-4" /> View on Map
        </button>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Avg Pkg Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {neighborhoods.map((nh, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{nh.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[nh.category]}`}>
                      {nh.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{nh.confidence}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                          style={{ width: `${nh.confidence}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{nh.signals}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {nh.topCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{nh.avgPkg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Model Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Model Type</span>
              <span className="font-medium text-gray-900">CS-SVM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Training Data Size</span>
              <span className="font-medium text-gray-900">12,450 samples</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Trained</span>
              <span className="font-medium text-gray-900">2026-06-01 14:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium text-green-600">84.2%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <span className="text-gray-700">Increase premium products in Bugolobi Market</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
              <span className="text-gray-700">Monitor Kitintale for potential upgrade</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <span className="text-gray-700">Focus on budget options in Industrial area</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
