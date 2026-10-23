import { getAdminSiteSettings } from "@/lib/data/admin-queries";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const settings = await getAdminSiteSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          التعريف والنبذة الشخصية
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          إدارة الاسم، المسمى، الجملة الترويجية في الهيرو، والنبذة ثنائية اللغة
        </p>
      </div>

      <ProfileForm initialData={settings} />
    </div>
  );
}
