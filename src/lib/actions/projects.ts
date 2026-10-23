"use server";

import { revalidatePath, updateTag } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { Project } from "@/lib/db/models/project";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { projectSchema } from "@/lib/validation/project";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { tags } from "@/lib/tags";

export interface ProjectActionResult {
  success: boolean;
  message?: string;
  error?: string;
  projectId?: string;
}

export async function createProjectAction(
  rawInput: Record<string, unknown>
): Promise<ProjectActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const parsed = projectSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات المشروع غير صالحة" };
  }

  await connectDB();

  // Check unique slug
  const existingSlug = await Project.findOne({ slug: parsed.data.slug });
  if (existingSlug) {
    return { success: false, error: "هذا الرابط اللطيف (slug) مستخدم بالفعل لمشروع آخر." };
  }

  const project = await Project.create(parsed.data);

  try {
    updateTag(tags.projects);
  } catch {}
  revalidatePath("/admin/projects");
  revalidatePath("/");

  return { success: true, message: "تم إنشاء المشروع بنجاح", projectId: String(project._id) };
}

export async function updateProjectAction(
  id: string,
  rawInput: Record<string, unknown>
): Promise<ProjectActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  const parsed = projectSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "بيانات المشروع غير صالحة" };
  }

  await connectDB();

  // Check unique slug on other projects
  const existingSlug = await Project.findOne({
    slug: parsed.data.slug,
    _id: { $ne: id },
  });
  if (existingSlug) {
    return { success: false, error: "هذا الرابط اللطيف (slug) مستخدم بالفعل لمشروع آخر." };
  }

  const existingProject = await Project.findById(id);
  if (!existingProject) {
    return { success: false, error: "المشروع غير موجود." };
  }

  const oldSlug = existingProject.slug;
  Object.assign(existingProject, parsed.data);
  await existingProject.save();

  try {
    updateTag(tags.projects);
    updateTag(tags.project(oldSlug));
    if (parsed.data.slug !== oldSlug) {
      updateTag(tags.project(parsed.data.slug));
    }
  } catch {}
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath(`/projects/${parsed.data.slug}`);
  revalidatePath("/");

  return { success: true, message: "تم تحديث المشروع بنجاح", projectId: id };
}

export async function deleteProjectAction(id: string): Promise<ProjectActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  await connectDB();
  const project = await Project.findById(id);
  if (!project) return { success: false, error: "المشروع غير موجود" };

  // Delete associated images from Cloudinary
  if (Array.isArray(project.images)) {
    for (const img of project.images) {
      if (img.publicId) {
        await deleteCloudinaryAsset(img.publicId);
      }
    }
  }

  const slug = project.slug;
  await Project.findByIdAndDelete(id);

  try {
    updateTag(tags.projects);
    updateTag(tags.project(slug));
  } catch {}
  revalidatePath("/admin/projects");
  revalidatePath("/");

  return { success: true, message: "تم حذف المشروع بنجاح" };
}

export async function toggleProjectPublishAction(
  id: string,
  newStatus: "draft" | "published"
): Promise<ProjectActionResult> {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) return { success: false, error: "غير مصرح لك بتنفيذ هذه العملية." };

  await connectDB();
  const project = await Project.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );

  if (!project) return { success: false, error: "المشروع غير موجود" };

  try {
    updateTag(tags.projects);
    updateTag(tags.project(project.slug));
  } catch {}
  revalidatePath("/admin/projects");
  revalidatePath("/");

  return {
    success: true,
    message: newStatus === "published" ? "تم نشر المشروع على الموقع العام" : "تم تحويل المشروع إلى مسودة",
  };
}
