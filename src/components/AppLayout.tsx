import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Grid background for inner app too */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <AppSidebar />
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
