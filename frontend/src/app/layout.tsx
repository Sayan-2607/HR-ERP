import type { Metadata } from "next";
import "@/styles/globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "WorkSphere AI — HR Intelligence Platform",
  description: "AI-Powered HR ERP for modern enterprises",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
