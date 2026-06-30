"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { 
  ShieldAlert, 
  TrendingUp, 
  FileSpreadsheet,
  ArrowRight,
  TrendingDown,
  Percent,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  company_name: string;
  company_email: string;
  overall_score: number;
  risk_level: string;
  completed_at: string;
}

interface DashboardData {
  totalAssessments: number;
  recentSubmissions: Submission[];
  averageScore: number;
}

interface AdminDashboardClientProps {
  initialData: DashboardData | null;
}

// Mock data for initial zero states / demo usage
const mockSubmissions: Submission[] = [
  { id: "local-demo-1", company_name: "Aero Logistics", company_email: "ceo@aerolog.in", overall_score: 42, risk_level: "high", completed_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "local-demo-2", company_name: "Curate Health", company_email: "founders@curate.co", overall_score: 87, risk_level: "low", completed_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: "local-demo-3", company_name: "Zeta Pay", company_email: "sanjay@zetapay.com", overall_score: 59, risk_level: "medium", completed_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "local-demo-4", company_name: "Krypton Web3", company_email: "legal@krypton.io", overall_score: 31, risk_level: "critical", completed_at: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const mockScoreDistribution = [
  { range: "0-20", count: 2 },
  { range: "21-40", count: 8 },
  { range: "41-60", count: 22 },
  { range: "61-80", count: 14 },
  { range: "81-100", count: 6 },
];

const mockTrends = [
  { name: "Week 1", assessments: 4, avgScore: 52 },
  { name: "Week 2", assessments: 9, avgScore: 48 },
  { name: "Week 3", assessments: 15, avgScore: 56 },
  { name: "Week 4", assessments: 24, avgScore: 54 },
];

const mockIndustryScores = [
  { name: "SaaS", avgScore: 68 },
  { name: "FinTech", avgScore: 48 },
  { name: "E-commerce", avgScore: 61 },
  { name: "Healthcare", avgScore: 51 },
  { name: "General", avgScore: 57 },
];

const mockCommonFailures = [
  { document: "POSH Policy", rate: 82, color: "#DC2626" },
  { document: "Founder Vesting Agreement", rate: 74, color: "#EA580C" },
  { document: "Shareholders' Agreement (SHA)", rate: 68, color: "#D97706" },
  { document: "IP Assignment Agreements", rate: 58, color: "#2563EB" },
  { document: "DPDP Privacy Policy", rate: 49, color: "#16A34A" },
];

const mockFunnelData = [
  { name: "Started Check", value: 120, fill: "#D8A04C" },
  { name: "Selected Industry", value: 104, fill: "#E8BD6E" },
  { name: "Halfway Completed", value: 84, fill: "#F5D69F" },
  { name: "Completed Checklist", value: 54, fill: "#16A34A" },
];

export function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = initialData?.totalAssessments || mockSubmissions.length;
  const submissions = initialData?.recentSubmissions.length ? initialData.recentSubmissions : mockSubmissions;
  const avgScore = initialData?.averageScore || 54;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-700 bg-red-50 border-red-200";
      case "high":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "medium":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-green-700 bg-green-50 border-green-200";
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white border border-[#E8E1D5] rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-white border border-[#E8E1D5] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metric Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6B6B6B] tracking-wider block">Total Audits</span>
            <span className="text-2xl font-extrabold text-[#0A0A0A] block">{total}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FDF8EF] border border-[#E8D5B0] flex items-center justify-center text-[#D8A04C] shrink-0">
            <FileSpreadsheet className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6B6B6B] tracking-wider block">Average Score</span>
            <span className="text-2xl font-extrabold text-[#D8A04C] block">{avgScore}/100</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FDF8EF] border border-[#E8D5B0] flex items-center justify-center text-[#D8A04C] shrink-0">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6B6B6B] tracking-wider block">High Risk Ratio</span>
            <span className="text-2xl font-extrabold text-red-600 block">
              {Math.round((submissions.filter((s) => s.overall_score < 40).length / submissions.length) * 100)}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6B6B6B] tracking-wider block">Completion Rate</span>
            <span className="text-2xl font-extrabold text-green-600 block">45%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0">
            <Percent className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution Chart */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#0A0A0A]">Score Spread Distribution</h3>
            <p className="text-[10px] text-[#6B6B6B]">Frequencies of assessments categorized by score bands.</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockScoreDistribution} margin={{ left: -30, right: 10 }}>
                <XAxis dataKey="range" tick={{ fill: "#6B6B6B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9B9B9B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(216, 160, 76, 0.02)" }} />
                <Bar dataKey="count" fill="#D8A04C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Trend Line */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#0A0A0A]">Auditing Growth Velocity</h3>
            <p className="text-[10px] text-[#6B6B6B]">Compliance submission volumes and score averages over time.</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrends} margin={{ left: -30, right: 10 }}>
                <XAxis dataKey="name" tick={{ fill: "#6B6B6B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9B9B9B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="assessments" stroke="#D8A04C" strokeWidth={2} dot={{ fill: "#D8A04C" }} />
                <Line type="monotone" dataKey="avgScore" stroke="#8E5F28" strokeWidth={2} dot={{ fill: "#8E5F28" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Industry Averages */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 lg:col-span-1">
          <div>
            <h3 className="text-sm font-bold text-[#0A0A0A]">Industry-Wise Averages</h3>
            <p className="text-[10px] text-[#6B6B6B]">Comparing scores across business domains.</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockIndustryScores} layout="vertical" margin={{ left: -10, right: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9B9B9B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#6B6B6B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#E8BD6E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Conversions */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 lg:col-span-1">
          <div>
            <h3 className="text-sm font-bold text-[#0A0A0A]">Assessment Completion Funnel</h3>
            <p className="text-[10px] text-[#6B6B6B]">Friction mapping from starts to submissions.</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockFunnelData} margin={{ left: -30, right: 10 }}>
                <XAxis dataKey="name" tick={{ fill: "#6B6B6B", fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9B9B9B", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#D8A04C" radius={[4, 4, 0, 0]}>
                  {mockFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Common Failures Checklist */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0A0A0A]">Common Gaps Identified</h3>
            <p className="text-[10px] text-[#6B6B6B] mb-2">Failure rate metrics of critical documents.</p>
          </div>
          
          <div className="space-y-3.5">
            {mockCommonFailures.map((item) => (
              <div key={item.document} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-[#3D3D3D] truncate max-w-[150px]">{item.document}</span>
                  <span className="text-red-600 font-bold">{item.rate}% Missing</span>
                </div>
                <div className="w-full bg-[#E8E1D5]/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent submissions table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0A0A0A]">Recent Compliance Submissions</h3>
          <p className="text-[10px] text-[#6B6B6B]">Recent user-generated diagnostic outputs.</p>
        </div>

        <div className="overflow-x-auto border border-[#E8E1D5]/60 rounded-2xl bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FEFCF9] border-b border-[#E8E1D5]">
                <th className="p-4 font-bold text-[#3D3D3D]">Company Name</th>
                <th className="p-4 font-bold text-[#3D3D3D]">Contact Email</th>
                <th className="p-4 font-bold text-[#3D3D3D]">Health Score</th>
                <th className="p-4 font-bold text-[#3D3D3D]">Date Conducted</th>
                <th className="p-4 font-bold text-[#3D3D3D] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D5]/40">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FEFCF9]/40 transition-colors">
                  <td className="p-4 font-semibold text-[#0A0A0A]">{sub.company_name}</td>
                  <td className="p-4 text-[#6B6B6B]">{sub.company_email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full border text-[9px] font-bold capitalize",
                        getRiskColor(sub.risk_level)
                      )}>
                        {sub.risk_level}
                      </span>
                      <strong className="text-[#0A0A0A]">{sub.overall_score}%</strong>
                    </div>
                  </td>
                  <td className="p-4 text-[#9B9B9B]">{new Date(sub.completed_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/results/${sub.id}`}
                      className="inline-flex items-center gap-1 text-[#8E5F28] hover:text-[#D8A04C] font-semibold hover:underline"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
