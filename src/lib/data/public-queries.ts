import "server-only";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import {
  SiteSettings,
  Project,
  SkillGroup,
  Experience,
  Certificate,
  Feedback,
} from "@/lib/db/models";
import { tags } from "@/lib/tags";
import {
  toSiteSettingsDTO,
  toProjectDTO,
  toSkillGroupDTO,
  toExperienceDTO,
  toCertificateDTO,
  toFeedbackDTO,
  type SiteSettingsDTO,
  type ProjectDTO,
  type SkillGroupDTO,
  type ExperienceDTO,
  type CertificateDTO,
  type FeedbackDTO,
} from "./dto";

/**
 * Public queries — Cached with Next.js tags.
 * Revalidated via Server Actions using updateTag() or revalidateTag().
 */

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsDTO> => {
    await connectDB();
    const doc = await SiteSettings.findOne().lean();
    return toSiteSettingsDTO(doc);
  },
  ["public-site-settings"],
  { tags: [tags.settings] }
);

export const getPublishedProjects = unstable_cache(
  async (): Promise<ProjectDTO[]> => {
    await connectDB();
    const docs = await Project.find({ status: "published" })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return docs.map(toProjectDTO);
  },
  ["public-projects"],
  { tags: [tags.projects] }
);

export const getProjectBySlug = async (slug: string): Promise<ProjectDTO | null> => {
  const fetcher = unstable_cache(
    async (s: string): Promise<ProjectDTO | null> => {
      await connectDB();
      const doc = await Project.findOne({ slug: s, status: "published" }).lean();
      return doc ? toProjectDTO(doc) : null;
    },
    [`public-project-${slug}`],
    { tags: [tags.projects, tags.project(slug)] }
  );
  return fetcher(slug);
};

export const getSkillGroups = unstable_cache(
  async (): Promise<SkillGroupDTO[]> => {
    await connectDB();
    const docs = await SkillGroup.find().sort({ order: 1 }).lean();
    return docs.map(toSkillGroupDTO);
  },
  ["public-skill-groups"],
  { tags: [tags.skills] }
);

export const getExperiences = unstable_cache(
  async (): Promise<ExperienceDTO[]> => {
    await connectDB();
    const docs = await Experience.find().sort({ order: 1, startDate: -1 }).lean();
    return docs.map(toExperienceDTO);
  },
  ["public-experiences"],
  { tags: [tags.experience] }
);

export const getCertificates = unstable_cache(
  async (): Promise<CertificateDTO[]> => {
    await connectDB();
    const docs = await Certificate.find().sort({ order: 1, date: -1 }).lean();
    return docs.map(toCertificateDTO);
  },
  ["public-certificates"],
  { tags: [tags.certificates] }
);

export const getApprovedFeedbacks = async (locale?: string): Promise<FeedbackDTO[]> => {
  const fetcher = unstable_cache(
    async (loc?: string): Promise<FeedbackDTO[]> => {
      await connectDB();
      const filter: Record<string, unknown> = { status: "approved" };
      if (loc) {
        filter.locale = loc;
      }
      const docs = await Feedback.find(filter)
        .sort({ createdAt: -1 })
        .lean();
      return docs.map(toFeedbackDTO);
    },
    [`public-feedbacks-${locale || "all"}`],
    { tags: [tags.feedbacks] }
  );
  return fetcher(locale);
};
