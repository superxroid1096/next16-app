/**
 * Data Transfer Objects (DTOs) and converters.
 * Ensures all data leaving the database layer is a plain, serializable object
 * with _id converted to string and Dates converted to ISO strings.
 */

export interface L10nDTO {
  ar: string;
  en: string;
}

export interface SiteSettingsDTO {
  _id: string;
  name: L10nDTO;
  jobTitle: L10nDTO;
  headline: L10nDTO;
  bio: L10nDTO;
  avatarUrl: string;
  avatarPublicId: string;
  availableForWork: boolean;
  availabilityNote: L10nDTO;
  whatsapp: string;
  email: string;
  linkedIn: string;
  github: string;
  extraLinks: Array<{
    label: L10nDTO;
    url: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectImageDTO {
  _id: string;
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  alt: L10nDTO;
  isCover: boolean;
  order: number;
}

export interface ProjectDTO {
  _id: string;
  slug: string;
  title: L10nDTO;
  summary: L10nDTO;
  description: L10nDTO;
  role: L10nDTO;
  challenge: L10nDTO;
  solution: L10nDTO;
  result: L10nDTO;
  techs: string[];
  githubUrl: string;
  liveUrl: string;
  modes: ("hire" | "client" | "tech")[];
  featured: boolean;
  status: "draft" | "published";
  order: number;
  images: ProjectImageDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillGroupDTO {
  _id: string;
  name: L10nDTO;
  items: string[];
  order: number;
  createdAt?: string;
}

export interface ExperienceDTO {
  _id: string;
  company: L10nDTO;
  role: L10nDTO;
  description: L10nDTO;
  startDate: string;
  endDate: string | null;
  order: number;
  createdAt?: string;
}

export interface CertificateDTO {
  _id: string;
  title: L10nDTO;
  issuer: L10nDTO;
  date: string;
  verifyUrl: string;
  order: number;
  createdAt?: string;
}

export interface FeedbackDTO {
  _id: string;
  name: string;
  roleOrCompany: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  locale: "ar" | "en";
  createdAt: string;
}

// Helpers for safe conversion
function safeL10n(val?: { ar?: string; en?: string } | null): L10nDTO {
  return {
    ar: typeof val?.ar === "string" ? val.ar : "",
    en: typeof val?.en === "string" ? val.en : "",
  };
}

function toIsoString(dateVal?: unknown): string {
  if (!dateVal) return new Date().toISOString();
  if (dateVal instanceof Date) return dateVal.toISOString();
  if (typeof dateVal === "string") return dateVal;
  return new Date(String(dateVal)).toISOString();
}

export function toSiteSettingsDTO(doc: any): SiteSettingsDTO {
  if (!doc) {
    return {
      _id: "",
      name: { ar: "", en: "" },
      jobTitle: { ar: "", en: "" },
      headline: { ar: "", en: "" },
      bio: { ar: "", en: "" },
      avatarUrl: "",
      avatarPublicId: "",
      availableForWork: true,
      availabilityNote: { ar: "", en: "" },
      whatsapp: "",
      email: "",
      linkedIn: "",
      github: "",
      extraLinks: [],
    };
  }

  return {
    _id: String(doc._id ?? ""),
    name: safeL10n(doc.name),
    jobTitle: safeL10n(doc.jobTitle),
    headline: safeL10n(doc.headline),
    bio: safeL10n(doc.bio),
    avatarUrl: doc.avatarUrl ?? "",
    avatarPublicId: doc.avatarPublicId ?? "",
    availableForWork: Boolean(doc.availableForWork ?? true),
    availabilityNote: safeL10n(doc.availabilityNote),
    whatsapp: doc.whatsapp ?? "",
    email: doc.email ?? "",
    linkedIn: doc.linkedIn ?? "",
    github: doc.github ?? "",
    extraLinks: Array.isArray(doc.extraLinks)
      ? doc.extraLinks.map((link: any) => ({
          label: safeL10n(link?.label),
          url: link?.url ?? "",
        }))
      : [],
    createdAt: doc.createdAt ? toIsoString(doc.createdAt) : undefined,
    updatedAt: doc.updatedAt ? toIsoString(doc.updatedAt) : undefined,
  };
}

export function toProjectImageDTO(img: any): ProjectImageDTO {
  return {
    _id: String(img._id ?? ""),
    publicId: img.publicId ?? "",
    url: img.url ?? "",
    width: typeof img.width === "number" ? img.width : undefined,
    height: typeof img.height === "number" ? img.height : undefined,
    alt: safeL10n(img.alt),
    isCover: Boolean(img.isCover),
    order: Number(img.order ?? 0),
  };
}

export function toProjectDTO(doc: any): ProjectDTO {
  return {
    _id: String(doc._id ?? ""),
    slug: doc.slug ?? "",
    title: safeL10n(doc.title),
    summary: safeL10n(doc.summary),
    description: safeL10n(doc.description),
    role: safeL10n(doc.role),
    challenge: safeL10n(doc.challenge),
    solution: safeL10n(doc.solution),
    result: safeL10n(doc.result),
    techs: Array.isArray(doc.techs) ? doc.techs.map(String) : [],
    githubUrl: doc.githubUrl ?? "",
    liveUrl: doc.liveUrl ?? "",
    modes: Array.isArray(doc.modes) ? doc.modes : [],
    featured: Boolean(doc.featured),
    status: doc.status === "published" ? "published" : "draft",
    order: Number(doc.order ?? 0),
    images: Array.isArray(doc.images)
      ? doc.images.map(toProjectImageDTO).sort((a: ProjectImageDTO, b: ProjectImageDTO) => a.order - b.order)
      : [],
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}

export function toSkillGroupDTO(doc: any): SkillGroupDTO {
  return {
    _id: String(doc._id ?? ""),
    name: safeL10n(doc.name),
    items: Array.isArray(doc.items) ? doc.items.map(String) : [],
    order: Number(doc.order ?? 0),
    createdAt: doc.createdAt ? toIsoString(doc.createdAt) : undefined,
  };
}

export function toExperienceDTO(doc: any): ExperienceDTO {
  return {
    _id: String(doc._id ?? ""),
    company: safeL10n(doc.company),
    role: safeL10n(doc.role),
    description: safeL10n(doc.description),
    startDate: toIsoString(doc.startDate),
    endDate: doc.endDate ? toIsoString(doc.endDate) : null,
    order: Number(doc.order ?? 0),
    createdAt: doc.createdAt ? toIsoString(doc.createdAt) : undefined,
  };
}

export function toCertificateDTO(doc: any): CertificateDTO {
  return {
    _id: String(doc._id ?? ""),
    title: safeL10n(doc.title),
    issuer: safeL10n(doc.issuer),
    date: toIsoString(doc.date),
    verifyUrl: doc.verifyUrl ?? "",
    order: Number(doc.order ?? 0),
    createdAt: doc.createdAt ? toIsoString(doc.createdAt) : undefined,
  };
}

export function toFeedbackDTO(doc: any): FeedbackDTO {
  return {
    _id: String(doc._id ?? ""),
    name: doc.name ?? "",
    roleOrCompany: doc.roleOrCompany ?? "",
    message: doc.message ?? "",
    status: doc.status ?? "pending",
    locale: doc.locale === "en" ? "en" : "ar",
    createdAt: toIsoString(doc.createdAt),
  };
}
