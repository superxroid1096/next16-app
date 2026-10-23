"use client";

import { useActionState, useState } from "react";
import {
  createSkillGroupAction,
  deleteSkillGroupAction,
} from "@/lib/actions/skills";
import { BilingualInput } from "@/components/admin/bilingual-input";
import type { SkillGroupDTO } from "@/lib/data/dto";

export function SkillsClient({ initialSkills }: { initialSkills: SkillGroupDTO[] }) {
  const [createState, createAction, isCreating] = useActionState(
    createSkillGroupAction,
    null
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه المجموعة؟")) return;
    setIsDeleting(id);
    await deleteSkillGroupAction(id);
    setIsDeleting(null);
  };

  return (
    <div className="space-y-8">
      {/* Create New Group Card */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          إضافة مجموعة مهارات جديدة
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
            label="اسم المجموعة"
            namePrefix="name"
            required
            placeholderAr="مثال: الواجهة الأمامية"
            placeholderEn="e.g. Frontend"
          />

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              عناصر المهارات (مفصولة بفاصلة إنجليزية ,)
            </label>
            <input
              type="text"
              name="items"
              required
              placeholder="React, Next.js, TypeScript, Tailwind CSS, Redux"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
            <p className="text-xs text-[var(--color-fg-muted)] mt-1">
              المهارات تُعرض كنصوص أنيقة بدون أشرطة تقدم (وفقاً لمحددات التصميم).
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              الترتيب
            </label>
            <input
              type="number"
              name="order"
              defaultValue={initialSkills.length}
              className="w-28 px-3 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isCreating ? "جاري الإضافة..." : "إضافة المجموعة"}
          </button>
        </form>
      </div>

      {/* List Existing Skill Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-fg)]">
          المجموعات الحالية ({initialSkills.length})
        </h2>

        {initialSkills.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]">
            لا توجد مجموعات مهارات بعد. أضف أول مجموعة بالأعلى.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialSkills.map((group) => (
              <div
                key={group._id}
                className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-[var(--color-fg)]">
                        {group.name.ar || group.name.en}
                      </h3>
                      {group.name.en && group.name.ar && (
                        <span className="text-xs text-[var(--color-fg-muted)] font-mono">
                          {group.name.en}
                        </span>
                      )}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] border border-[var(--color-border)]">
                      ترتيب: {group.order}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {group.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-bg-alt)] text-[var(--color-fg)] border border-[var(--color-border)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(group._id)}
                    disabled={isDeleting === group._id}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-500/10 font-medium transition-colors cursor-pointer"
                  >
                    {isDeleting === group._id ? "جاري الحذف..." : "حذف المجموعة"}
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
