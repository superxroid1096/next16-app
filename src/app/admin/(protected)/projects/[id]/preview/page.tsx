import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectByIdAdmin } from "@/lib/data/admin-queries";

export const dynamic = "force-dynamic";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>معاينة إدارية للمشروع (حالة المشروع الحالية: {project.status === "published" ? "منشور" : "مسودة"})</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/projects/${project._id}`}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
          >
            تعديل
          </Link>
          <Link
            href="/admin/projects"
            className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            العودة للمشاريع
          </Link>
        </div>
      </div>

      {/* Main Preview Container */}
      <article className="space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.techs.map((tech, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-bg-alt)] border border-[var(--color-border)] font-medium text-[var(--color-fg-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-fg)] leading-tight">
            {project.title.ar || project.title.en}
          </h1>

          {project.title.en && project.title.ar && (
            <p className="text-lg text-[var(--color-fg-muted)] mt-1 font-medium" dir="ltr">
              {project.title.en}
            </p>
          )}

          <p className="text-base text-[var(--color-fg-muted)] mt-4 leading-relaxed max-w-2xl">
            {project.summary.ar || project.summary.en}
          </p>

          <div className="flex items-center gap-4 mt-6">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <span>زيارة المشروع الحي</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-fg-muted)] text-[var(--color-fg)] text-xs font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>المستودع البرمجي (GitHub)</span>
              </a>
            )}
          </div>
        </div>

        {/* Gallery */}
        {project.images.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-fg)]">
              معرض الصور
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt.ar || project.title.ar}
                    className="w-full aspect-video object-cover"
                  />
                  {img.alt.ar && (
                    <p className="p-3 text-xs text-[var(--color-fg-muted)] text-center">
                      {img.alt.ar}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Study Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--color-border)]">
          {project.role.ar && (
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <h3 className="text-sm font-bold text-[var(--color-accent)]">
                دوري في المشروع
              </h3>
              <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                {project.role.ar}
              </p>
            </div>
          )}

          {project.challenge.ar && (
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                التحدي التقني
              </h3>
              <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                {project.challenge.ar}
              </p>
            </div>
          )}

          {project.solution.ar && (
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                الحل الهندسي
              </h3>
              <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                {project.solution.ar}
              </p>
            </div>
          )}

          {project.result.ar && (
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                النتيجة والأثر
              </h3>
              <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                {project.result.ar}
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
