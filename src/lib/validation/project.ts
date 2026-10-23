import { z } from "zod";
import { l10nSchema, optionalUrlSchema, projectStatusEnum, visitModeEnum } from "./common";

export const projectImageSchema = z.object({
  _id: z.string().optional(),
  publicId: z.string().trim().min(1, "Public ID is required"),
  url: z.string().url("Valid image URL is required"),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  alt: l10nSchema.default({ ar: "", en: "" }),
  isCover: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "الاسم اللطيف (slug) مطلوب ويجب أن يكون حرفين على الأقل")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and single hyphens (e.g. my-project)"),
  title: l10nSchema.refine((val) => val.ar.trim().length > 0, {
    message: "عنوان المشروع بالعربية مطلوب",
  }),
  summary: l10nSchema,
  description: l10nSchema,
  role: l10nSchema,
  challenge: l10nSchema,
  solution: l10nSchema,
  result: l10nSchema,
  techs: z.array(z.string().trim()).default([]),
  githubUrl: optionalUrlSchema.default(""),
  liveUrl: optionalUrlSchema.default(""),
  modes: z.array(visitModeEnum).default([]),
  featured: z.boolean().default(false),
  status: projectStatusEnum.default("draft"),
  order: z.number().int().default(0),
  images: z.array(projectImageSchema).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectImageInput = z.infer<typeof projectImageSchema>;
