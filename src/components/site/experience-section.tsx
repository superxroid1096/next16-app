import type { ExperienceDTO } from "@/lib/data/dto";

interface ExperienceSectionProps {
  experiences: ExperienceDTO[];
  locale: "ar" | "en";
}

export function ExperienceSection({ experiences, locale }: ExperienceSectionProps) {
  const isAr = locale === "ar";

  return (
    <section id="experience" className="section-wrapper py-16 scroll-mt-20">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {isAr ? "المسار المهني" : "Career Path"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-fg)] mt-1">
              {isAr ? "الخبرات والمسار المهني" : "Work Experience"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
            {isAr
              ? "سجل المسار العملي، المسؤوليات، والفرق التي تشرفت بالمساهمة معها."
              : "Timeline of roles, responsibilities, and teams I have contributed to."}
          </p>
        </div>

        {/* Experience Timeline Track */}
        {experiences.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)] font-mono">
            {isAr ? "لم يتم إضافة خبرات بعد." : "No experience entries found."}
          </div>
        ) : (
          <div className="relative ps-6 sm:ps-10 space-y-8 before:absolute before:top-4 before:bottom-4 before:start-2.5 sm:before:start-3.5 before:w-0.5 before:bg-gradient-to-b before:from-[var(--color-accent)] before:via-[var(--color-accent)]/30 before:to-transparent">
            {experiences.map((exp) => {
              const role = isAr ? exp.role.ar || exp.role.en : exp.role.en || exp.role.ar;
              const company = isAr ? exp.company.ar || exp.company.en : exp.company.en || exp.company.ar;
              const desc = isAr ? exp.description.ar || exp.description.en : exp.description.en || exp.description.ar;
              const isCurrent = !exp.endDate;

              const startDateStr = new Date(exp.startDate).toLocaleDateString(
                isAr ? "ar-EG" : "en-US",
                { year: "numeric", month: "short" }
              );
              const endDateStr = exp.endDate
                ? new Date(exp.endDate).toLocaleDateString(
                    isAr ? "ar-EG" : "en-US",
                    { year: "numeric", month: "short" }
                  )
                : isAr
                ? "حتى الآن"
                : "Present";

              return (
                <div key={exp._id} className="relative group">
                  {/* Timeline Milestone Node */}
                  <div className="absolute -start-[21px] sm:-start-[37px] top-6 flex items-center justify-center">
                    {isCurrent ? (
                      <span className="w-3.5 h-3.5 rounded-sm bg-[var(--color-accent)] border-2 border-[var(--color-bg)] rotate-45 shadow-xs"></span>
                    ) : (
                      <span className="w-3 h-3 rounded-sm bg-[var(--color-surface)] border-2 border-[var(--color-border)] rotate-45 group-hover:border-[var(--color-accent)] transition-colors"></span>
                    )}
                  </div>

                  {/* Trajectory Mission Card */}
                  <div className="rounded-2xl p-6 sm:p-7 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 shadow-sm hover:shadow-xl hover:shadow-[var(--color-accent)]/10 transition-all duration-300 space-y-4">
                    {/* Top Metadata Rail */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]/60">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Company Badge */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/25 text-[var(--color-accent)] text-xs font-mono font-bold">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{company}</span>
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-accent)] text-slate-950 font-bold uppercase tracking-wider shadow-xs shadow-[var(--color-accent)]/30">
                            {isAr ? "نشط حالياً" : "ACTIVE ROLE"}
                          </span>
                        )}
                      </div>

                      {/* Date capsule */}
                      <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg-muted)] inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{startDateStr} — {endDateStr}</span>
                      </span>
                    </div>

                    {/* Role Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors tracking-tight">
                        {role}
                      </h3>
                    </div>

                    {/* Description */}
                    {desc && (
                      <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed pt-1">
                        {desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
