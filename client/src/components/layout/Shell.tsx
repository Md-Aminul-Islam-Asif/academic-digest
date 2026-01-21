import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      {/* Top Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
