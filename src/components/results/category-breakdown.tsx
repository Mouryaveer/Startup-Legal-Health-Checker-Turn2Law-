"use client";

import { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { CategoryScore } from "@/lib/assessment/scoring";
import { AlertCircle, CheckCircle, HelpCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBreakdownProps {
  categoryScores: CategoryScore[];
}

export function CategoryBreakdown({ categoryScores }: CategoryBreakdownProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"radar" | "bar">("radar");

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = categoryScores.map((cat) => ({
    subject: cat.name.split(" & ")[0].split(" ")[0], // short name
    score: cat.score,
    fullMark: 100,
  }));

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "critical":
      case "high":
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  if (!mounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-gray-50/50 rounded-2xl animate-pulse">
        <span className="text-xs text-gray-400">Loading breakdown visualization...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      {/* Category breakdown details */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#0A0A0A]">Category Performance</h3>
            <p className="text-xs text-[#6B6B6B]">Compliance rates analyzed across specific operations.</p>
          </div>

          <div className="space-y-3.5">
            {categoryScores.map((cat) => (
              <div key={cat.slug} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#3D3D3D]">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full border text-[10px] capitalize font-medium",
                      getRiskBadgeColor(cat.riskLevel)
                    )}>
                      {cat.riskLevel === "low" ? "Healthy" : `${cat.riskLevel} risk`}
                    </span>
                    <span className="text-[#0A0A0A]">{cat.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-[#E8E1D5]/40 h-2 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      cat.score >= 80 ? "bg-green-600" :
                      cat.score >= 60 ? "bg-lime-600" :
                      cat.score >= 40 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="glass-panel-strong rounded-3xl p-6 flex flex-col items-center justify-between">
        <div className="flex items-center justify-between w-full mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A]">Visual Analysis</h3>
            <p className="text-[11px] text-[#6B6B6B]">Select model to switch breakdown views.</p>
          </div>
          <div className="flex bg-[#F5F1EB] p-1 rounded-xl border border-[#E8E1D5] text-xs">
            <button
              onClick={() => setActiveTab("radar")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                activeTab === "radar" ? "bg-white text-[#8E5F28] shadow-sm" : "text-[#6B6B6B] hover:text-[#0A0A0A]"
              )}
            >
              Radar Map
            </button>
            <button
              onClick={() => setActiveTab("bar")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                activeTab === "bar" ? "bg-white text-[#8E5F28] shadow-sm" : "text-[#6B6B6B] hover:text-[#0A0A0A]"
              )}
            >
              Bar Chart
            </button>
          </div>
        </div>

        <div className="w-full h-64 mt-2 flex items-center justify-center">
          {activeTab === "radar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#E8E1D5" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B6B6B", fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9B9B9B", fontSize: 9 }} />
                <Radar
                  name="Legal Health"
                  dataKey="score"
                  stroke="#D8A04C"
                  fill="#D8A04C"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="subject" tick={{ fill: "#6B6B6B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#9B9B9B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(216, 160, 76, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E8E1D5",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="score" fill="#D8A04C" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
