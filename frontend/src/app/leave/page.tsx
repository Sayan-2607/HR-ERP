"use client";

import { useState } from "react";
import { Card, StatCard, Badge, PageHeader, Table, Avatar } from "@/components/ui/Card";
import { CalendarOff, Plus, Check, X, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const leaveBalances = [
  { type: "Casual Leave", total: 12, used: 4, remaining: 8, color: "#6C5CE7" },
  { type: "Sick Leave", total: 10, used: 2, remaining: 8, color: "#00CEC9" },
  { type: "Earned Leave", total: 15, used: 3, remaining: 12, color: "#FD79A8" },
];

const requests = [
  { id: "1", employee: "Priya Sharma", type: "Casual", from: "2026-06-10", to: "2026-06-12", days: 3, reason: "Family function", status: "Pending" },
  { id: "2", employee: "Vikram Patel", type: "Sick", from: "2026-06-05", to: "2026-06-06", days: 2, reason: "Medical appointment", status: "Pending" },
  { id: "3", employee: "Sneha Joshi", type: "Earned", from: "2026-06-20", to: "2026-06-25", days: 6, reason: "Vacation", status: "Approved" },
  { id: "4", employee: "Kavya Reddy", type: "Casual", from: "2026-06-15", to: "2026-06-15", days: 1, reason: "Personal work", status: "Pending" },
];

export default function LeavePage() {
  const { isHR } = useAuthStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Leave Management" subtitle="Apply and manage leaves"
                  action={<button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Apply Leave</button>} />

      {/* Leave Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {leaveBalances.map((lb) => (
          <Card key={lb.type} hover>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">{lb.type}</p>
              <Badge variant="primary">{lb.remaining} left</Badge>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5">
              <div className="h-full rounded-full transition-all" style={{ width: `${(lb.used / lb.total) * 100}%`, background: lb.color }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Used: {lb.used}</span>
              <span>Total: {lb.total}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Apply form */}
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">New Leave Request</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Leave Type</label>
              <select className="input-dark">
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">From Date</label>
              <input type="date" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">To Date</label>
              <input type="date" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Reason</label>
              <input type="text" placeholder="Enter reason" className="input-dark" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary">Submit Request</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </Card>
      )}

      {/* Requests table */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">{isHR ? "All Leave Requests" : "My Leave Requests"}</h3>
        <Table headers={["Employee", "Type", "From", "To", "Days", "Reason", "Status", ...(isHR ? ["Actions"] : [])]}>
          {requests.map((r) => (
            <tr key={r.id} className="hover:bg-white/[0.02]">
              <td className="py-3 px-3"><div className="flex items-center gap-3"><Avatar name={r.employee} size="sm" /><span className="text-sm text-white">{r.employee}</span></div></td>
              <td className="py-3 px-3 text-sm text-slate-300">{r.type}</td>
              <td className="py-3 px-3 text-sm text-slate-400">{r.from}</td>
              <td className="py-3 px-3 text-sm text-slate-400">{r.to}</td>
              <td className="py-3 px-3 text-sm text-white font-semibold">{r.days}</td>
              <td className="py-3 px-3 text-sm text-slate-300">{r.reason}</td>
              <td className="py-3 px-3"><Badge variant={r.status === "Approved" ? "success" : r.status === "Rejected" ? "danger" : "warning"}>{r.status}</Badge></td>
              {isHR && (
                <td className="py-3 px-3">
                  {r.status === "Pending" && (
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><Check className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
