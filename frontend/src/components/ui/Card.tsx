"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = false, gradient = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card${hover ? "-hover" : ""} p-5 ${gradient ? "gradient-border" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, color = "#6C5CE7" }: StatCardProps) {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </Card>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "primary" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variantClass = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    primary: "badge-primary",
    default: "badge bg-white/5 text-slate-300",
  }[variant];

  return <span className={variantClass}>{children}</span>;
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {headers.map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">{children}</tbody>
      </table>
    </div>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const sizeClass = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" }[size];
  const colors = ["#6C5CE7", "#00CEC9", "#FD79A8", "#00B894", "#FDCB6E"];
  const bg = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className={`${sizeClass} rounded-xl flex items-center justify-center font-bold text-white shrink-0`}
         style={{ background: `linear-gradient(135deg, ${bg}, ${bg}99)` }}>
      {initials}
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-slate-500" style={{ background: "rgba(255,255,255,0.04)" }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );
}
