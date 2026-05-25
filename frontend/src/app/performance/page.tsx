"use client";

import { Card, StatCard, Badge, PageHeader, Avatar } from "@/components/ui/Card";
import { Target, TrendingUp, Star, Award, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const goals = [
  { title: "Complete React 19 migration", progress: 65, status: "In Progress", category: "Project", target: "Jun 30" },
  { title: "Mentor 2 junior developers", progress: 40, status: "In Progress", category: "Development", target: "Dec 31" },
  { title: "Reduce deployment time by 50%", progress: 80, status: "On Track", category: "Team", target: "Jun 30" },
  { title: "Build attrition prediction model", progress: 90, status: "Almost Done", category: "Project", target: "Jun 15" },
];

const teamRatings = [
  { name: "Priya S.", rating: 4.2 }, { name: "Vikram P.", rating: 3.5 },
  { name: "Sneha J.", rating: 4.0 }, { name: "Arjun M.", rating: 4.5 },
  { name: "Kavya R.", rating: 4.1 }, { name: "Rahul S.", rating: 3.8 },
];

const overallScore = [{ name: "Score", value: 4.2, fill: "#6C5CE7" }];

export default function PerformancePage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Performance" subtitle="OKRs, reviews & feedback" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Overall Rating" value="4.2 / 5" icon={<Star className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="Goals Completed" value="12/18" icon={<Target className="w-5 h-5" />} color="#00B894" />
        <StatCard title="Reviews Pending" value="3" icon={<TrendingUp className="w-5 h-5" />} color="#FDCB6E" />
        <StatCard title="Feedback Received" value="8" icon={<Award className="w-5 h-5" />} color="#00CEC9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Score radial */}
        <Card className="flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-white mb-2">Your Performance Score</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={overallScore} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(255,255,255,0.05)" }} max={5} />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-3xl font-bold gradient-text -mt-6">4.2</p>
          <p className="text-xs text-slate-500">out of 5.0</p>
        </Card>

        {/* Team ratings */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Team Ratings</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={teamRatings} layout="vertical">
              <XAxis type="number" domain={[0, 5]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#E2E8F0", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0" }} />
              <Bar dataKey="rating" fill="#6C5CE7" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Goals / OKRs */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Goals & OKRs</h3>
          <button className="btn-secondary text-xs">+ Add Goal</button>
        </div>
        <div className="space-y-3">
          {goals.map((g, i) => (
            <div key={i} className="p-4 rounded-xl flex items-center gap-4 group hover:bg-white/[0.03] transition-colors cursor-pointer"
                 style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                   style={{ background: g.progress >= 80 ? "rgba(0,184,148,0.15)" : g.progress >= 50 ? "rgba(108,92,231,0.15)" : "rgba(253,203,110,0.15)",
                            color: g.progress >= 80 ? "#00B894" : g.progress >= 50 ? "#A29BFE" : "#FDCB6E" }}>
                {g.progress}%
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{g.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">{g.category}</Badge>
                  <span className="text-xs text-slate-500">Target: {g.target}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 mt-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${g.progress}%`, background: g.progress >= 80 ? "#00B894" : "#6C5CE7" }} />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
