"use client";

import { useEffect, useState } from "react";
import { Store, Plus } from "lucide-react";

interface MerchantRecord {
  id: string;
  merchantId: string;
  businessName: string;
  contact: string;
  email: string;
  isActive: boolean;
}

interface MerchantStats {
  total: number;
  active: number;
  newThisMonth: number;
}

export default function MerchantsModule() {
  const [merchants, setMerchants] = useState<MerchantRecord[]>([]);
  const [stats, setStats] = useState<MerchantStats>({ total: 0, active: 0, newThisMonth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await fetch("/api/merchants");
        const data = await res.json();
        if (data.success) {
          setMerchants(data.data);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-5 h-5 text-orange-500" />
            <span className="text-gray-500 text-sm">Total Merchants</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">New This Month</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {merchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{merchant.merchantId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{merchant.businessName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{merchant.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{merchant.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      merchant.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {merchant.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {merchants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No merchants found
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
