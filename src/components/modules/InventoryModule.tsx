"use client";

import { useEffect, useState } from "react";
import { Package, Plus } from "lucide-react";

interface ProductRecord {
  id: string;
  productId: string;
  productLabel: string;
  category: string;
  merchantName: string;
  unitCost: number;
  unitSellingPrice: number;
  currentStock: number;
  minStock: number;
}

interface ProductStats {
  total: number;
  lowStock: number;
  stockValue: number;
  categories: number;
}

function getStockStatus(currentStock: number, minStock: number) {
  if (currentStock <= minStock * 0.3) return "Critical";
  if (currentStock <= minStock) return "Low Stock";
  return "In Stock";
}

export default function InventoryModule() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    lowStock: 0,
    stockValue: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-gray-500 text-sm">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-red-500" />
            <span className="text-gray-500 text-sm">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Stock Value</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            USh {(stats.stockValue / 1_000_000).toFixed(1)}M
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-gray-500 text-sm">Categories</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.categories}</p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const status = getStockStatus(product.currentStock, product.minStock);
                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 transition-colors ${status === "Critical" ? "bg-red-50/50" : ""}`}
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{product.productId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-900">{product.productLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.merchantName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      USh {product.unitCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      USh {product.unitSellingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${
                        status === "Critical" ? "text-red-600" :
                        status === "Low Stock" ? "text-amber-600" :
                        "text-gray-900"
                      }`}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === "Critical" ? "bg-red-100 text-red-700" :
                        status === "Low Stock" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No products found
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
