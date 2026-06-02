"use client";

import { BarChart3, TrendingUp, MapPin, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const forecastData = [
  { month: "Jan", actual: 120, predicted: 115 },
  { month: "Feb", actual: 180, predicted: 175 },
  { month: "Mar", actual: 150, predicted: 160 },
  { month: "Apr", actual: 220, predicted: 210 },
  { month: "May", actual: 280, predicted: 270 },
  { month: "Jun", actual: null, predicted: 260 },
  { month: "Jul", actual: null, predicted: 290 },
];

const buyingPowerTrend = [
  { month: "Jan", HIGH: 3, AVERAGE: 5, BUDGET: 4 },
  { month: "Feb", HIGH: 4, AVERAGE: 4, BUDGET: 4 },
  { month: "Mar", HIGH: 4, AVERAGE: 5, BUDGET: 3 },
  { month: "Apr", HIGH: 4, AVERAGE: 5, BUDGET: 3 },
  { month: "May", HIGH: 4, AVERAGE: 5, BUDGET: 3 },
  { month: "Jun", HIGH: 4, AVERAGE: 5, BUDGET: 3 },
];

const productDemand = [
  { product: "Soda", demand: 245, location: "Bugolobi" },
  { product: "Sugar", demand: 198, location: "Bugolobi" },
  { product: "Milk", demand: 176, location: "Kitintale" },
  { product: "Bread", demand: 154, location: "Mbuya" },
  { product: "Oil", demand: 132, location: "Bugolobi" },
];

const COLORS = ["#FF6B35", "#22C55E", "#64748B"];

export default function AnalyticsModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" /> Demand Forecasting
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
                <Line type="monotone" dataKey="actual" stroke="#1B2A4A" strokeWidth={2} dot={{ fill: "#1B2A4A" }} />
                <Line type="monotone" dataKey="predicted" stroke="#FF6B35" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#FF6B35" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" /> Buying Power Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buyingPowerTrend} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
                <Bar dataKey="HIGH" stackId="a" fill={COLORS[0]} />
                <Bar dataKey="AVERAGE" stackId="a" fill={COLORS[1]} />
                <Bar dataKey="BUDGET" stackId="a" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" /> Product Demand by Location
          </h3>
          <div className="space-y-3">
            {productDemand.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.product}</span>
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                      style={{ width: `${(item.demand / 245) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-bold text-gray-900 w-12 text-right">{item.demand}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" /> Signal Quality Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Truthfulness Score</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-orange-600">76%</p>
              <p className="text-sm text-gray-600">Incentive Effectiveness</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">92%</p>
              <p className="text-sm text-gray-600">Fulfillment Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">4.8</p>
              <p className="text-sm text-gray-600">Avg. Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
