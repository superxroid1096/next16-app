import { verifySession } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySession();

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader adminEmail={user.email} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
