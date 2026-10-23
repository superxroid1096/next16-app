"use client";

import { useState } from "react";
import Link from "next/link";
import {
  deleteProjectAction,
  toggleProjectPublishAction,
} from "@/lib/actions/projects";
import type { ProjectDTO } from "@/lib/data/dto";

export function ProjectsList({ initialProjects }: { initialProjects: ProjectDTO[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: "draft" | "published") => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    setLoadingId(id);
    await toggleProjectPublishAction(id, nextStatus);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع نهائياً؟ سيتم أيضاً حذف صوره المرتبطة من التخزين السحابي.")) {
      return;
    }
    setLoadingId(id);
    await deleteProjectAction(id);
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {initialProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)] space-y-3">
          <p>لا توجد مشاريع مضافة حتى الآن.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-xs font-semibold shadow-xs"
          >
            + إضافة أول مشروع
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialProjects.map((project) => {
            const coverImage = project.images.find((img) => img.isCover) || project.images[0];

            return (
              <div
                key={project._id}
                className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs overflow-hidden flex flex-col justify-between hover:border-[var(--color-border-strong)] transition-all group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-[var(--color-bg-alt)] overflow-hidden">
                    {coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverImage.url}
                        alt={coverImage.alt.ar || project.title.ar}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-fg-subtle)]">
                        بدون صورة
                      </div>
                    )}

                    <div className="absolute top-3 start-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          project.status === "published"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {project.status === "published" ? "منشور" : "مسودة"}
                      </span>

                      {project.featured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                          مميز
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-[var(--color-fg)] line-clamp-1">
                        {project.title.ar || project.title.en}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg-muted)] shrink-0 font-mono">
                        {project.slug}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-fg-muted)] line-clamp-2 leading-relaxed">
                      {project.summary.ar || project.summary.en || project.description.ar}
                    </p>

                    {/* Techs */}
                    {project.techs.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {project.techs.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg-muted)]"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techs.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-[var(--color-fg-subtle)]">
                            +{project.techs.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={loadingId === project._id}
                      onClick={() => handleToggleStatus(project._id, project.status)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                        project.status === "published"
                          ? "text-amber-600 hover:bg-amber-500/10"
                          : "text-emerald-600 hover:bg-emerald-500/10"
                      }`}
                    >
                      {project.status === "published" ? "إلغاء النشر" : "نشر"}
                    </button>

                    <Link
                      href={`/admin/projects/${project._id}/preview`}
                      className="text-xs px-2.5 py-1 rounded-lg text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)] font-medium transition-colors"
                    >
                      معاينة
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/projects/${project._id}`}
                      className="text-xs px-3 py-1 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 font-semibold transition-colors"
                    >
                      تعديل
                    </Link>

                    <button
                      type="button"
                      disabled={loadingId === project._id}
                      onClick={() => handleDelete(project._id)}
                      className="text-xs p-1.5 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                      title="حذف المشروع"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
