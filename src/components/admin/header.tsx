import { ThemeToggle } from "./theme-toggle";

interface AdminHeaderProps {
  adminEmail: string;
}

export function AdminHeader({ adminEmail }: AdminHeaderProps) {
  return (
    <header className="h-16 px-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
          جلسة نشطة
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-4 w-px bg-[var(--color-border)]" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold text-xs flex items-center justify-center">
            {adminEmail.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-[var(--color-fg-muted)]" dir="ltr">
            {adminEmail}
          </span>
        </div>
      </div>
    </header>
  );
}
