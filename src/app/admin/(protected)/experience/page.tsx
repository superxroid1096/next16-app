import { getAllExperiencesAdmin } from "@/lib/data/admin-queries";
import { ExperienceClient } from "./experience-client";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await getAllExperiencesAdmin();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          إدارة الخبرات المهنية
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          إضافة وتعديل سجل المسار المهني، الشركات، التواريخ والمسؤوليات
        </p>
      </div>

      <ExperienceClient initialExperiences={experiences} />
    </div>
  );
}
