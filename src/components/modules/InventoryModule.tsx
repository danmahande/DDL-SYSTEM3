"use client";

import { Package, Plus, Edit, Trash2 } from "lucide-react";

const products = [
  { id: "PRD-001", name: "Soda 500ml", category: "Beverages", merchant: "Mama Johnson's", cost: 800, price: 1200, stock: 245, status: "In Stock" },
  { id: "PRD-002", name: "Sugar 1kg", category: "Groceries", merchant: "Kampala Corner", cost: 3200, price: 4000, stock: 89, status: "In Stock" },
  { id: "PRD-003", name: "Milk 1L", category: "Dairy", merchant: "Mama Johnson's", cost: 1800, price: 2400, stock: 42, status: "In Stock" },
  { id: "PRD-004", name: "Bread", category: "Bakery", merchant: "Bugolobi Stall 12", cost: 1500, price: 2000, stock: 12, status: "Low Stock" },
  { id: "PRD-005", name: "Cooking Oil 2L", category: "Groceries", merchant: "Mama Johnson's", cost: 8500, price: 10500, stock: 3, status: "Critical" },
];

export default function InventoryModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-gray-500 text-sm">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">156</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-red-500" />
            <span className="text-gray-500 text-sm">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-red-600">12</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Stock Value</span>
          </div>
          <p className="text-2xl font-bold text-green-600">USh 4.5M</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">Categories</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Inventory</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Merchant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${product.status === "Critical" ? "bg-red-50/50" : ""}`}>
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.merchant}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">USh {product.cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">USh {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      product.status === "Critical" ? "text-red-600" :
                      product.status === "Low Stock" ? "text-amber-600" :
                      "text-gray-900"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.status === "Critical" ? "bg-red-100 text-red-700" :
                      product.status === "Low Stock" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {product.status}
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
