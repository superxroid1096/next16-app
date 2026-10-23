import "server-only";
import { Schema, model, models } from "mongoose";

/**
 * Reusable bilingual field definition.
 * Every text field in the portfolio has ar + en versions.
 */
const l10n = {
  ar: { type: String, default: "" },
  en: { type: String, default: "" },
};

/**
 * SiteSettings — single document holding profile, hero, and contact info.
 */
const siteSettingsSchema = new Schema(
  {
    // Profile / Hero
    name: l10n,
    jobTitle: l10n,
    headline: l10n, // the main one-liner
    bio: l10n,
    avatarUrl: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },

    // Availability
    availableForWork: { type: Boolean, default: true },
    availabilityNote: l10n,

    // Contact links
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    extraLinks: [
      {
        label: l10n,
        url: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true, collection: "sitesettings" }
);

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", siteSettingsSchema);
