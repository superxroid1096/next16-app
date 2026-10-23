"use server";

import { revalidatePath, updateTag } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { SkillGroup } from "@/lib/db/models/skill-group";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { skillGroupSchema } from "@/lib/validation/skill-group";
import { tags } from "@/lib/tags";

export interface SkillActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function createSkillGroupAction(
  prevState: SkillActionResult | null,
  formData: FormData
): Promise<SkillActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const rawItems = String(formData.get("items") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const rawData = {
    name: {
      ar: String(formData.get("name.ar") || ""),
      en: String(formData.get("name.en") || ""),
    },
    items: rawItems,
    order: Number(formData.get("order") || 0),
  };

  const parsed = skillGroupSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  await connectDB();
  await SkillGroup.create(parsed.data);

  try {
    updateTag(tags.skills);
  } catch {}
  revalidatePath("/admin/skills");
  revalidatePath("/");

  return { success: true, message: "تمت إضافة مجموعة المهارات بنجاح" };
}

export async function updateSkillGroupAction(
  id: string,
  formData: FormData
): Promise<SkillActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const rawItems = String(formData.get("items") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const rawData = {
    name: {
      ar: String(formData.get("name.ar") || ""),
      en: String(formData.get("name.en") || ""),
    },
    items: rawItems,
    order: Number(formData.get("order") || 0),
  };

  const parsed = skillGroupSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  await connectDB();
  await SkillGroup.findByIdAndUpdate(id, parsed.data);

  try {
    updateTag(tags.skills);
  } catch {}
  revalidatePath("/admin/skills");
  revalidatePath("/");

  return { success: true, message: "تم تحديث مجموعة المهارات بنجاح" };
}

export async function deleteSkillGroupAction(id: string): Promise<SkillActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  await connectDB();
  await SkillGroup.findByIdAndDelete(id);

  try {
    updateTag(tags.skills);
  } catch {}
  revalidatePath("/admin/skills");
  revalidatePath("/");

  return { success: true, message: "تم حذف مجموعة المهارات بنجاح" };
}
