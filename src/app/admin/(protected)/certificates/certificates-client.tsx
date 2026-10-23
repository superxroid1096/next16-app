"use client";

import { useActionState, useState } from "react";
import {
  createCertificateAction,
  deleteCertificateAction,
} from "@/lib/actions/certificates";
import { BilingualInput } from "@/components/admin/bilingual-input";
import type { CertificateDTO } from "@/lib/data/dto";

export function CertificatesClient({
  initialCertificates,
}: {
  initialCertificates: CertificateDTO[];
}) {
  const [createState, createAction, isCreating] = useActionState(
    createCertificateAction,
    null
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الشهادة؟")) return;
    setIsDeleting(id);
    await deleteCertificateAction(id);
    setIsDeleting(null);
  };

  return (
    <div className="space-y-8">
      {/* Create New Certificate Card */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          إضافة شهادة أو دورة تدريبية
        </h2>

        {createState?.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-sm">
            {createState.error}
          </div>
        )}
        {createState?.success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
            {createState.message}
          </div>
        )}

        <form action={createAction} className="space-y-5">
          <BilingualInput
            label="عنوان الشهادة / الدورة"
            namePrefix="title"
            required
            placeholderAr="مثال: مهندس حلول معتمد من AWS"
            placeholderEn="e.g. AWS Certified Solutions Architect"
          />

          <BilingualInput
            label="الجهة المانحة"
            namePrefix="issuer"
            required
            placeholderAr="مثال: أمازون ويب سيرفيسز (AWS)"
            placeholderEn="e.g. Amazon Web Services"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
                تاريخ الحصول على الشهادة
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
                رابط التحقق (اختياري)
              </label>
              <input
                type="url"
                name="verifyUrl"
                dir="ltr"
                placeholder="https://credly.com/badges/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              الترتيب
            </label>
            <input
              type="number"
              name="order"
              defaultValue={initialCertificates.length}
              className="w-28 px-3 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isCreating ? "جاري الإضافة..." : "إضافة الشهادة"}
          </button>
        </form>
      </div>

      {/* List Existing Certificates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-fg)]">
          الشهادات الحالية ({initialCertificates.length})
        </h2>

        {initialCertificates.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]">
            لا توجد شهادات مضافة بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialCertificates.map((cert) => (
              <div
                key={cert._id}
                className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base text-[var(--color-fg)]">
                      {cert.title.ar || cert.title.en}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] border border-[var(--color-border)] shrink-0">
                      {new Date(cert.date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-fg-muted)] mb-3">
                    جهة الإصدار: {cert.issuer.ar || cert.issuer.en}
                  </p>

                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                    >
                      <span>رابط التحقق</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(cert._id)}
                    disabled={isDeleting === cert._id}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-500/10 font-medium transition-colors cursor-pointer"
                  >
                    {isDeleting === cert._id ? "جاري الحذف..." : "حذف الشهادة"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
