import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/data/admin-queries";
import { ProjectsList } from "./projects-list";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-fg)]">
            إدارة المشاريع
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">
            إضافة وتعديل وحذف المشاريع، وتحديد المشروعات المميزة وأوضاع الزيارة
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold shadow-xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>مشروع جديد</span>
        </Link>
      </div>

      <ProjectsList initialProjects={projects} />
    </div>
  );
}
