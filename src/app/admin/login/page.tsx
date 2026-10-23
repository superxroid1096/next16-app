"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-[var(--color-accent)] mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-fg)]">
            لوحة التحكم
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">
            تسجيل الدخول للمسؤول لإدارة محتوى البورتفوليو
          </p>
        </div>

        {/* Global Error Banner */}
        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-sm flex items-start gap-3">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-fg)] mb-2"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              dir="ltr"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
            />
            {state?.fieldErrors?.email && (
              <p className="text-xs text-[var(--color-danger)] mt-1">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-fg)] mb-2"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
            />
            {state?.fieldErrors?.password && (
              <p className="text-xs text-[var(--color-danger)] mt-1">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-xl font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-[var(--color-border)]">
          <Link
            href="/"
            className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors inline-flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>العودة إلى الموقع العام</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
