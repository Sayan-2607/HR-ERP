"use client";

import { useState } from "react";
import { Card, StatCard, Badge, PageHeader, Table, Avatar } from "@/components/ui/Card";
import { HelpCircle, Clock, AlertTriangle, CheckCircle, Plus, MessageSquare } from "lucide-react";

const tickets = [
  { id: "1", ticketNo: "TKT-001001", employee: "Priya Sharma", category: "IT Support", subject: "VPN not connecting", priority: "High", status: "In Progress", created: "2h ago", sla: "6h left" },
  { id: "2", ticketNo: "TKT-001002", employee: "Sneha Joshi", category: "HR Query", subject: "WFH policy clarification", priority: "Medium", status: "Open", created: "5h ago", sla: "19h left" },
  { id: "3", ticketNo: "TKT-001003", employee: "Amit Roy", category: "Payroll", subject: "Tax declaration update", priority: "Low", status: "Open", created: "1d ago", sla: "12h left" },
  { id: "4", ticketNo: "TKT-001004", employee: "Vikram Patel", category: "Access Request", subject: "AWS console access", priority: "Urgent", status: "Open", created: "30m ago", sla: "3.5h left" },
  { id: "5", ticketNo: "TKT-001005", employee: "Kavya Reddy", category: "IT Support", subject: "Laptop replacement request", priority: "Medium", status: "Resolved", created: "2d ago", sla: "Completed" },
  { id: "6", ticketNo: "TKT-001006", employee: "Rahul Singh", category: "Facilities", subject: "Parking spot allocation", priority: "Low", status: "Open", created: "3d ago", sla: "8h left" },
];

const priorityVariant = (p: string) => p === "Urgent" ? "danger" : p === "High" ? "warning" : p === "Medium" ? "primary" : "default";
const statusVariant = (s: string) => s === "Resolved" ? "success" : s === "In Progress" ? "primary" : "warning";

export default function HelpdeskPage() {
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const filters = ["All", "Open", "In Progress", "Resolved"];

  const filtered = filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Helpdesk" subtitle="IT support & ticket management"
                  action={<button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Ticket</button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Open Tickets" value="8" icon={<HelpCircle className="w-5 h-5" />} color="#FDCB6E" />
        <StatCard title="In Progress" value="3" icon={<Clock className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="Resolved" value="142" icon={<CheckCircle className="w-5 h-5" />} color="#00B894" />
        <StatCard title="Urgent" value="1" icon={<AlertTriangle className="w-5 h-5" />} color="#FF7675" />
      </div>

      {/* New ticket form */}
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Raise a New Ticket</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Category</label>
              <select className="input-dark">
                <option>IT Support</option>
                <option>HR Query</option>
                <option>Payroll</option>
                <option>Access Request</option>
                <option>Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Priority</label>
              <select className="input-dark">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Subject</label>
              <input type="text" placeholder="Brief description of your issue" className="input-dark" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <textarea placeholder="Describe your issue in detail..." className="input-dark resize-none" rows={3} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary">Submit Ticket</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    filter === f ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-slate-400 border border-white/[0.06] hover:border-purple-500/20"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <Card>
        <Table headers={["Ticket", "Employee", "Category", "Subject", "Priority", "Status", "SLA", ""]}>
          {filtered.map((t) => (
            <tr key={t.id} className="hover:bg-white/[0.02] cursor-pointer">
              <td className="py-3 px-3 text-sm text-purple-300 font-mono">{t.ticketNo}</td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <Avatar name={t.employee} size="sm" />
                  <span className="text-sm text-white">{t.employee}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-sm text-slate-300">{t.category}</td>
              <td className="py-3 px-3 text-sm text-white max-w-[200px] truncate">{t.subject}</td>
              <td className="py-3 px-3"><Badge variant={priorityVariant(t.priority)}>{t.priority}</Badge></td>
              <td className="py-3 px-3"><Badge variant={statusVariant(t.status)}>{t.status}</Badge></td>
              <td className="py-3 px-3">
                <span className={`text-xs font-mono ${t.sla === "Completed" ? "text-emerald-400" : t.sla.includes("3") ? "text-red-400" : "text-slate-400"}`}>{t.sla}</span>
              </td>
              <td className="py-3 px-3">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
