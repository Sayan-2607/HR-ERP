"use client";

import { useState } from "react";
import { Card, StatCard, Badge, PageHeader, Table, Avatar } from "@/components/ui/Card";
import { Clock, MapPin, Wifi, LogIn, LogOut, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", hours: 8.5 }, { day: "Tue", hours: 9.2 }, { day: "Wed", hours: 8.0 },
  { day: "Thu", hours: 9.1 }, { day: "Fri", hours: 7.5 },
];

const todayTeam = [
  { name: "Priya Sharma", dept: "Engineering", clockIn: "9:02 AM", status: "Present" },
  { name: "Vikram Patel", dept: "Engineering", clockIn: "9:18 AM", status: "Late" },
  { name: "Sneha Joshi", dept: "Design", clockIn: "8:55 AM", status: "Present" },
  { name: "Arjun Mehta", dept: "Engineering", clockIn: "8:45 AM", status: "Present" },
  { name: "Kavya Reddy", dept: "Analytics", clockIn: "--", status: "WFH" },
  { name: "Rahul Singh", dept: "Engineering", clockIn: "10:05 AM", status: "Late" },
];

export default function AttendancePage() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState("");

  const handleClock = () => {
    if (!clockedIn) {
      setClockInTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setClockedIn(true);
    } else {
      setClockedIn(false);
      setClockInTime("");
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Attendance" subtitle="Track your work hours" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Present Today" value="156" icon={<Clock className="w-5 h-5" />} color="#00B894" />
        <StatCard title="Work From Home" value="12" icon={<Wifi className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="Late Arrivals" value="8" icon={<LogIn className="w-5 h-5" />} color="#FDCB6E" />
        <StatCard title="Avg Hours" value="8.4h" icon={<Calendar className="w-5 h-5" />} color="#00CEC9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Clock In/Out */}
        <Card className="text-center">
          <div className="mb-4">
            <p className="text-3xl font-bold text-white font-mono">
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>

          {clockedIn && <p className="text-sm text-emerald-400 mb-3">Clocked in at {clockInTime}</p>}

          <button onClick={handleClock}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    clockedIn ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                              : "btn-primary"}`}>
            {clockedIn ? <><LogOut className="w-4 h-4" /> Clock Out</>
                       : <><LogIn className="w-4 h-4" /> Clock In</>}
          </button>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <MapPin className="w-3 h-3" /> Office - Main Building
          </div>
        </Card>

        {/* Weekly Hours */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">This Week&apos;s Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(20,20,45,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#E2E8F0" }} />
              <Bar dataKey="hours" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team attendance */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">Today&apos;s Team Attendance</h3>
        <Table headers={["Employee", "Department", "Clock In", "Status"]}>
          {todayTeam.map((t, i) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              <td className="py-3 px-3"><div className="flex items-center gap-3"><Avatar name={t.name} size="sm" /><span className="text-sm text-white">{t.name}</span></div></td>
              <td className="py-3 px-3 text-sm text-slate-400">{t.dept}</td>
              <td className="py-3 px-3 text-sm text-slate-300 font-mono">{t.clockIn}</td>
              <td className="py-3 px-3">
                <Badge variant={t.status === "Present" ? "success" : t.status === "Late" ? "warning" : "primary"}>{t.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
