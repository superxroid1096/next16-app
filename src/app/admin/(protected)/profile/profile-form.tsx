"use client";

import { useActionState } from "react";
import { updateProfileSettingsAction } from "@/lib/actions/site-settings";
import { BilingualInput } from "@/components/admin/bilingual-input";
import type { SiteSettingsDTO } from "@/lib/data/dto";

export function ProfileForm({ initialData }: { initialData: SiteSettingsDTO }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileSettingsAction,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Feedback alerts */}
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

      {/* Basic Profile */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          البيانات الأساسية
        </h2>

        <BilingualInput
          label="الاسم الكامل"
          namePrefix="name"
          arValue={initialData.name.ar}
          enValue={initialData.name.en}
          required
          placeholderAr="مثال: محمد أحمد"
          placeholderEn="e.g. Mohamed Ahmed"
        />

        <BilingualInput
          label="المسمى الوظيفي"
          namePrefix="jobTitle"
          arValue={initialData.jobTitle.ar}
          enValue={initialData.jobTitle.en}
          placeholderAr="مثال: مطور واجهات أمامية"
          placeholderEn="e.g. Frontend Developer"
        />

        <BilingualInput
          label="الجملة الرئيسية (الهيدلاين في الهيرو)"
          namePrefix="headline"
          arValue={initialData.headline.ar}
          enValue={initialData.headline.en}
          placeholderAr="مثال: أبني تطبيقات ويب سريعة وسهلة الاستخدام"
          placeholderEn="e.g. I build fast and user-friendly web apps"
        />

        <BilingualInput
          label="النبذة الشخصية (عنّي)"
          namePrefix="bio"
          arValue={initialData.bio.ar}
          enValue={initialData.bio.en}
          multiline
          rows={4}
          placeholderAr="نبذة تعريفية تركز على شغفك وخبرتك..."
          placeholderEn="A short personal intro focusing on your skills and mindset..."
        />
      </div>

      {/* Availability Status */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          حالة التوفر للعمل
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="availableForWork"
            defaultChecked={initialData.availableForWork}
            className="w-5 h-5 rounded-md text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
          />
          <span className="text-sm font-medium text-[var(--color-fg)]">
            متاح لاستقبال مشاريع وفرص عمل حالياً
          </span>
        </label>

        <BilingualInput
          label="ملاحظة التوفر (تظهر بجانب المؤشر الأخضر)"
          namePrefix="availabilityNote"
          arValue={initialData.availabilityNote.ar}
          enValue={initialData.availabilityNote.en}
          placeholderAr="مثال: متاح للعمل عن بعد أو دوام كامل"
          placeholderEn="e.g. Available for remote or full-time roles"
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}
