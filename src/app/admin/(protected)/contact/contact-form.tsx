"use client";

import { useActionState, useState } from "react";
import { updateContactSettingsAction } from "@/lib/actions/site-settings";
import type { SiteSettingsDTO } from "@/lib/data/dto";

interface ExtraLink {
  label: { ar: string; en: string };
  url: string;
}

export function ContactForm({ initialData }: { initialData: SiteSettingsDTO }) {
  const [state, formAction, isPending] = useActionState(
    updateContactSettingsAction,
    null
  );

  const [extraLinks, setExtraLinks] = useState<ExtraLink[]>(
    initialData.extraLinks || []
  );

  const addLink = () => {
    setExtraLinks([
      ...extraLinks,
      { label: { ar: "", en: "" }, url: "" },
    ]);
  };

  const removeLink = (index: number) => {
    setExtraLinks(extraLinks.filter((_, i) => i !== index));
  };

  const updateLink = (
    index: number,
    field: "ar" | "en" | "url",
    value: string
  ) => {
    const next = [...extraLinks];
    if (field === "url") {
      next[index].url = value;
    } else {
      next[index].label[field] = value;
    }
    setExtraLinks(next);
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden input to pass extraLinks JSON */}
      <input
        type="hidden"
        name="extraLinksJson"
        value={JSON.stringify(extraLinks)}
      />

      {state?.error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
          {state.message}
        </div>
      )}

      {/* Primary Channels */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          القنوات الأساسية
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              رقم الواتساب (مع كود الدولة)
            </label>
            <input
              type="text"
              name="whatsapp"
              defaultValue={initialData.whatsapp}
              dir="ltr"
              placeholder="+201234567890"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              defaultValue={initialData.email}
              dir="ltr"
              placeholder="contact@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              رابط حساب LinkedIn
            </label>
            <input
              type="url"
              name="linkedIn"
              defaultValue={initialData.linkedIn}
              dir="ltr"
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              رابط حساب GitHub
            </label>
            <input
              type="url"
              name="github"
              defaultValue={initialData.github}
              dir="ltr"
              placeholder="https://github.com/username"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Extra Links */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-fg)]">
            روابط إضافية (X, Behance, Dribbble, إلخ)
          </h2>
          <button
            type="button"
            onClick={addLink}
            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 font-semibold transition-colors cursor-pointer"
          >
            + إضافة رابط
          </button>
        </div>

        {extraLinks.length === 0 ? (
          <p className="text-xs text-[var(--color-fg-muted)] py-4 text-center">
            لا توجد روابط إضافية مضافة بعد.
          </p>
        ) : (
          <div className="space-y-3">
            {extraLinks.map((link, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] flex flex-col md:flex-row gap-3 items-start md:items-center"
              >
                <input
                  type="text"
                  placeholder="الاسم بالعربية"
                  value={link.label.ar}
                  onChange={(e) => updateLink(idx, "ar", e.target.value)}
                  className="w-full md:w-1/4 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-fg)]"
                />
                <input
                  type="text"
                  placeholder="Label in English"
                  value={link.label.en}
                  onChange={(e) => updateLink(idx, "en", e.target.value)}
                  dir="ltr"
                  className="w-full md:w-1/4 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-fg)]"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                  dir="ltr"
                  className="w-full md:flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-fg)]"
                />
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                  title="حذف الرابط"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {isPending ? "جاري الحفظ..." : "حفظ بيانات التواصل"}
        </button>
      </div>
    </form>
  );
}
