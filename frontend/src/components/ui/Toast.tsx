"use client";
import { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface Toast { id: string; message: string; type: "success" | "error" | "warning" | "info"; }
interface ToastCtx { toast: (msg: string, type?: Toast["type"]) => void; }
const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = String(Date.now()) + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const rm = (id: string) => setToasts(p => p.filter(t => t.id !== id));
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const colors = { success: "#00B894", error: "#FF7675", warning: "#FDCB6E", info: "#6C5CE7" };
  return (
    <Ctx.Provider value={{ toast: add }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => { const I = icons[t.type]; return (
          <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white shadow-2xl animate-slide-up"
               style={{ background: "rgba(20,20,45,0.96)", border: `1px solid ${colors[t.type]}50`, minWidth: 300 }}>
            <I className="w-5 h-5 shrink-0" style={{ color: colors[t.type] }} />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => rm(t.id)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        );})}
      </div>
    </Ctx.Provider>
  );
}
