"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettingsDTO, ProjectDTO } from "@/lib/data/dto";

interface HeroProps {
  settings: SiteSettingsDTO;
  projects?: ProjectDTO[];
  locale: "ar" | "en";
}

export function SiteHero({ settings, projects = [], locale }: HeroProps) {
  const isAr = locale === "ar";

  const name = isAr ? settings.name.ar || settings.name.en : settings.name.en || settings.name.ar;
  const jobTitle = isAr ? settings.jobTitle.ar || settings.jobTitle.en : settings.jobTitle.en || settings.jobTitle.ar;
  const headline = isAr ? settings.headline.ar || settings.headline.en : settings.headline.en || settings.headline.ar;
  const note = isAr
    ? settings.availabilityNote.ar || settings.availabilityNote.en || "متاح للمشاريع الجديدة"
    : settings.availabilityNote.en || settings.availabilityNote.ar || "Available for high-impact projects";

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : "#contact";

  // Filter & sort: featured first, then others
  const displayProjects = projects.length > 0
    ? [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  const nextProject = () => {
    if (displayProjects.length <= 1) return;
    setSlideDirection("next");
    setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
  };

  const prevProject = () => {
    if (displayProjects.length <= 1) return;
    setSlideDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  const currentProject = displayProjects[currentIndex];

  const projectTitle = currentProject
    ? isAr
      ? currentProject.title.ar || currentProject.title.en
      : currentProject.title.en || currentProject.title.ar
    : "";

  const projectSummary = currentProject
    ? isAr
      ? currentProject.summary.ar || currentProject.summary.en || currentProject.description.ar
      : currentProject.summary.en || currentProject.summary.ar || currentProject.description.en
    : "";

  const coverImage = currentProject
    ? currentProject.images.find((img) => img.isCover) || currentProject.images[0]
    : null;

  const projectHref = currentProject
    ? isAr
      ? `/projects/${currentProject.slug}`
      : `/en/projects/${currentProject.slug}`
    : "#projects";

  return (
    <section className="relative pt-6 pb-16 sm:pt-12 sm:pb-20 overflow-hidden">
      {/* Background Organic Floating Ambient Meshes */}
      <div 
        aria-hidden="true" 
        className="absolute top-8 start-1/4 w-[520px] h-[360px] bg-gradient-to-tr from-[var(--color-accent)]/15 via-[var(--color-accent-hover)]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-ambient-float" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-8 end-8 w-[380px] h-[280px] bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-accent-hover)]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-ambient-float-reverse" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Developer Pitch & Profile */}
        <div className="lg:col-span-7 space-y-6 text-start">
          {/* Status Pill - Clean without small glowing circles */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-fg-muted)] shadow-xs backdrop-blur-md animate-fade-in-up">
            <span className="tracking-wide">
              {note}
            </span>
          </div>

          {/* Engineer Name Tag & Headline */}
          <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase">
              {jobTitle}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--color-fg)] tracking-tight leading-[1.14]">
              {name ? (
                <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]">
                  {name}
                </span>
              ) : null}
              {headline || (isAr ? "أبني حلول ويب متقدمة وسريعة" : "Engineering fast, modern web applications")}
            </h1>
          </div>

          {/* Bio Pitch */}
          <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {isAr
              ? settings.bio.ar || settings.bio.en || "مهندس برمجيات متخصص في بناء تطبيقات ويب تفاعلية وسريعة تركز على النتائج وتجربة المستخدم الممتازة."
              : settings.bio.en || settings.bio.ar || "Software engineer focused on high-performance web applications, resilient architectures, and frictionless UX."}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] hover:opacity-95 text-slate-950 text-sm font-bold tracking-wide transition-all duration-200 shadow-md shadow-[var(--color-accent)]/20 hover:shadow-lg hover:shadow-[var(--color-accent)]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isAr ? "تواصل معي ←" : "Get in Touch →"}
            </a>

            {settings.whatsapp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent)]/15 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-[var(--color-fg)] text-sm font-semibold transition-all duration-200 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-[var(--color-accent)]" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.42-.101.825z" />
                </svg>
                <span>{isAr ? "واتساب مباشر" : "Direct WhatsApp"}</span>
              </a>
            )}

            <a
              href="#projects"
              className="px-5 py-3.5 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-bg-alt)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-fg)] text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isAr ? "معرض الأعمال ↓" : "View All Projects ↓"}
            </a>
          </div>
        </div>

        {/* Right Column: Featured Projects Showcase with Smooth Slide Transitions */}
        <div className="lg:col-span-5 w-full">
          {currentProject ? (
            <div className="rounded-3xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-500 shadow-lg shadow-black/5 dark:shadow-black/30 flex flex-col justify-between group">
              {/* Top Bar with Showcase Header & Next/Previous Controls */}
              <div className="px-5 py-3.5 border-b border-[var(--color-border)]/70 flex items-center justify-between gap-3 bg-[var(--color-bg-alt)]/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-fg)]">
                    {isAr ? "المشاريع المختارة" : "Featured Work"}
                  </span>
                  {currentProject.featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                      {isAr ? "★ مميز" : "★ Featured"}
                    </span>
                  )}
                </div>

                {displayProjects.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevProject}
                      aria-label={isAr ? "المشروع السابق" : "Previous project"}
                      className="w-8 h-8 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-accent)]/15 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-[var(--color-fg)] flex items-center justify-center transition-all cursor-pointer text-xs font-bold shadow-2xs hover:scale-105 active:scale-95"
                    >
                      {isAr ? "→" : "←"}
                    </button>
                    <span className="text-[11px] font-mono text-[var(--color-fg-subtle)] px-1.5">
                      {currentIndex + 1} / {displayProjects.length}
                    </span>
                    <button
                      type="button"
                      onClick={nextProject}
                      aria-label={isAr ? "المشروع التالي" : "Next project"}
                      className="w-8 h-8 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-accent)]/15 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-[var(--color-fg)] flex items-center justify-center transition-all cursor-pointer text-xs font-bold shadow-2xs hover:scale-105 active:scale-95"
                    >
                      {isAr ? "←" : "→"}
                    </button>
                  </div>
                )}
              </div>

              {/* Animated Project Content Container */}
              <div
                key={currentProject._id}
                className={slideDirection === "next" ? "animate-project-next" : "animate-project-prev"}
              >
                {/* Cover Image Frame */}
                <Link href={projectHref} className="block relative aspect-video bg-[#0b0e14] overflow-hidden group/img">
                  {coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverImage.url}
                      alt={coverImage.alt[locale] || projectTitle}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 opacity-95 group-hover/img:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-500 font-mono gap-1.5">
                      <span className="text-[var(--color-accent)]/50 text-3xl font-mono">&#x3c;/&#x3e;</span>
                      <span className="tracking-widest">{isAr ? "معاينة المشروع" : "PROJECT PREVIEW"}</span>
                    </div>
                  )}
                </Link>

                {/* Content Area */}
                <div className="p-5 sm:p-6 space-y-3">
                  {/* Tech Badges */}
                  {currentProject.techs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.techs.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[var(--color-bg-alt)] text-[var(--color-accent)] border border-[var(--color-border)] font-medium"
                        >
                          #{tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-extrabold text-xl text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                    <Link href={projectHref}>{projectTitle}</Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed line-clamp-2">
                    {projectSummary}
                  </p>
                </div>

                {/* Action Links Footer */}
                <div className="p-5 sm:p-6 pt-0 flex items-center justify-between gap-3 border-t border-[var(--color-border)]/60 mt-1">
                  <Link
                    href={projectHref}
                    className="text-xs font-bold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1.5 group/link py-1"
                  >
                    <span>{isAr ? "استعراض تفاصيل المشروع" : "Inspect Case Study"}</span>
                    <span className="transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1">→</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {currentProject.liveUrl && (
                      <a
                        href={currentProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent)]/15 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 text-[var(--color-fg)] text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>{isAr ? "معاينة حية" : "Live Demo"}</span>
                      </a>
                    )}

                    {currentProject.githubUrl && (
                      <a
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all text-xs"
                        title={isAr ? "كود المشروع" : "GitHub Code"}
                        aria-label={isAr ? "كود المشروع" : "GitHub Code"}
                      >
                        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Jump Pill Indicators */}
              {displayProjects.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 px-6 pb-4 pt-1 border-t border-[var(--color-border)]/30">
                  {displayProjects.map((proj, idx) => (
                    <button
                      key={proj._id}
                      type="button"
                      onClick={() => {
                        setSlideDirection(idx >= currentIndex ? "next" : "prev");
                        setCurrentIndex(idx);
                      }}
                      aria-label={`Project ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === idx
                          ? "w-7 bg-[var(--color-accent)]"
                          : "w-2 bg-[var(--color-border)] hover:bg-[var(--color-accent)]/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl p-8 bg-[var(--color-surface)] border border-[var(--color-border)] text-center space-y-3">
              <span className="text-3xl text-[var(--color-accent)]">⚡</span>
              <h3 className="font-bold text-base text-[var(--color-fg)]">
                {isAr ? "المشاريع قيد التحديث" : "Projects Updating"}
              </h3>
              <p className="text-xs text-[var(--color-fg-muted)]">
                {isAr ? "سيتم عرض المشروعات المميزة هنا فور نشرها." : "Featured projects will be highlighted here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
