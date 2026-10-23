import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getSiteSettings } from "@/lib/data/public-queries";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";
  const isAr = locale === "ar";

  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const siteName = isAr
    ? settings.name.ar || settings.name.en
    : settings.name.en || settings.name.ar;

  const title = isAr
    ? project.title.ar || project.title.en
    : project.title.en || project.title.ar;

  const summary = isAr
    ? project.summary.ar || project.summary.en
    : project.summary.en || project.summary.ar;

  const description = isAr
    ? project.description.ar || project.description.en
    : project.description.en || project.description.ar;

  const role = isAr
    ? project.role.ar || project.role.en
    : project.role.en || project.role.ar;

  const challenge = isAr
    ? project.challenge.ar || project.challenge.en
    : project.challenge.en || project.challenge.ar;

  const solution = isAr
    ? project.solution.ar || project.solution.en
    : project.solution.en || project.solution.ar;

  const result = isAr
    ? project.result.ar || project.result.en
    : project.result.en || project.result.ar;

  const backHref = isAr ? "/#projects" : "/en#projects";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
      <SiteHeader locale={locale} name={siteName} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 w-full py-12 sm:py-16 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href={backHref}
            className="text-xs font-semibold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1.5"
          >
            <span>{isAr ? "← العودة لكافة المشاريع" : "← Back to all projects"}</span>
          </Link>
        </div>

        {/* Project Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.techs.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--color-fg)] tracking-tight leading-tight">
            {title}
          </h1>

          {summary && (
            <p className="text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed">
              {summary}
            </p>
          )}

          {/* External Links */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold transition-all inline-flex items-center gap-2 shadow-xs"
              >
                <span>{isAr ? "معاينة المشروع الحي" : "Live Demo"}</span>
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
                className="px-5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-fg-muted)] text-[var(--color-fg)] text-xs font-semibold transition-all inline-flex items-center gap-2"
              >
                <span>{isAr ? "كود المشروع على GitHub" : "View Source on GitHub"}</span>
              </a>
            )}
          </div>
        </header>

        {/* Image Gallery */}
        {project.images.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((img, i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt[locale] || title}
                    className="w-full aspect-video object-cover"
                  />
                  {img.alt[locale] && (
                    <p className="p-3 text-xs text-[var(--color-fg-muted)] text-center">
                      {img.alt[locale]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Study Deep-Dive */}
        <section className="space-y-8 pt-6 border-t border-[var(--color-border)]">
          {description && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[var(--color-fg)]">
                {isAr ? "عن المشروع" : "Overview"}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {role && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                <h3 className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  {isAr ? "دوري ومسؤولياتي" : "My Role"}
                </h3>
                <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                  {role}
                </p>
              </div>
            )}

            {challenge && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {isAr ? "التحدي التقني" : "The Challenge"}
                </h3>
                <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                  {challenge}
                </p>
              </div>
            )}

            {solution && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {isAr ? "الحل المعماري" : "The Solution"}
                </h3>
                <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                  {solution}
                </p>
              </div>
            )}

            {result && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {isAr ? "الأثر والنتائج" : "Results & Impact"}
                </h3>
                <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                  {result}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter name={siteName} locale={locale} />
    </div>
  );
}
