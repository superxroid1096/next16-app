import { z } from "zod";
import { l10nSchema, optionalUrlSchema } from "./common";

export const siteSettingsSchema = z.object({
  name: l10nSchema,
  jobTitle: l10nSchema,
  headline: l10nSchema,
  bio: l10nSchema,
  avatarUrl: optionalUrlSchema.default(""),
  avatarPublicId: z.string().trim().default(""),
  availableForWork: z.boolean().default(true),
  availabilityNote: l10nSchema,
  whatsapp: z.string().trim().default(""),
  email: z
    .string()
    .trim()
    .transform((val) => (val === "" ? "" : val))
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Invalid email address",
    })
    .default(""),
  linkedIn: optionalUrlSchema.default(""),
  github: optionalUrlSchema.default(""),
  extraLinks: z
    .array(
      z.object({
        label: l10nSchema,
        url: optionalUrlSchema,
      })
    )
    .default([]),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
