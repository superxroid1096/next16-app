import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
        <span className="text-6xl font-extrabold text-[var(--color-accent)] block">
          404
        </span>
        <h1 className="text-2xl font-bold">
          الصفحة غير موجودة | Page Not Found
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو قد تم نقلها.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors shadow-xs"
          >
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
