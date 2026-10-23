"use server";

import { revalidatePath, updateTag } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { Feedback } from "@/lib/db/models/feedback";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { submitFeedbackSchema, updateFeedbackStatusSchema } from "@/lib/validation/feedback";
import { checkRateLimit } from "@/lib/rate-limit";
import { tags } from "@/lib/tags";
import { headers } from "next/headers";

export interface FeedbackActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Public action: Visitor submits feedback.
 * Includes anti-spam honeypot, rate limiting, and sets status to "pending".
 */
export async function submitFeedbackAction(
  prevState: FeedbackActionResult | null,
  formData: FormData
): Promise<FeedbackActionResult> {
  const rawData = {
    name: String(formData.get("name") || ""),
    roleOrCompany: String(formData.get("roleOrCompany") || ""),
    message: String(formData.get("message") || ""),
    locale: String(formData.get("locale") || "ar"),
    hp_website: String(formData.get("hp_website") || ""),
  };

  const parsed = submitFeedbackSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "بيانات التقييم غير صالحة",
    };
  }

  // Honeypot check: If filled, bot submitted -> silently succeed without saving
  if (parsed.data.hp_website && parsed.data.hp_website.length > 0) {
    return {
      success: true,
      message: "شكراً لمشاركتك! سيتم مراجعة تقييمك قبل نشره.",
    };
  }

  // Rate limiting by visitor IP (max 3 feedbacks per hour)
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const rateLimitKey = `feedback:${ip}`;

  const rateCheck = await checkRateLimit(rateLimitKey, 3, 60 * 60);
  if (!rateCheck.success) {
    return {
      success: false,
      error: "لقد أرسلت عدة تقييمات مؤخراً. يرجى الانتظار قليلاً قبل المحاولة مجدداً.",
    };
  }

  await connectDB();
  await Feedback.create({
    name: parsed.data.name,
    roleOrCompany: parsed.data.roleOrCompany,
    message: parsed.data.message,
    locale: parsed.data.locale,
    status: "pending",
  });

  return {
    success: true,
    message: "شكراً لمشاركتك رأيك! سيتم مراجعة التقييم ونشره قريباً.",
  };
}

/**
 * Admin action: Approve or Reject a feedback.
 */
export async function updateFeedbackStatusAction(
  id: string,
  status: "approved" | "rejected"
): Promise<FeedbackActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const parsed = updateFeedbackStatusSchema.safeParse({ status });
  if (!parsed.success) return { success: false, error: "حالة غير صالحة" };

  await connectDB();
  await Feedback.findByIdAndUpdate(id, { status });

  try {
    updateTag(tags.feedbacks);
  } catch {}
  revalidatePath("/admin/feedbacks");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true, message: `تم تحديث حالة الرأي إلى: ${status === "approved" ? "معتمد" : "مرفوض"}` };
}

/**
 * Admin action: Delete a feedback.
 */
export async function deleteFeedbackAction(id: string): Promise<FeedbackActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  await connectDB();
  await Feedback.findByIdAndDelete(id);

  try {
    updateTag(tags.feedbacks);
  } catch {}
  revalidatePath("/admin/feedbacks");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true, message: "تم حذف الرأي بنجاح" };
}
