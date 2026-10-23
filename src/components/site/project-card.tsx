import Link from "next/link";
import type { ProjectDTO } from "@/lib/data/dto";

interface ProjectCardProps {
  project: ProjectDTO;
  locale: "ar" | "en";
  orderHire: number;
  orderClient: number;
  orderTech: number;
}

export function ProjectCard({
  project,
  locale,
  orderHire,
  orderClient,
  orderTech,
}: ProjectCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? project.title.ar || project.title.en : project.title.en || project.title.ar;
  const summary = isAr
    ? project.summary.ar || project.summary.en || project.description.ar
    : project.summary.en || project.summary.ar || project.description.en;

  const coverImage = project.images.find((img) => img.isCover) || project.images[0];
  const projectHref = isAr ? `/projects/${project.slug}` : `/en/projects/${project.slug}`;

  const style = {
    "--o-hire": orderHire,
    "--o-client": orderClient,
    "--o-tech": orderTech,
  } as React.CSSProperties;

  return (
    <article
      style={style}
      className="project-card cyber-card flex flex-col justify-between rounded-2xl overflow-hidden group border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-500 w-full bg-[var(--color-surface)] shadow-sm hover:shadow-xl hover:shadow-[var(--color-accent)]/10"
    >
      <div>
        {/* Cover Image Frame */}
        <Link href={projectHref} className="block relative aspect-video bg-[#0b0e14] overflow-hidden group/img">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage.url}
              alt={coverImage.alt[locale] || title}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 opacity-95 group-hover/img:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-500 font-mono gap-1.5">
              <span className="text-[var(--color-accent)]/50 text-3xl font-mono">&#x3c;/&#x3e;</span>
              <span className="tracking-widest">{isAr ? "معاينة المشروع" : "PROJECT PREVIEW"}</span>
            </div>
          )}

          {/* Featured Badge */}
          {project.featured && (
            <span className="absolute top-3 start-3 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[var(--color-accent)] text-slate-950 shadow-md shadow-black/20 uppercase tracking-wider">
              {isAr ? "★ مميز" : "★ FEATURED"}
            </span>
          )}
        </Link>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {/* Tech Badges */}
          {project.techs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techs.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors font-medium"
                >
                  #{tech}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-extrabold text-xl text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
            <Link href={projectHref}>{title}</Link>
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed line-clamp-2">
            {summary}
          </p>
        </div>
      </div>

      {/* Footer Launchpad Dock */}
      <div className="p-5 sm:p-6 pt-0 flex items-center justify-between gap-3 border-t border-[var(--color-border)]/60 mt-2">
        <Link
          href={projectHref}
          className="text-xs font-semibold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1.5 group/link py-1"
        >
          <span>{isAr ? "استعراض الدراسة والمعمارية" : "Inspect Architecture"}</span>
          <span className="transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1">→</span>
        </Link>

        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isAr ? "معاينة حية" : "Live Demo"}
              className="p-2 rounded-xl text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all text-xs font-mono"
              title={isAr ? "معاينة حية" : "Live Demo"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isAr ? "كود المشروع" : "GitHub Code"}
              className="p-2 rounded-xl text-[var(--color-fg-muted)] hover:text-purple-400 hover:bg-purple-500/10 border border-[var(--color-border)] hover:border-purple-500/30 transition-all text-xs font-mono"
              title={isAr ? "كود المشروع" : "GitHub Code"}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
