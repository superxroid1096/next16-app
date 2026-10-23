"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/lib/db/models/site-settings";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { siteSettingsSchema } from "@/lib/validation/site-settings";
import { tags } from "@/lib/tags";

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateProfileSettingsAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) {
    return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  await connectDB();
  const existing = await SiteSettings.findOne();

  const rawData = {
    name: {
      ar: String(formData.get("name.ar") || ""),
      en: String(formData.get("name.en") || ""),
    },
    jobTitle: {
      ar: String(formData.get("jobTitle.ar") || ""),
      en: String(formData.get("jobTitle.en") || ""),
    },
    headline: {
      ar: String(formData.get("headline.ar") || ""),
      en: String(formData.get("headline.en") || ""),
    },
    bio: {
      ar: String(formData.get("bio.ar") || ""),
      en: String(formData.get("bio.en") || ""),
    },
    avatarUrl: String(formData.get("avatarUrl") || existing?.avatarUrl || ""),
    avatarPublicId: String(formData.get("avatarPublicId") || existing?.avatarPublicId || ""),
    availableForWork: formData.get("availableForWork") === "on",
    availabilityNote: {
      ar: String(formData.get("availabilityNote.ar") || ""),
      en: String(formData.get("availabilityNote.en") || ""),
    },
    // Preserve contact info
    whatsapp: existing?.whatsapp || "",
    email: existing?.email || "",
    linkedIn: existing?.linkedIn || "",
    github: existing?.github || "",
    extraLinks: existing?.extraLinks || [],
  };

  const parsed = siteSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "بيانات غير صالحة";
    return { success: false, error: firstError };
  }

  if (existing) {
    Object.assign(existing, parsed.data);
    await existing.save();
  } else {
    await SiteSettings.create(parsed.data);
  }

  try {
    updateTag(tags.settings);
  } catch {
    // updateTag only runs inside Server Actions
  }
  revalidatePath("/admin/profile");
  revalidatePath("/");

  return { success: true, message: "تم حفظ بيانات التعريف والنبذة بنجاح" };
}

export async function updateContactSettingsAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) {
    return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  await connectDB();
  const existing = await SiteSettings.findOne();

  // Parse extra links JSON if present
  let extraLinks: Array<{ label: { ar: string; en: string }; url: string }> = [];
  try {
    const rawLinks = formData.get("extraLinksJson");
    if (rawLinks && typeof rawLinks === "string") {
      extraLinks = JSON.parse(rawLinks);
    } else if (existing?.extraLinks) {
      extraLinks = existing.extraLinks;
    }
  } catch {
    extraLinks = [];
  }

  const rawData = {
    // Preserve profile info
    name: existing?.name || { ar: "", en: "" },
    jobTitle: existing?.jobTitle || { ar: "", en: "" },
    headline: existing?.headline || { ar: "", en: "" },
    bio: existing?.bio || { ar: "", en: "" },
    avatarUrl: existing?.avatarUrl || "",
    avatarPublicId: existing?.avatarPublicId || "",
    availableForWork: existing?.availableForWork ?? true,
    availabilityNote: existing?.availabilityNote || { ar: "", en: "" },
    // Updated contact info
    whatsapp: String(formData.get("whatsapp") || ""),
    email: String(formData.get("email") || ""),
    linkedIn: String(formData.get("linkedIn") || ""),
    github: String(formData.get("github") || ""),
    extraLinks,
  };

  const parsed = siteSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "بيانات التواصل غير صالحة";
    return { success: false, error: firstError };
  }

  if (existing) {
    Object.assign(existing, parsed.data);
    await existing.save();
  } else {
    await SiteSettings.create(parsed.data);
  }

  try {
    updateTag(tags.settings);
  } catch {}
  revalidatePath("/admin/contact");
  revalidatePath("/");

  return { success: true, message: "تم حفظ بيانات التواصل بنجاح" };
}
