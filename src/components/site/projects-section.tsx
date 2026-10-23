import { ProjectCard } from "./project-card";
import type { ProjectDTO } from "@/lib/data/dto";

interface ProjectsSectionProps {
  projects: ProjectDTO[];
  locale: "ar" | "en";
}

export function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const isAr = locale === "ar";

  // Pre-calculate order maps for CSS flex ordering by visit mode
  const hireSorted = [...projects].sort((a, b) => {
    const aHas = a.modes.includes("hire") ? 0 : 1;
    const bHas = b.modes.includes("hire") ? 0 : 1;
    if (aHas !== bHas) return aHas - bHas;
    return a.order - b.order;
  });
  const hireMap = new Map(hireSorted.map((p, idx) => [p._id, idx]));

  const clientSorted = [...projects].sort((a, b) => {
    const aHas = a.modes.includes("client") ? 0 : 1;
    const bHas = b.modes.includes("client") ? 0 : 1;
    if (aHas !== bHas) return aHas - bHas;
    return a.order - b.order;
  });
  const clientMap = new Map(clientSorted.map((p, idx) => [p._id, idx]));

  const techSorted = [...projects].sort((a, b) => {
    const aHas = a.modes.includes("tech") ? 0 : 1;
    const bHas = b.modes.includes("tech") ? 0 : 1;
    if (aHas !== bHas) return aHas - bHas;
    return a.order - b.order;
  });
  const techMap = new Map(techSorted.map((p, idx) => [p._id, idx]));

  return (
    <section id="projects" className="section-wrapper py-16 scroll-mt-20">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {isAr ? "معرض الأعمال" : "Featured Work"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-fg)] mt-1">
              {isAr ? "المشاريع المختارة" : "Selected Projects"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
            {isAr
              ? "مشاريع عملية تركز على الأداء المعماري، قابلية التوسع، وتجربة المستخدم السلسة."
              : "Real-world applications focusing on performance, scalability, and UX excellence."}
          </p>
        </div>

        {/* Projects Grid Container (Flex with CSS order support) */}
        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]">
            {isAr ? "لا توجد مشاريع منشورة حالياً." : "No published projects found."}
          </div>
        ) : (
          <div className="projects-grid flex flex-wrap -m-3">
            {projects.map((project) => (
              <div key={project._id} className="project-card-wrapper w-full md:w-1/2 lg:w-1/3 p-3 flex">
                <ProjectCard
                  project={project}
                  locale={locale}
                  orderHire={hireMap.get(project._id) ?? 0}
                  orderClient={clientMap.get(project._id) ?? 0}
                  orderTech={techMap.get(project._id) ?? 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
