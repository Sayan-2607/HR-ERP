"use client";

import { useState } from "react";
import { Card, StatCard, Badge, PageHeader, Table, Avatar } from "@/components/ui/Card";
import { Wallet, Download, TrendingUp, DollarSign, Receipt } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const monthlyCost = [
  { month: "Jan", cost: 24.5 }, { month: "Feb", cost: 24.8 }, { month: "Mar", cost: 25.2 },
  { month: "Apr", cost: 26.1 }, { month: "May", cost: 26.8 }, { month: "Jun", cost: 27.2 },
];

const payrollRecords = [
  { name: "Priya Sharma", empId: "WS-1002", dept: "Engineering", gross: 120000, deductions: 22800, net: 97200, status: "Paid" },
  { name: "Vikram Patel", empId: "WS-1003", dept: "Engineering", gross: 95000, deductions: 17100, net: 77900, status: "Paid" },
  { name: "Sneha Joshi", empId: "WS-1004", dept: "Design", gross: 85000, deductions: 14450, net: 70550, status: "Processing" },
  { name: "Arjun Mehta", empId: "WS-1005", dept: "Engineering", gross: 160000, deductions: 35200, net: 124800, status: "Paid" },
  { name: "Kavya Reddy", empId: "WS-1006", dept: "Analytics", gross: 110000, deductions: 20900, net: 89100, status: "Paid" },
];

const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}K`;

export default function PayrollPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Payroll" subtitle="Salary management and payslips"
                  action={<button className="btn-primary flex items-center gap-2"><Receipt className="w-4 h-4" /> Generate Payroll</button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Payroll" value="₹27.2L" icon={<Wallet className="w-5 h-5" />} trend="1.5% vs last month" trendUp color="#6C5CE7" />
        <StatCard title="Avg. Salary" value="₹1.02L" icon={<DollarSign className="w-5 h-5" />} color="#00CEC9" />
        <StatCard title="Total Tax" value="₹3.8L" icon={<Receipt className="w-5 h-5" />} color="#FDCB6E" />
        <StatCard title="Processed" value="165/168" icon={<TrendingUp className="w-5 h-5" />} color="#00B894" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Payroll Cost (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyCost}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00CEC9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00CEC9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0" }} />
              <Area type="monotone" dataKey="cost" stroke="#00CEC9" fill="url(#costGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Salary Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Basic Pay", pct: 40, color: "#6C5CE7" },
              { label: "HRA", pct: 16, color: "#00CEC9" },
              { label: "DA", pct: 4, color: "#FD79A8" },
              { label: "Special Allowance", pct: 6, color: "#FDCB6E" },
              { label: "PF Deduction", pct: 12, color: "#FF7675" },
              { label: "Tax", pct: 10, color: "#00B894" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${item.pct * 2.5}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">June 2026 Payroll</h3>
          <button className="btn-secondary flex items-center gap-2 text-xs"><Download className="w-3.5 h-3.5" /> Export</button>
        </div>
        <Table headers={["Employee", "Department", "Gross", "Deductions", "Net Salary", "Status"]}>
          {payrollRecords.map((r, i) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              <td className="py-3 px-3"><div className="flex items-center gap-3"><Avatar name={r.name} size="sm" /><div><p className="text-sm text-white">{r.name}</p><p className="text-[11px] text-slate-500">{r.empId}</p></div></div></td>
              <td className="py-3 px-3 text-sm text-slate-300">{r.dept}</td>
              <td className="py-3 px-3 text-sm text-white font-mono">{fmt(r.gross)}</td>
              <td className="py-3 px-3 text-sm text-red-400 font-mono">-{fmt(r.deductions)}</td>
              <td className="py-3 px-3 text-sm text-emerald-400 font-semibold font-mono">{fmt(r.net)}</td>
              <td className="py-3 px-3"><Badge variant={r.status === "Paid" ? "success" : "warning"}>{r.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
