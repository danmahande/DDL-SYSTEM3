"use client";

import { Route, MapPin, Navigation, TrendingDown, Calendar, Map, Play, Eye } from "lucide-react";

const routes = [
  { id: "RTE-20260602-001", driver: "John Doe", distance: "24.5 km", time: "45 min", stops: 12, status: "Active" },
  { id: "RTE-20260602-002", driver: "Jane Smith", distance: "18.2 km", time: "32 min", stops: 8, status: "Planned" },
  { id: "RTE-20260602-003", driver: "Bob Wilson", distance: "31.8 km", time: "58 min", stops: 15, status: "Planned" },
  { id: "RTE-20260601-001", driver: "Alice Brown", distance: "22.3 km", time: "40 min", stops: 10, status: "Completed" },
];

const statusColors: Record<string, string> = {
  Planned: "bg-slate-100 text-slate-700",
  Active: "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
};

export default function RouteOptimizationModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Route className="w-5 h-5 text-orange-500" />
            <span className="text-gray-500 text-sm">Active Routes</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">3</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">Total Stops</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">35</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Avg Distance</span>
          </div>
          <p className="text-2xl font-bold text-green-600">24.2 km</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-purple-500" />
            <span className="text-gray-500 text-sm">Optimization Savings</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">18%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Route Planning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Today</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Neighborhoods</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option>All Neighborhoods</option>
              <option>Bugolobi Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Urgent First</option>
              <option>Balanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Vehicle Capacity</label>
            <input type="number" defaultValue={50} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
          Optimize Routes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Optimized Routes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Route ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Distance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Est. Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stops</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{route.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{route.driver}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{route.distance}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{route.time}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.stops}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[route.status]}`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Map className="w-4 h-4" /> Map
                      </button>
                      {route.status === "Planned" && (
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Play className="w-4 h-4" /> Start
                        </button>
                      )}
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
