"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, hydrate } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === "/login") return <>{children}</>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-ws-dark bg-mesh">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[260px]"}`}>
        <Header onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
