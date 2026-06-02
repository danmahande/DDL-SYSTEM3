"use client";

import { Brain, Play, BarChart3, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const predictionHistory = [
  { date: "2026-06-01", accuracy: 84.2, samples: 1245 },
  { date: "2026-05-28", accuracy: 83.8, samples: 1198 },
  { date: "2026-05-25", accuracy: 83.1, samples: 1150 },
  { date: "2026-05-21", accuracy: 82.5, samples: 1090 },
  { date: "2026-05-18", accuracy: 81.9, samples: 1045 },
];

const featureImportance = [
  { feature: "Order Frequency", importance: 95 },
  { feature: "Avg. Order Value", importance: 82 },
  { feature: "Location", importance: 78 },
  { feature: "Time of Day", importance: 65 },
  { feature: "Product Mix", importance: 58 },
];

export default function PredictionsModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Current Accuracy</p>
          <p className="text-3xl font-bold text-green-600">84.2%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Training Data</p>
          <p className="text-3xl font-bold text-blue-600">12,450</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Last Trained</p>
          <p className="text-3xl font-bold text-purple-600">Yesterday</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Model Version</p>
          <p className="text-3xl font-bold text-orange-600">v2.4.1</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#243656] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6 text-orange-400" /> CS-SVM Prediction Model
            </h3>
            <p className="text-blue-200/70 mb-4">Ready to run predictions on latest data</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors">
            <Play className="w-5 h-5" /> Run Prediction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prediction History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
                <Bar yAxisId="left" dataKey="accuracy" fill="#FF6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Importance</h3>
          <div className="space-y-4">
            {featureImportance.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.feature}</span>
                  <span className="text-sm text-orange-600 font-bold">{item.importance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full"
                    style={{ width: `${item.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Confusion Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border border-gray-200 bg-gray-50"></th>
                <th className="p-4 border border-gray-200 bg-gray-50 text-center font-semibold text-green-700">HIGH</th>
                <th className="p-4 border border-gray-200 bg-gray-50 text-center font-semibold text-amber-700">AVERAGE</th>
                <th className="p-4 border border-gray-200 bg-gray-50 text-center font-semibold text-gray-700">BUDGET</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border border-gray-200 bg-gray-50 font-semibold text-green-700">HIGH</td>
                <td className="p-4 border border-gray-200 text-center bg-green-100 font-bold text-green-800">89%</td>
                <td className="p-4 border border-gray-200 text-center">9%</td>
                <td className="p-4 border border-gray-200 text-center">2%</td>
              </tr>
              <tr>
                <td className="p-4 border border-gray-200 bg-gray-50 font-semibold text-amber-700">AVERAGE</td>
                <td className="p-4 border border-gray-200 text-center">7%</td>
                <td className="p-4 border border-gray-200 text-center bg-amber-100 font-bold text-amber-800">86%</td>
                <td className="p-4 border border-gray-200 text-center">7%</td>
              </tr>
              <tr>
                <td className="p-4 border border-gray-200 bg-gray-50 font-semibold text-gray-700">BUDGET</td>
                <td className="p-4 border border-gray-200 text-center">1%</td>
                <td className="p-4 border border-gray-200 text-center">5%</td>
                <td className="p-4 border border-gray-200 text-center bg-gray-200 font-bold text-gray-800">94%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
