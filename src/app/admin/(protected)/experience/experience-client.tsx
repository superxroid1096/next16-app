"use client";

import { useActionState, useState } from "react";
import {
  createExperienceAction,
  deleteExperienceAction,
} from "@/lib/actions/experience";
import { BilingualInput } from "@/components/admin/bilingual-input";
import type { ExperienceDTO } from "@/lib/data/dto";

export function ExperienceClient({
  initialExperiences,
}: {
  initialExperiences: ExperienceDTO[];
}) {
  const [createState, createAction, isCreating] = useActionState(
    createExperienceAction,
    null
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الخبرة؟")) return;
    setIsDeleting(id);
    await deleteExperienceAction(id);
    setIsDeleting(null);
  };

  return (
    <div className="space-y-8">
      {/* Create New Experience Card */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          إضافة خبرة عملية جديدة
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
            label="اسم الشركة / الجهة"
            namePrefix="company"
            required
            placeholderAr="مثال: شركة الحلول المتقدمة"
            placeholderEn="e.g. Advanced Tech Solutions"
          />

          <BilingualInput
            label="المسمى الوظيفي"
            namePrefix="role"
            required
            placeholderAr="مثال: Senior Fullstack Engineer"
            placeholderEn="e.g. Senior Fullstack Engineer"
          />

          <BilingualInput
            label="وصف المسؤوليات والإنجازات"
            namePrefix="description"
            multiline
            rows={3}
            placeholderAr="تفاصيل المهام التي قمت بها والتقنيات المستخدمة..."
            placeholderEn="Key responsibilities, achievements, and impact..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
                تاريخ البداية
              </label>
              <input
                type="date"
                name="startDate"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
                تاريخ النهاية
              </label>
              <input
                type="date"
                name="endDate"
                disabled={isCurrent}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm disabled:opacity-40"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <span className="text-xs text-[var(--color-fg-muted)]">
                  أعمل هنا حالياً (حتى الآن)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              الترتيب
            </label>
            <input
              type="number"
              name="order"
              defaultValue={initialExperiences.length}
              className="w-28 px-3 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isCreating ? "جاري الإضافة..." : "إضافة الخبرة"}
          </button>
        </form>
      </div>

      {/* List Existing Experiences */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-fg)]">
          الخبرات المسجلة ({initialExperiences.length})
        </h2>

        {initialExperiences.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]">
            لا توجد خبرات مضافة بعد.
          </div>
        ) : (
          <div className="space-y-4">
            {initialExperiences.map((exp) => (
              <div
                key={exp._id}
                className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-base text-[var(--color-fg)]">
                      {exp.role.ar || exp.role.en}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[var(--color-accent)] font-medium">
                      {exp.company.ar || exp.company.en}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-fg-muted)] mb-2">
                    {new Date(exp.startDate).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "short",
                    })}{" "}
                    —{" "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                        })
                      : "حتى الآن"}
                  </p>

                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed max-w-2xl">
                    {exp.description.ar || exp.description.en}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(exp._id)}
                    disabled={isDeleting === exp._id}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-500/10 font-medium transition-colors cursor-pointer"
                  >
                    {isDeleting === exp._id ? "جاري الحذف..." : "حذف"}
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
