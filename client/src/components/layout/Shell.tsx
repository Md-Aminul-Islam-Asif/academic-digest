import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-muted/10">
      <Navigation />
      <main className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  );
}
