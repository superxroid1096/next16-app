import { notFound } from "next/navigation";
import { getProjectByIdAdmin } from "@/lib/data/admin-queries";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          تعديل المشروع: {project.title.ar || project.title.en}
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1 font-mono">
          Slug: {project.slug}
        </p>
      </div>

      <ProjectForm initialData={project} isEdit />
    </div>
  );
}
