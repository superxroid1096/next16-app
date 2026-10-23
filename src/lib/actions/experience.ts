"use server";

import { revalidatePath, updateTag } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { Experience } from "@/lib/db/models/experience";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { experienceSchema } from "@/lib/validation/experience";
import { tags } from "@/lib/tags";

export interface ExperienceActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function createExperienceAction(
  prevState: ExperienceActionResult | null,
  formData: FormData
): Promise<ExperienceActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const isCurrent = formData.get("isCurrent") === "on";

  const rawData = {
    company: {
      ar: String(formData.get("company.ar") || ""),
      en: String(formData.get("company.en") || ""),
    },
    role: {
      ar: String(formData.get("role.ar") || ""),
      en: String(formData.get("role.en") || ""),
    },
    description: {
      ar: String(formData.get("description.ar") || ""),
      en: String(formData.get("description.en") || ""),
    },
    startDate: formData.get("startDate"),
    endDate: isCurrent ? null : formData.get("endDate"),
    order: Number(formData.get("order") || 0),
  };

  const parsed = experienceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  await connectDB();
  await Experience.create(parsed.data);

  try {
    updateTag(tags.experience);
  } catch {}
  revalidatePath("/admin/experience");
  revalidatePath("/");

  return { success: true, message: "تمت إضافة الخبرة المهنية بنجاح" };
}

export async function updateExperienceAction(
  id: string,
  formData: FormData
): Promise<ExperienceActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const isCurrent = formData.get("isCurrent") === "on";

  const rawData = {
    company: {
      ar: String(formData.get("company.ar") || ""),
      en: String(formData.get("company.en") || ""),
    },
    role: {
      ar: String(formData.get("role.ar") || ""),
      en: String(formData.get("role.en") || ""),
    },
    description: {
      ar: String(formData.get("description.ar") || ""),
      en: String(formData.get("description.en") || ""),
    },
    startDate: formData.get("startDate"),
    endDate: isCurrent ? null : formData.get("endDate"),
    order: Number(formData.get("order") || 0),
  };

  const parsed = experienceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  await connectDB();
  await Experience.findByIdAndUpdate(id, parsed.data);

  try {
    updateTag(tags.experience);
  } catch {}
  revalidatePath("/admin/experience");
  revalidatePath("/");

  return { success: true, message: "تم تحديث الخبرة بنجاح" };
}

export async function deleteExperienceAction(id: string): Promise<ExperienceActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  await connectDB();
  await Experience.findByIdAndDelete(id);

  try {
    updateTag(tags.experience);
  } catch {}
  revalidatePath("/admin/experience");
  revalidatePath("/");

  return { success: true, message: "تم حذف الخبرة بنجاح" };
}
