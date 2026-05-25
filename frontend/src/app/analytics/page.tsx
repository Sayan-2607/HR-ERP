"use client";

import { Card, StatCard, Badge, PageHeader, Avatar } from "@/components/ui/Card";
import { BarChart3, TrendingDown, Users, PieChart as PieIcon, AlertTriangle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const headcount = [
  { month: "Jul", count: 132 }, { month: "Aug", count: 138 }, { month: "Sep", count: 142 },
  { month: "Oct", count: 148 }, { month: "Nov", count: 152 }, { month: "Dec", count: 155 },
  { month: "Jan", count: 158 }, { month: "Feb", count: 160 }, { month: "Mar", count: 163 },
  { month: "Apr", count: 165 }, { month: "May", count: 166 }, { month: "Jun", count: 168 },
];

const genderData = [
  { name: "Male", value: 92, color: "#6C5CE7" },
  { name: "Female", value: 68, color: "#FD79A8" },
  { name: "Other", value: 8, color: "#00CEC9" },
];

const deptDistribution = [
  { dept: "Engineering", count: 45 }, { dept: "Design", count: 12 }, { dept: "Product", count: 8 },
  { dept: "Marketing", count: 15 }, { dept: "HR", count: 10 }, { dept: "Finance", count: 8 },
  { dept: "Analytics", count: 6 }, { dept: "Sales", count: 14 },
];

const employmentType = [
  { name: "Full-time", value: 148, color: "#6C5CE7" },
  { name: "Contract", value: 12, color: "#00CEC9" },
  { name: "Intern", value: 8, color: "#FDCB6E" },
];

const attritionRisk = [
  { name: "Vikram Patel", dept: "Engineering", risk: 76, designation: "Backend Engineer" },
  { name: "Sneha Joshi", dept: "Design", risk: 62, designation: "UX Designer" },
  { name: "Amit Roy", dept: "Engineering", risk: 54, designation: "QA Lead" },
  { name: "Deepa Krishnan", dept: "Marketing", risk: 30, designation: "Marketing Specialist" },
  { name: "Nisha Agarwal", dept: "Finance", risk: 25, designation: "Finance Analyst" },
];

const skillsRadar = [
  { skill: "React", A: 85 }, { skill: "Python", A: 72 }, { skill: "AWS", A: 60 },
  { skill: "Leadership", A: 55 }, { skill: "Design", A: 48 }, { skill: "Data", A: 65 },
];

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Workforce Analytics" subtitle="Data-driven HR insights" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Headcount" value="168" icon={<Users className="w-5 h-5" />} trend="+8.3% YoY" trendUp color="#6C5CE7" />
        <StatCard title="Retention Rate" value="94.2%" icon={<BarChart3 className="w-5 h-5" />} color="#00B894" />
        <StatCard title="Avg Tenure" value="2.4 yrs" icon={<PieIcon className="w-5 h-5" />} color="#00CEC9" />
        <StatCard title="Attrition Risk" value="4.8%" icon={<TrendingDown className="w-5 h-5" />} trend="-0.5%" trendUp color="#FD79A8" />
      </div>

      {/* Row 1: Headcount trend + Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Headcount Trend (12 months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={headcount}>
              <defs>
                <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0" }} />
              <Area type="monotone" dataKey="count" stroke="#6C5CE7" fill="url(#hcGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={4}>
                {genderData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {genderData.map((d) => (
              <span key={d.name} className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Dept distribution + Skills radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptDistribution} layout="vertical">
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fill: "#E2E8F0", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0" }} />
              <Bar dataKey="count" fill="#6C5CE7" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Org Skill Coverage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillsRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="A" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Attrition risk table */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-white">Attrition Risk Employees</h3>
        </div>
        <div className="space-y-3">
          {attritionRisk.map((e, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Avatar name={e.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{e.name}</p>
                <p className="text-xs text-slate-500">{e.designation} • {e.dept}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${e.risk}%`, background: e.risk >= 60 ? "#FF7675" : e.risk >= 40 ? "#FDCB6E" : "#00B894" }} />
                </div>
                <Badge variant={e.risk >= 60 ? "danger" : e.risk >= 40 ? "warning" : "success"}>{e.risk}%</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
