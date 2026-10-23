"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProjectAction, updateProjectAction } from "@/lib/actions/projects";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { ProjectDTO, ProjectImageDTO } from "@/lib/data/dto";

interface ProjectFormProps {
  initialData?: ProjectDTO;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [titleAr, setTitleAr] = useState(initialData?.title.ar || "");
  const [titleEn, setTitleEn] = useState(initialData?.title.en || "");
  const [summaryAr, setSummaryAr] = useState(initialData?.summary.ar || "");
  const [summaryEn, setSummaryEn] = useState(initialData?.summary.en || "");
  const [descriptionAr, setDescriptionAr] = useState(initialData?.description.ar || "");
  const [descriptionEn, setDescriptionEn] = useState(initialData?.description.en || "");
  const [roleAr, setRoleAr] = useState(initialData?.role.ar || "");
  const [roleEn, setRoleEn] = useState(initialData?.role.en || "");
  const [challengeAr, setChallengeAr] = useState(initialData?.challenge.ar || "");
  const [challengeEn, setChallengeEn] = useState(initialData?.challenge.en || "");
  const [solutionAr, setSolutionAr] = useState(initialData?.solution.ar || "");
  const [solutionEn, setSolutionEn] = useState(initialData?.solution.en || "");
  const [resultAr, setResultAr] = useState(initialData?.result.ar || "");
  const [resultEn, setResultEn] = useState(initialData?.result.en || "");

  const [techsInput, setTechsInput] = useState(initialData?.techs.join(", ") || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "draft");
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [modes, setModes] = useState<("hire" | "client" | "tech")[]>(initialData?.modes || []);
  const [images, setImages] = useState<ProjectImageDTO[]>(initialData?.images || []);

  const handleModeToggle = (mode: "hire" | "client" | "tech") => {
    if (modes.includes(mode)) {
      setModes(modes.filter((m) => m !== mode));
    } else {
      setModes([...modes, mode]);
    }
  };

  const generateSlugFromTitle = () => {
    const source = titleEn || titleAr;
    const generated = source
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (generated) setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      slug: slug.trim(),
      title: { ar: titleAr.trim(), en: titleEn.trim() },
      summary: { ar: summaryAr.trim(), en: summaryEn.trim() },
      description: { ar: descriptionAr.trim(), en: descriptionEn.trim() },
      role: { ar: roleAr.trim(), en: roleEn.trim() },
      challenge: { ar: challengeAr.trim(), en: challengeEn.trim() },
      solution: { ar: solutionAr.trim(), en: solutionEn.trim() },
      result: { ar: resultAr.trim(), en: resultEn.trim() },
      techs: techsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      modes,
      featured,
      status,
      order: Number(order),
      images: images.map((img, i) => ({
        publicId: img.publicId,
        url: img.url,
        width: img.width,
        height: img.height,
        alt: { ar: img.alt.ar || "", en: img.alt.en || "" },
        isCover: img.isCover,
        order: i,
      })),
    };

    try {
      let res;
      if (isEdit && initialData?._id) {
        res = await updateProjectAction(initialData._id, payload);
      } else {
        res = await createProjectAction(payload);
      }

      if (!res.success) {
        setError(res.error || "حدث خطأ أثناء حفظ المشروع");
        setIsSubmitting(false);
      } else {
        router.push("/admin/projects");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {/* Main Info */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          معلومات المشروع الأساسية
        </h2>

        {/* Slug */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[var(--color-fg)]">
              الرابط اللطيف للمشروع (Slug) *
            </label>
            <button
              type="button"
              onClick={generateSlugFromTitle}
              className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
            >
              توليد تلقائي من العنوان
            </button>
          </div>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="my-portfolio-project"
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] font-mono text-sm"
          />
          <p className="text-xs text-[var(--color-fg-muted)] mt-1">
            يُستخدم في الرابط: /projects/{slug || "slug"}
          </p>
        </div>

        <BilingualInput
          label="عنوان المشروع"
          namePrefix="title"
          required
          arValue={titleAr}
          enValue={titleEn}
          onChangeAr={setTitleAr}
          onChangeEn={setTitleEn}
          placeholderAr="مثال: منصة التجارة الإلكترونية"
          placeholderEn="e.g. E-Commerce Platform"
        />

        <BilingualInput
          label="الملخص المختصر (يظهر على كارت المشروع)"
          namePrefix="summary"
          arValue={summaryAr}
          enValue={summaryEn}
          onChangeAr={setSummaryAr}
          onChangeEn={setSummaryEn}
          placeholderAr="جملة واحدة تلخص أهمية المشروع وقيمته..."
          placeholderEn="A punchy one-liner summarizing the project..."
        />

        <BilingualInput
          label="الوصف الكامل للمشروع"
          namePrefix="description"
          multiline
          rows={4}
          arValue={descriptionAr}
          enValue={descriptionEn}
          onChangeAr={setDescriptionAr}
          onChangeEn={setDescriptionEn}
          placeholderAr="شرح مفصل لطبيعة المشروع وأهدافه..."
          placeholderEn="In-depth description of the project goals and architecture..."
        />
      </div>

      {/* Deep Dive Case Study: Role, Challenge, Solution, Result */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-[var(--color-fg)]">
            دراسة الحالة التفصيلية (Case Study)
          </h2>
          <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
            تظهر داخل صفحة تفاصيل المشروع لتقديم قيمة تقنية وعملية مقنعة للعملاء ومسؤولي التوظيف
          </p>
        </div>

        <BilingualInput
          label="دوري في المشروع (My Role)"
          namePrefix="role"
          arValue={roleAr}
          enValue={roleEn}
          onChangeAr={setRoleAr}
          onChangeEn={setRoleEn}
          placeholderAr="مثال: هندسة الواجهات، ضبط الأداء وربط واجهات الـ API"
          placeholderEn="e.g. Lead Frontend Architecture & Performance Optimization"
        />

        <BilingualInput
          label="التحدي (The Challenge)"
          namePrefix="challenge"
          multiline
          rows={3}
          arValue={challengeAr}
          enValue={challengeEn}
          onChangeAr={setChallengeAr}
          onChangeEn={setChallengeEn}
          placeholderAr="ما المشكلة أو التحدي التقني الذي كان يواجه المشروع؟"
          placeholderEn="What was the core problem or bottleneck?"
        />

        <BilingualInput
          label="الحل الهندسي (The Solution)"
          namePrefix="solution"
          multiline
          rows={3}
          arValue={solutionAr}
          enValue={solutionEn}
          onChangeAr={setSolutionAr}
          onChangeEn={setSolutionEn}
          placeholderAr="كيف بنيت الحل التقني وتغلبت على العقبات؟"
          placeholderEn="How did you engineer the solution?"
        />

        <BilingualInput
          label="النتيجة والأثر (The Result & Impact)"
          namePrefix="result"
          multiline
          rows={3}
          arValue={resultAr}
          enValue={resultEn}
          onChangeAr={setResultAr}
          onChangeEn={setResultEn}
          placeholderAr="ما الأثر الملموس بعد الإطلاق؟ (أرقام، تسريع الأداء، نجاح الاستخدام)"
          placeholderEn="Quantifiable impact, metrics, or performance improvements..."
        />
      </div>

      {/* Techs & Links */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          التقنيات والروابط
        </h2>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
            التقنيات المستخدمة (مفصولة بفاصلة ,)
          </label>
          <input
            type="text"
            value={techsInput}
            onChange={(e) => setTechsInput(e.target.value)}
            placeholder="Next.js 16, TypeScript, MongoDB, Tailwind CSS, Motion"
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              رابط المستودع البرمجي (GitHub)
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
              رابط المعاينة المباشرة (Live Demo)
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Categorization & Visibility */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[var(--color-fg)]">
          أوضاع الزيارة والنشر
        </h2>

        {/* Visit Modes */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-fg)] mb-2">
            الأوضاع ذات الصلة بالمشروع (Visit Modes)
          </label>
          <p className="text-xs text-[var(--color-fg-muted)] mb-3">
            المشاريع الموسومة بالوضع المختار تظهر في مقدمة المعرض عند تحديد الزائر لغرض زيارته.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "hire", label: "مسؤول توظيف (Hire / Recruiter)" },
              { id: "client", label: "عميل أعمال (Client / Business)" },
              { id: "tech", label: "مطور تقني (Tech / Peer)" },
            ].map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                  modes.includes(m.id as any)
                    ? "bg-blue-500/10 border-[var(--color-accent)] text-[var(--color-accent)] font-semibold"
                    : "bg-[var(--color-bg-alt)] border-[var(--color-border)] text-[var(--color-fg)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={modes.includes(m.id as any)}
                  onChange={() => handleModeToggle(m.id as any)}
                  className="rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Options: Featured, Status, Order */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3 border-t border-[var(--color-border)]">
          <label className="flex items-center gap-2.5 cursor-pointer self-center">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="text-sm font-medium text-[var(--color-fg)]">
              مشروع مميز (Featured)
            </span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-fg)] mb-1.5">
              حالة المشروع
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-sm text-[var(--color-fg)]"
            >
              <option value="draft">مسودة (Draft) - مخفي عن الموقع العام</option>
              <option value="published">منشور (Published) - متاح للجميع</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-fg)] mb-1.5">
              ترتيب الظهور
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-sm text-[var(--color-fg)]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors cursor-pointer"
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {isSubmitting ? "جاري الحفظ..." : isEdit ? "تحديث المشروع" : "إنشاء المشروع"}
        </button>
      </div>
    </form>
  );
}
