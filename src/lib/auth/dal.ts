import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models/admin";

export interface AuthUser {
  adminId: string;
  email: string;
}

/**
 * Data Access Layer (DAL) Session Verification:
 * Primary line of defense for admin-only pages and data fetching.
 * If not authenticated, immediately redirects to /admin/login.
 */
export async function verifySession(): Promise<AuthUser> {
  const session = await getSession();

  if (!session?.adminId) {
    redirect("/admin/login");
  }

  // Verify that admin still exists in DB
  await connectDB();
  const adminExists = await Admin.findById(session.adminId).select("_id email").lean();

  if (!adminExists) {
    redirect("/admin/login");
  }

  return {
    adminId: String(adminExists._id),
    email: adminExists.email,
  };
}

/**
 * Lightweight check for Server Actions.
 * Returns true if session is valid and admin exists, false otherwise.
 */
export async function isActionAuthenticated(): Promise<boolean> {
  const session = await getSession();
  if (!session?.adminId) return false;

  try {
    await connectDB();
    const adminExists = await Admin.findById(session.adminId).select("_id").lean();
    return Boolean(adminExists);
  } catch {
    return false;
  }
}
