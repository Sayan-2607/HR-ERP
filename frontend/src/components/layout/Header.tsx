"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user, isHR } = useAuthStore();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06]"
            style={{ background: "rgba(10, 10, 26, 0.6)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="input-dark pl-10 pr-4 py-2 w-64 text-sm rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="badge-primary text-xs hidden sm:inline-flex">{isHR ? "HR Admin" : "Employee"}</span>
        <button className="relative p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
             style={{ background: "linear-gradient(135deg, #6C5CE7, #00CEC9)" }}>
          {user?.employee ? `${user.employee.firstName[0]}${user.employee.lastName[0]}` : "WS"}
        </div>
      </div>
    </header>
  );
}
