"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/lib/api";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "admin" | "employee") => {
    if (role === "admin") { setEmail("admin@worksphere.ai"); setPassword("admin123"); }
    else { setEmail("priya.sharma@worksphere.ai"); setPassword("employee123"); }
  };

  return (
    <div className="min-h-screen bg-ws-dark bg-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-glow"
               style={{ background: "linear-gradient(135deg, #6C5CE7, #00CEC9)" }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">WorkSphere AI</h1>
          <p className="text-slate-400 text-sm mt-1">HR Intelligence Platform</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300" style={{ background: "rgba(255,118,117,0.1)", border: "1px solid rgba(255,118,117,0.2)" }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                     placeholder="your@email.com" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Enter password" className="input-dark pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading || !email || !password}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500 text-center mb-3">Quick demo access</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo("admin")}
                      className="btn-secondary flex-1 text-xs py-2">HR Admin</button>
              <button onClick={() => fillDemo("employee")}
                      className="btn-secondary flex-1 text-xs py-2">Employee</button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">WorkSphere AI © 2026 — All rights reserved</p>
      </div>
    </div>
  );
}
