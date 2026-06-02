"use client";

import { ClipboardList, Truck, CheckCircle2, AlertTriangle, DollarSign, MapPin, Plus, Eye, X } from "lucide-react";

const runsheets = [
  { id: "RS-20260602-001", driver: "John Doe", status: "In Progress", stops: 12, completed: 4, cod: "USh 1.2M" },
  { id: "RS-20260602-002", driver: "Jane Smith", status: "Pending", stops: 8, completed: 0, cod: "USh 850K" },
  { id: "RS-20260601-001", driver: "Bob Wilson", status: "Completed", stops: 15, completed: 15, cod: "USh 1.8M" },
];

export default function RunsheetsModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <ClipboardList className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Total Runsheets</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Truck className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-500">Unassigned Orders</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">USh 4.5M</p>
          <p className="text-xs text-gray-500">COD Collected</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <MapPin className="w-6 h-6 text-[#1B2A4A] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">35</p>
          <p className="text-xs text-gray-500">Total Stops</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Runsheets</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> New Runsheet
        </button>
      </div>

      <div className="space-y-4">
        {runsheets.map((rs) => (
          <div key={rs.id} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">{rs.id}</h4>
                  <p className="text-sm text-gray-600">Driver: {rs.driver}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  rs.status === "Completed" ? "bg-green-100 text-green-700" :
                  rs.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {rs.status}
                </span>
              </div>
              <button className="flex items-center gap-1 px-3 py-1 text-sm text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-4 h-4" /> View Details
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Stops Completed</span>
                  <span className="font-medium">{rs.completed} / {rs.stops}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(rs.completed / rs.stops) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">COD: <span className="font-medium text-gray-900">{rs.cod}</span></span>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button className="px-3 py-1 text-sm text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">Reschedule</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
