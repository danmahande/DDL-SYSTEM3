"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, Play } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PredictionRecord {
  id: string;
  predictedCategory: string;
  confidenceScore: number;
  accuracyScore: number | null;
  modelVersion: string;
  runAt: string;
  neighborhood: { name: string };
}

interface PredictionStats {
  currentAccuracy: number;
  trainingData: number;
  lastTrained: string | null;
  modelVersion: string;
}

const featureImportance = [
  { feature: "Order Frequency", importance: 95 },
  { feature: "Avg. Order Value", importance: 82 },
  { feature: "Location", importance: 78 },
  { feature: "Time of Day", importance: 65 },
  { feature: "Product Mix", importance: 58 },
];

export default function PredictionsModule() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [stats, setStats] = useState<PredictionStats>({
    currentAccuracy: 0,
    trainingData: 0,
    lastTrained: null,
    modelVersion: "v1.0.0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("/api/predictions");
        const data = await res.json();
        if (data.success) {
          setPredictions(data.data);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const predictionHistory = useMemo(
    () =>
      predictions.slice(0, 5).map((prediction) => ({
        date: new Date(prediction.runAt).toLocaleDateString(),
        accuracy: prediction.accuracyScore ?? prediction.confidenceScore,
        samples: 1,
      })),
    [predictions]
  );

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
          <p className="text-sm text-gray-500 mb-1">Current Accuracy</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.currentAccuracy.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Training Data</p>
          <p className="text-3xl font-bold text-blue-600">{stats.trainingData}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Last Trained</p>
          <p className="text-3xl font-bold text-purple-600">
            {stats.lastTrained
              ? new Date(stats.lastTrained).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Model Version</p>
          <p className="text-3xl font-bold text-orange-600">{stats.modelVersion}</p>
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
            {predictionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                  <Bar dataKey="accuracy" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No prediction history yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Importance</h3>
          <div className="space-y-4">
            {featureImportance.map((item) => (
              <div key={item.feature}>
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
    </div>
  );
}
