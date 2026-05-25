"use client";

import { useState } from "react";
import { Card, PageHeader, Badge } from "@/components/ui/Card";
import { Settings, User, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({ email: true, push: true, leave: true, attendance: false, payroll: true });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" subtitle="Manage your preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Profile Settings</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">First Name</label>
                <input type="text" defaultValue={user?.employee?.firstName || ""} className="input-dark" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Last Name</label>
                <input type="text" defaultValue={user?.employee?.lastName || ""} className="input-dark" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input type="email" defaultValue={user?.email || ""} className="input-dark" disabled />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone</label>
                <input type="tel" defaultValue="+91 9876543210" className="input-dark" />
              </div>
            </div>
            <button className="btn-primary mt-4 flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
          </Card>

          {/* Notifications */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Notification Preferences</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
                { key: "leave", label: "Leave Approvals", desc: "Notify on leave request updates" },
                { key: "attendance", label: "Attendance Reminders", desc: "Daily clock-in reminders" },
                { key: "payroll", label: "Payroll Alerts", desc: "Payslip generation alerts" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full transition-all relative ${notifications[item.key as keyof typeof notifications] ? "bg-purple-500" : "bg-white/10"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Security */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Security</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                <input type="password" placeholder="Enter current password" className="input-dark" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">New Password</label>
                <input type="password" placeholder="Enter new password" className="input-dark" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Confirm Password</label>
                <input type="password" placeholder="Confirm new password" className="input-dark" />
              </div>
              <button className="btn-secondary">Update Password</button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
                   style={{ background: "linear-gradient(135deg, #6C5CE7, #00CEC9)" }}>
                {user?.employee ? `${user.employee.firstName[0]}${user.employee.lastName[0]}` : "WS"}
              </div>
              <p className="text-lg font-semibold text-white">{user?.employee ? `${user.employee.firstName} ${user.employee.lastName}` : "User"}</p>
              <p className="text-xs text-slate-500">{user?.employee?.designation}</p>
              <Badge variant="primary">{user?.role?.replace(/_/g, " ")}</Badge>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-semibold text-white">Appearance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-sm text-white">Dark Mode</span>
                <span className="text-xs text-purple-300">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-sm text-slate-400">Light Mode</span>
                <span className="text-xs text-slate-600">Coming soon</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Language & Region</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Language</label>
                <select className="input-dark">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Timezone</label>
                <select className="input-dark">
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
