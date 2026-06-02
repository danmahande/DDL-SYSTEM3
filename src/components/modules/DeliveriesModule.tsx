"use client";

import { Truck, CheckCircle2, AlertTriangle, Clock, Eye } from "lucide-react";

const deliveries = [
  { id: "DLV-0001", driver: "John Doe", route: "RTE-20260602-001", stop: "Bugolobi Market", status: "In Transit", eta: "15 min", cod: "USh 245,000" },
  { id: "DLV-0002", driver: "Jane Smith", route: "RTE-20260602-002", stop: "Kitintale", status: "Dispatched", eta: "30 min", cod: "USh 180,500" },
  { id: "DLV-0003", driver: "Bob Wilson", route: "RTE-20260601-001", stop: "Mbuya", status: "Delivered", eta: "-", cod: "USh 320,000" },
  { id: "DLV-0004", driver: "Alice Brown", route: "RTE-20260602-003", stop: "Bugolobi Village", status: "Failed", eta: "-", cod: "USh 95,000" },
];

const statusColors: Record<string, string> = {
  Dispatched: "bg-blue-100 text-blue-700",
  "In Transit": "bg-sky-100 text-sky-700",
  Delivered: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Rescheduled: "bg-amber-100 text-amber-700",
};

export default function DeliveriesModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">In Transit</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Delivered Today</span>
          </div>
          <p className="text-2xl font-bold text-green-600">24</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-gray-500 text-sm">Failed/Rescheduled</span>
          </div>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-gray-500 text-sm">On-Time Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">92%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1B2A4A] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Delivery ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Current Stop</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">ETA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">COD</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{delivery.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{delivery.driver}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium hover:underline cursor-pointer">{delivery.route}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delivery.stop}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[delivery.status]}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delivery.eta}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{delivery.cod}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" /> View
                    </button>
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
