"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard, Users, Clock, CalendarOff, Wallet, Briefcase,
  Target, BookOpen, Heart, HelpCircle, BarChart3, Bot, Settings,
  LogOut, ChevronLeft, Sparkles,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "employees", label: "Employee Hub", icon: Users, href: "/employees" },
  { id: "attendance", label: "Attendance", icon: Clock, href: "/attendance" },
  { id: "leave", label: "Leave", icon: CalendarOff, href: "/leave" },
  { id: "payroll", label: "Payroll", icon: Wallet, href: "/payroll" },
  { id: "recruitment", label: "Recruitment", icon: Briefcase, href: "/recruitment" },
  { id: "performance", label: "Performance", icon: Target, href: "/performance" },
  { id: "learning", label: "Learning", icon: BookOpen, href: "/learning" },
  { id: "engagement", label: "Engagement", icon: Heart, href: "/engagement" },
  { id: "helpdesk", label: "Helpdesk", icon: HelpCircle, href: "/helpdesk" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 border-r border-white/[0.06] ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ background: "rgba(10, 10, 26, 0.95)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: "linear-gradient(135deg, #6C5CE7, #00CEC9)" }}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold gradient-text truncate">WorkSphere AI</h1>
            <p className="text-[10px] text-slate-500 tracking-wider">HR INTELLIGENCE</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors shrink-0"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,206,201,0.1))",
                boxShadow: "inset 0 0 0 1px rgba(108,92,231,0.3)",
              } : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-purple-400" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] p-3 shrink-0">
        {!collapsed && user?.employee && (
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                 style={{ background: "linear-gradient(135deg, #6C5CE7, #FD79A8)" }}>
              {user.employee.firstName[0]}{user.employee.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user.employee.firstName} {user.employee.lastName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user.role.replace(/_/g, " ")}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
