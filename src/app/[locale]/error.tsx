"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Locale error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold">
            حدث خطأ أثناء تحميل الصفحة
          </h1>
          <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
            حدث خطأ غير متوقع أثناء معالجة طلبك. يمكنك إعادة المحاولة الآن.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            إعادة المحاولة
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-xs font-semibold hover:border-[var(--color-accent)] transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
