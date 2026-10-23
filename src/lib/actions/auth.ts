"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models/admin";
import { loginSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "البيانات المدخلة غير صحيحة",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  // Rate limiting by client IP
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const rateLimitKey = `login:${ip}`;

  const rateCheck = await checkRateLimit(rateLimitKey, 5, 15 * 60);
  if (!rateCheck.success) {
    return {
      success: false,
      error: "تم تجاوز الحد الأقصى للمحاولات (5 محاولات). برجاء المحاولة بعد 15 دقيقة.",
    };
  }

  await connectDB();
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    return {
      success: false,
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    };
  }

  const isValidPassword = await verifyPassword(password, admin.passwordHash);
  if (!isValidPassword) {
    return {
      success: false,
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    };
  }

  // Clear rate limiting upon successful login
  await resetRateLimit(rateLimitKey);

  // Create session cookie
  await createSession(String(admin._id), admin.email);

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}
