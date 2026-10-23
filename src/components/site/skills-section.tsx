import type { SkillGroupDTO } from "@/lib/data/dto";

interface SkillsSectionProps {
  skillGroups: SkillGroupDTO[];
  locale: "ar" | "en";
}

export function SkillsSection({ skillGroups, locale }: SkillsSectionProps) {
  const isAr = locale === "ar";

  return (
    <section id="skills" className="section-wrapper py-16 scroll-mt-20">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              {isAr ? "المهارات والتقنيات" : "Core Technologies"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-fg)] mt-1 tracking-tight">
              {isAr ? "الترسانة التقنية والمهارات" : "Technical Stack & Skills"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
            {isAr
              ? "مجموعة الأدوات والمكتبات التي أعتمد عليها في بناء المنتجات الرقمية الحديثة بمقاييس هندسية عالية."
              : "Core technologies, libraries, and workflows I leverage to build production-grade software."}
          </p>
        </div>

        {/* Skill Groups Grid */}
        {skillGroups.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)] font-mono">
            {isAr ? "لم يتم إضافة مهارات بعد." : "No skill groups registered yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillGroups.map((group) => {
              const groupName = isAr
                ? group.name.ar || group.name.en
                : group.name.en || group.name.ar;

              return (
                <div
                  key={group._id}
                  className="relative rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[var(--color-accent)]/10 group flex flex-col justify-between"
                >
                  {/* Top Accent Gradient Line */}
                  <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]/60">
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/25 flex items-center justify-center text-[var(--color-accent)] shrink-0 group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                        {groupName}
                      </h3>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {group.items.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent)]/15 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-all duration-200 inline-flex items-center cursor-default"
                        >
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
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
