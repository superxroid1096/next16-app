"use server";

import { revalidatePath, updateTag } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { Certificate } from "@/lib/db/models/certificate";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { certificateSchema } from "@/lib/validation/certificate";
import { tags } from "@/lib/tags";

export interface CertActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function createCertificateAction(
  prevState: CertActionResult | null,
  formData: FormData
): Promise<CertActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const rawData = {
    title: {
      ar: String(formData.get("title.ar") || ""),
      en: String(formData.get("title.en") || ""),
    },
    issuer: {
      ar: String(formData.get("issuer.ar") || ""),
      en: String(formData.get("issuer.en") || ""),
    },
    date: formData.get("date"),
    verifyUrl: String(formData.get("verifyUrl") || ""),
    order: Number(formData.get("order") || 0),
  };

  const parsed = certificateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  await connectDB();
  await Certificate.create(parsed.data);

  try {
    updateTag(tags.certificates);
  } catch {}
  revalidatePath("/admin/certificates");
  revalidatePath("/");

  return { success: true, message: "تمت إضافة الشهادة بنجاح" };
}

export async function updateCertificateAction(
  id: string,
  formData: FormData
): Promise<CertActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const rawData = {
    title: {
      ar: String(formData.get("title.ar") || ""),
      en: String(formData.get("title.en") || ""),
    },
    issuer: {
      ar: String(formData.get("issuer.ar") || ""),
      en: String(formData.get("issuer.en") || ""),
    },
    date: formData.get("date"),
    verifyUrl: String(formData.get("verifyUrl") || ""),
    order: Number(formData.get("order") || 0),
  };

  const parsed = certificateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  await connectDB();
  await Certificate.findByIdAndUpdate(id, parsed.data);

  try {
    updateTag(tags.certificates);
  } catch {}
  revalidatePath("/admin/certificates");
  revalidatePath("/");

  return { success: true, message: "تم تحديث الشهادة بنجاح" };
}

export async function deleteCertificateAction(id: string): Promise<CertActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  await connectDB();
  await Certificate.findByIdAndDelete(id);

  try {
    updateTag(tags.certificates);
  } catch {}
  revalidatePath("/admin/certificates");
  revalidatePath("/");

  return { success: true, message: "تم حذف الشهادة بنجاح" };
}
