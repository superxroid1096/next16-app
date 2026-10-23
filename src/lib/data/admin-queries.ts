import "server-only";
import { connectDB } from "@/lib/db/connect";
import {
  SiteSettings,
  Project,
  SkillGroup,
  Experience,
  Certificate,
  Feedback,
} from "@/lib/db/models";
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

export interface AdminOverviewDTO {
  projects: {
    total: number;
    published: number;
    draft: number;
  };
  feedbacks: {
    pending: number;
    approved: number;
    rejected: number;
  };
  skillsCount: number;
  experiencesCount: number;
  certificatesCount: number;
}

/**
 * Admin queries — No caching, always returns the freshest state from MongoDB.
 */

export async function getAdminOverview(): Promise<AdminOverviewDTO> {
  await connectDB();

  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    pendingFeedbacks,
    approvedFeedbacks,
    rejectedFeedbacks,
    skillsCount,
    experiencesCount,
    certificatesCount,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ status: "draft" }),
    Feedback.countDocuments({ status: "pending" }),
    Feedback.countDocuments({ status: "approved" }),
    Feedback.countDocuments({ status: "rejected" }),
    SkillGroup.countDocuments(),
    Experience.countDocuments(),
    Certificate.countDocuments(),
  ]);

  return {
    projects: {
      total: totalProjects,
      published: publishedProjects,
      draft: draftProjects,
    },
    feedbacks: {
      pending: pendingFeedbacks,
      approved: approvedFeedbacks,
      rejected: rejectedFeedbacks,
    },
    skillsCount,
    experiencesCount,
    certificatesCount,
  };
}

export async function getAdminSiteSettings(): Promise<SiteSettingsDTO> {
  await connectDB();
  const doc = await SiteSettings.findOne().lean();
  return toSiteSettingsDTO(doc);
}

export async function getAllProjectsAdmin(): Promise<ProjectDTO[]> {
  await connectDB();
  const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return docs.map(toProjectDTO);
}

export async function getProjectByIdAdmin(id: string): Promise<ProjectDTO | null> {
  await connectDB();
  const doc = await Project.findById(id).lean();
  return doc ? toProjectDTO(doc) : null;
}

export async function getAllSkillGroupsAdmin(): Promise<SkillGroupDTO[]> {
  await connectDB();
  const docs = await SkillGroup.find().sort({ order: 1 }).lean();
  return docs.map(toSkillGroupDTO);
}

export async function getAllExperiencesAdmin(): Promise<ExperienceDTO[]> {
  await connectDB();
  const docs = await Experience.find().sort({ order: 1, startDate: -1 }).lean();
  return docs.map(toExperienceDTO);
}

export async function getAllCertificatesAdmin(): Promise<CertificateDTO[]> {
  await connectDB();
  const docs = await Certificate.find().sort({ order: 1, date: -1 }).lean();
  return docs.map(toCertificateDTO);
}

export async function getFeedbacksAdmin(
  status?: "pending" | "approved" | "rejected"
): Promise<FeedbackDTO[]> {
  await connectDB();
  const filter = status ? { status } : {};
  const docs = await Feedback.find(filter).sort({ createdAt: -1 }).lean();
  return docs.map(toFeedbackDTO);
}
