import { getAllSkillGroupsAdmin } from "@/lib/data/admin-queries";
import { SkillsClient } from "./skills-client";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getAllSkillGroupsAdmin();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          إدارة المهارات
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          إدارة مجموعات المهارات التقنية والأدوات المكتوبة كنص
        </p>
      </div>

      <SkillsClient initialSkills={skills} />
    </div>
  );
}
