"use client";

import { useActionState, useRef } from "react";
import { submitFeedbackAction } from "@/lib/actions/feedbacks";
import type { FeedbackDTO } from "@/lib/data/dto";

interface FeedbacksSectionProps {
  feedbacks: FeedbackDTO[];
  locale: "ar" | "en";
}

export function FeedbacksSection({ feedbacks, locale }: FeedbacksSectionProps) {
  const isAr = locale === "ar";
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, null);

  return (
    <section id="feedbacks" className="section-wrapper py-16 scroll-mt-20">
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {isAr ? "شهادات حقيقية" : "Client & Peer Reviews"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-fg)] mt-1">
              {isAr ? "آراء الزملاء والعملاء" : "Visitor Feedback"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
            {isAr
              ? "انطباعات حقيقية من زملاء عمل وعملاء شاركوني تجربة التعاون في تطوير المنتجات."
              : "Authentic testimonials and feedback from colleagues and clients."}
          </p>
        </div>

        {/* Testimonials Grid with Distinct Architectural Style */}
        {feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((fb) => {
              const initial = fb.name.trim().charAt(0).toUpperCase();

              return (
                <div
                  key={fb._id}
                  className="rounded-3xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 shadow-xs hover:shadow-xl hover:shadow-[var(--color-accent)]/5 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Accent Strip */}
                  <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/40 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Top Meta: Quote Icon + Rating */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500">
                        <span>★</span>
                        <span>5.0</span>
                      </div>
                    </div>

                    {/* Feedback Message */}
                    <p className="text-sm sm:text-base text-[var(--color-fg)] leading-relaxed font-normal pt-1">
                      {fb.message}
                    </p>
                  </div>

                  {/* Author Meta Row */}
                  <div className="p-6 sm:p-7 pt-0 border-t border-[var(--color-border)]/50 mt-2">
                    <div className="pt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Initial Avatar Box */}
                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[var(--color-accent)]/40 transition-colors">
                          {initial}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-[var(--color-fg)] truncate group-hover:text-[var(--color-accent)] transition-colors">
                            {fb.name}
                          </h4>
                          {fb.roleOrCompany && (
                            <p className="text-xs text-[var(--color-fg-muted)] truncate">
                              {fb.roleOrCompany}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] text-[var(--color-fg-subtle)] shrink-0 font-medium">
                        {new Date(fb.createdAt).toLocaleDateString(
                          isAr ? "ar-EG" : "en-US",
                          { year: "numeric", month: "short" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback Submission Form */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black text-[var(--color-fg)] tracking-tight">
              {isAr ? "شاركنا رأيك أو تجربتك" : "Leave Your Feedback"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md mx-auto">
              {isAr
                ? "يسعدني دائماً سماع انطباعك عن العمل المشترك أو تجربة استخدام الأنظمة."
                : "I always appreciate honest feedback. Reviews are verified before publication."}
            </p>
          </div>

          {state?.error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-[var(--color-danger)] font-medium">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="p-4 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-xs text-[var(--color-accent)] font-semibold text-center">
              {state.message}
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-4">
            {/* Honeypot field (hidden from real users, filled by bots) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_website">Leave empty</label>
              <input type="text" id="hp_website" name="hp_website" tabIndex={-1} autoComplete="off" />
            </div>

            <input type="hidden" name="locale" value={locale} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-fg)] mb-1.5">
                  {isAr ? "الاسم الكريم *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={isAr ? "مثال: م. أحمد سالم" : "e.g. John Doe"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-sm text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-fg)] mb-1.5">
                  {isAr ? "المسمى أو الشركة (اختياري)" : "Role / Company (Optional)"}
                </label>
                <input
                  type="text"
                  name="roleOrCompany"
                  placeholder={isAr ? "مثال: مدير تقني في X" : "e.g. CTO at Acme"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-sm text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-fg)] mb-1.5">
                {isAr ? "رسالتك أو رأيك *" : "Your Review / Message *"}
              </label>
              <textarea
                name="message"
                required
                rows={3}
                placeholder={isAr ? "اكتب رأيك أو انطباعك هنا (بدون روابط)..." : "Share your feedback here (no links)..."}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-sm text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-slate-950 bg-[var(--color-accent)] hover:opacity-95 transition-all disabled:opacity-50 text-sm shadow-md shadow-black/10 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>
                {isPending
                  ? isAr ? "جاري الإرسال..." : "Sending..."
                  : isAr ? "إرسال التقييم" : "Submit Feedback"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
