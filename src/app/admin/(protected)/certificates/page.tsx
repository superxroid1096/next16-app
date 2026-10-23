import { getAllCertificatesAdmin } from "@/lib/data/admin-queries";
import { CertificatesClient } from "./certificates-client";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await getAllCertificatesAdmin();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          إدارة الشهادات والدورات
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          إضافة واعتماد الشهادات المهنية، الجهات المانحة وروابط التحقق
        </p>
      </div>

      <CertificatesClient initialCertificates={certificates} />
    </div>
  );
}
