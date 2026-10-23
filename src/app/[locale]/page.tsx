import {
  getSiteSettings,
  getPublishedProjects,
  getSkillGroups,
  getExperiences,
  getCertificates,
  getApprovedFeedbacks,
} from "@/lib/data/public-queries";
import { SiteHeader } from "@/components/site/header";
import { SiteHero } from "@/components/site/hero";
import { ProjectsSection } from "@/components/site/projects-section";
import { SkillsSection } from "@/components/site/skills-section";
import { ExperienceSection } from "@/components/site/experience-section";
import { CertificatesSection } from "@/components/site/certificates-section";
import { FeedbacksSection } from "@/components/site/feedbacks-section";
import { ContactSection } from "@/components/site/contact-section";
import { SiteFooter } from "@/components/site/footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";

  const [
    settings,
    projects,
    skillGroups,
    experiences,
    certificates,
    feedbacks,
  ] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getSkillGroups(),
    getExperiences(),
    getCertificates(),
    getApprovedFeedbacks(locale),
  ]);

  const siteName = locale === "ar"
    ? settings.name.ar || settings.name.en
    : settings.name.en || settings.name.ar;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* Header */}
      <SiteHeader locale={locale} name={siteName} />

      {/* Main Content with dynamic Visit-Mode section ordering */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col">
        <SiteHero settings={settings} projects={projects} locale={locale} />
        <ProjectsSection projects={projects} locale={locale} />
        <SkillsSection skillGroups={skillGroups} locale={locale} />
        <ExperienceSection experiences={experiences} locale={locale} />
        <CertificatesSection certificates={certificates} locale={locale} />
        <FeedbacksSection feedbacks={feedbacks} locale={locale} />
        <ContactSection settings={settings} locale={locale} />
      </main>

      {/* Footer */}
      <SiteFooter name={siteName} locale={locale} />
    </div>
  );
}
