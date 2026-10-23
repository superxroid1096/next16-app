import { getAdminSiteSettings } from "@/lib/data/admin-queries";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const settings = await getAdminSiteSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          قنوات التواصل والروابط
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          إدارة رقم الواتساب، البريد الإلكتروني، الحسابات والروابط الاجتماعية
        </p>
      </div>

      <ContactForm initialData={settings} />
    </div>
  );
}
