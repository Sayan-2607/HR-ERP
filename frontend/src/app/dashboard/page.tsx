"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, StatCard, Badge, Loader, PageHeader } from "@/components/ui/Card";
import { Users, Clock, CalendarOff, TrendingUp, AlertTriangle, Briefcase, Target, Brain } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for demo (replace with API calls)
const headcountData = [
  { month: "Jan", count: 142 }, { month: "Feb", count: 148 }, { month: "Mar", count: 155 },
  { month: "Apr", count: 160 }, { month: "May", count: 164 }, { month: "Jun", count: 168 },
];

const departmentData = [
  { name: "Engineering", count: 45, color: "#6C5CE7" },
  { name: "Design", count: 12, color: "#00CEC9" },
  { name: "Product", count: 8, color: "#FD79A8" },
  { name: "Marketing", count: 15, color: "#FDCB6E" },
  { name: "HR", count: 10, color: "#00B894" },
  { name: "Finance", count: 8, color: "#FF7675" },
];

const attendanceWeek = [
  { day: "Mon", present: 156, wfh: 12 }, { day: "Tue", present: 162, wfh: 6 },
  { day: "Wed", present: 158, wfh: 10 }, { day: "Thu", present: 160, wfh: 8 },
  { day: "Fri", present: 148, wfh: 20 },
];

export default function DashboardPage() {
  const { user, isHR } = useAuthStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);
  if (!loaded) return <Loader />;

  const name = user?.employee ? `${user.employee.firstName}` : "User";

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Welcome back, ${name} 👋`}
        subtitle={isHR ? "Here's your organization overview" : "Here's your work summary"}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Employees" value="168" icon={<Users className="w-5 h-5" />} trend="4.2% this month" trendUp color="#6C5CE7" />
        <StatCard title="Present Today" value="156" icon={<Clock className="w-5 h-5" />} trend="92.8% rate" trendUp color="#00CEC9" />
        <StatCard title="On Leave" value="7" icon={<CalendarOff className="w-5 h-5" />} color="#FDCB6E" />
        <StatCard title={isHR ? "Open Positions" : "Pending Tasks"} value={isHR ? "4" : "6"}
                  icon={<Briefcase className="w-5 h-5" />} color="#FD79A8" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Headcount trend */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Headcount Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={headcountData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#6C5CE7" fill="url(#colorCount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Department distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Departments</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count" paddingAngle={3}>
                {departmentData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {departmentData.slice(0, 4).map((d) => (
              <span key={d.name} className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Weekly attendance */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendanceWeek}>
              <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0", fontSize: 12 }} />
              <Bar dataKey="present" fill="#6C5CE7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wfh" fill="#00CEC9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">AI Insights</h3>
            <Badge variant="primary">Powered by AI</Badge>
          </div>
          <div className="space-y-3">
            {[
              { text: isHR ? "3 employees in Engineering show high attrition risk" : "You're 82% ready for promotion to Lead", icon: <AlertTriangle className="w-4 h-4" />, color: "#FD79A8" },
              { text: isHR ? "Attendance trending 5% higher than last month" : "Your attendance rate this month: 96%", icon: <TrendingUp className="w-4 h-4" />, color: "#00CEC9" },
              { text: isHR ? "2 performance reviews pending calibration" : "OKR progress: 72% — on track for Q2 goals", icon: <Target className="w-4 h-4" />, color: "#6C5CE7" },
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${insight.color}15`, color: insight.color }}>
                  {insight.icon}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Clock In", icon: "🕐" },
            { label: "Apply Leave", icon: "📋" },
            { label: "My Payslip", icon: "💰" },
            { label: "Raise Ticket", icon: "🎫" },
            { label: "Give Recognition", icon: "⭐" },
            { label: "Ask AI", icon: "🤖" },
          ].map((action) => (
            <button key={action.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs text-slate-400">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
