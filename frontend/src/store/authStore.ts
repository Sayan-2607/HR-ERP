"use client";

import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHR: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHR: false,

  setAuth: (user, token, refreshToken) => {
    localStorage.setItem("ws_token", token);
    localStorage.setItem("ws_refresh_token", refreshToken);
    localStorage.setItem("ws_user", JSON.stringify(user));
    const hrRoles = ["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"];
    set({ user, token, isAuthenticated: true, isHR: hrRoles.includes(user.role) });
  },

  logout: () => {
    localStorage.removeItem("ws_token");
    localStorage.removeItem("ws_refresh_token");
    localStorage.removeItem("ws_user");
    set({ user: null, token: null, isAuthenticated: false, isHR: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("ws_token");
    const stored = localStorage.getItem("ws_user");
    if (token && stored) {
      try {
        const user = JSON.parse(stored) as User;
        const hrRoles = ["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"];
        set({ user, token, isAuthenticated: true, isHR: hrRoles.includes(user.role) });
      } catch { /* ignore */ }
    }
  },
}));
