"use client";

import { Truck, Plus, Edit, User } from "lucide-react";

const drivers = [
  { id: "DRV-001", name: "John Doe", phone: "0772123456", vehicle: "Toyota Hilux UBK 123A", license: "DL123456", status: "Active" },
  { id: "DRV-002", name: "Jane Smith", phone: "0782123457", vehicle: "Isuzu D-Max UBB 456B", license: "DL789012", status: "Active" },
  { id: "DRV-003", name: "Bob Wilson", phone: "0752123458", vehicle: "Ford Ranger UBC 789C", license: "DL345678", status: "On Leave" },
  { id: "DRV-004", name: "Alice Brown", phone: "0702123459", vehicle: "-", license: "DL901234", status: "Inactive" },
];

export default function DriversModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-orange-500" />
            <span className="text-gray-500 text-sm">Total Drivers</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">9</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <span className="text-gray-500 text-sm">On Leave</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">2</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Drivers</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">License</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {driver.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{driver.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{driver.vehicle}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{driver.license}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      driver.status === "Active" ? "bg-green-100 text-green-700" :
                      driver.status === "On Leave" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
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
