import Link from "next/link";
import { Activity, FlaskConical, Home } from "lucide-react";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-surface px-4 py-5 md:block">
        <Link href="/" className="text-lg font-semibold">
          Ariadne
        </Link>
        <nav className="mt-8 grid gap-1 text-sm">
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted" href="/">
            <Home size={16} aria-hidden="true" />
            Home
          </Link>
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted" href="/dev/smoke">
            <FlaskConical size={16} aria-hidden="true" />
            Dev Smoke
          </Link>
        </nav>
      </aside>
      <div className="md:pl-60">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur">
          <div className="flex items-center gap-2 font-semibold">
            <Activity size={18} aria-hidden="true" />
            AI E2E Automation
          </div>
          <ThemeToggle />
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
