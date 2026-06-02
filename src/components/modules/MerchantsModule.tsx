"use client";

import { Store, Plus, Edit, Trash2 } from "lucide-react";

const merchants = [
  { id: "MCH-001", businessName: "Mama Johnson's Shop", contact: "0772123456", email: "mama.j@example.com", status: "Active" },
  { id: "MCH-002", businessName: "Kampala Corner Store", contact: "0782123457", email: "corner@example.com", status: "Active" },
  { id: "MCH-003", businessName: "Bugolobi Market Stall 12", contact: "0752123458", email: "stall12@example.com", status: "Active" },
  { id: "MCH-004", businessName: "Kitintale Mini Market", contact: "0702123459", email: "kitintale@example.com", status: "Inactive" },
];

export default function MerchantsModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-5 h-5 text-orange-500" />
            <span className="text-gray-500 text-sm">Total Merchants</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">45</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">42</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">New This Month</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Merchants</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Merchant
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Business Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {merchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{merchant.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{merchant.businessName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{merchant.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{merchant.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      merchant.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {merchant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
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
