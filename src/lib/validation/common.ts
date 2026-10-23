import { z } from "zod";

/**
 * Common bilingual text schema.
 * All text content in the portfolio has both Arabic and English variants.
 */
export const l10nSchema = z.object({
  ar: z.string().trim().default(""),
  en: z.string().trim().default(""),
});

export const requiredL10nSchema = z.object({
  ar: z.string().trim().min(1, "النص العربي مطلوب"),
  en: z.string().trim().min(1, "English text is required"),
});

export const visitModeEnum = z.enum(["hire", "client", "tech"]);
export type VisitMode = z.infer<typeof visitModeEnum>;

export const projectStatusEnum = z.enum(["draft", "published"]);
export type ProjectStatus = z.infer<typeof projectStatusEnum>;

export const feedbackStatusEnum = z.enum(["pending", "approved", "rejected"]);
export type FeedbackStatus = z.infer<typeof feedbackStatusEnum>;

export const localeEnum = z.enum(["ar", "en"]);
export type Locale = z.infer<typeof localeEnum>;

export const optionalUrlSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? "" : val))
  .refine((val) => val === "" || /^https?:\/\//i.test(val), {
    message: "Must be a valid URL starting with http:// or https://",
  });
