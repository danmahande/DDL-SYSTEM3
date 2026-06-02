"use client";

import { Tag, Ruler, Zap, MapPin, Plus, X } from "lucide-react";

const settingsData = {
  categories: ["Beverages", "Snacks", "Household", "Personal Care", "Fresh Produce", "Dairy", "Bakery", "Other"],
  packageSizes: ["Sachet", "Small", "Medium", "Large", "Bulk"],
  urgencyLevels: ["Urgent", "Normal", "Low"],
  neighborhoods: ["Bugolobi Market", "Bugolobi Village", "Bugolobi Industrial", "Bugolobi Residential", "Kitintale", "Mbuya", "Kinawataka"],
};

const badgeColors = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

export default function SettingsModule() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Product Categories</h3>
              <p className="text-sm text-gray-600">Manage product categories</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {settingsData.categories.map((cat, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${badgeColors[i % badgeColors.length]}`}>
                {cat}
                <button className="hover:text-red-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#1B2A4A]/10 rounded-lg flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#1B2A4A]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Package Sizes</h3>
              <p className="text-sm text-gray-600">Manage package size options</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {settingsData.packageSizes.map((size, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${badgeColors[i % badgeColors.length]}`}>
                {size}
                <button className="hover:text-red-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1 text-sm text-[#1B2A4A] hover:text-[#243656] font-medium">
            <Plus className="w-4 h-4" /> Add Package Size
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Urgency Levels</h3>
              <p className="text-sm text-gray-600">Manage urgency level options</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {settingsData.urgencyLevels.map((level, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${badgeColors[i % badgeColors.length]}`}>
                {level}
                <button className="hover:text-red-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
            <Plus className="w-4 h-4" /> Add Urgency Level
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Neighborhoods</h3>
              <p className="text-sm text-gray-600">Manage neighborhood areas</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {settingsData.neighborhoods.map((nh, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${badgeColors[i % badgeColors.length]}`}>
                {nh}
                <button className="hover:text-red-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="w-4 h-4" /> Add Neighborhood
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Auto-optimize routes</p>
              <p className="text-sm text-gray-500">Automatically run route optimization daily</p>
            </div>
            <div className="w-12 h-6 bg-orange-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Email notifications</p>
              <p className="text-sm text-gray-500">Send email alerts for urgent orders</p>
            </div>
            <div className="w-12 h-6 bg-orange-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">SMS notifications</p>
              <p className="text-sm text-gray-500">Send SMS alerts to drivers</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
