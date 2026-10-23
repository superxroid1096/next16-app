import Link from "next/link";
import { getAdminOverview } from "@/lib/data/admin-queries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-fg)]">
            نظرة عامة
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">
            ملخص حالة المحتوى والمشاريع والآراء قيد المراجعة
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium shadow-sm transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>مشروع جديد</span>
        </Link>
      </div>

      {/* Pending Feedbacks Alert (if any) */}
      {overview.feedbacks.pending > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">
                لديك {overview.feedbacks.pending} {overview.feedbacks.pending === 1 ? "رأي جديد" : "آراء جديدة"} بانتظار الاعتماد
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                الآراء لن تظهر على الموقع العام حتى تتم مراجعتها واعتمادها من قبلك.
              </p>
            </div>
          </div>
          <Link
            href="/admin/feedbacks"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shrink-0"
          >
            مراجعة الآن
          </Link>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--color-fg-muted)] mb-3">
            <span className="text-sm font-medium">المشاريع</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--color-fg)]">
            {overview.projects.total}
          </div>
          <div className="mt-2 text-xs text-[var(--color-fg-muted)] flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {overview.projects.published} منشور
            </span>
            <span>•</span>
            <span>{overview.projects.draft} مسودة</span>
          </div>
        </div>

        {/* Feedbacks */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--color-fg-muted)] mb-3">
            <span className="text-sm font-medium">آراء الزوار</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--color-fg)]">
            {overview.feedbacks.approved + overview.feedbacks.pending}
          </div>
          <div className="mt-2 text-xs text-[var(--color-fg-muted)] flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {overview.feedbacks.approved} معتمد
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {overview.feedbacks.pending} معلق
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--color-fg-muted)] mb-3">
            <span className="text-sm font-medium">مجموعات المهارات</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--color-fg)]">
            {overview.skillsCount}
          </div>
          <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
            مقسمة لمجموعات نصية
          </p>
        </div>

        {/* Experience & Certs */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--color-fg-muted)] mb-3">
            <span className="text-sm font-medium">الخبرات والشهادات</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--color-fg)]">
            {overview.experiencesCount + overview.certificatesCount}
          </div>
          <div className="mt-2 text-xs text-[var(--color-fg-muted)] flex items-center gap-3">
            <span>{overview.experiencesCount} خبرة عمل</span>
            <span>•</span>
            <span>{overview.certificatesCount} شهادة</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-fg)] mb-4">
          إدارة المحتوى السريع
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/profile"
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all group"
          >
            <h3 className="font-semibold text-sm text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
              التعريف والنبذة الشخصية
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)] mt-1.5 leading-relaxed">
              تعديل الاسم والمسمى الوظيفي والجملة الرئيسية وصورة الملف الشخصي وحالة التوفر.
            </p>
          </Link>

          <Link
            href="/admin/projects"
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all group"
          >
            <h3 className="font-semibold text-sm text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
              إدارة المشاريع
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)] mt-1.5 leading-relaxed">
              إضافة وتعديل وحذف المشاريع، وتحديد المشروعات المميزة وأوضاع الزيارة وترتيبها.
            </p>
          </Link>

          <Link
            href="/admin/contact"
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all group"
          >
            <h3 className="font-semibold text-sm text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
              قنوات التواصل
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)] mt-1.5 leading-relaxed">
              تحديث رقم الواتساب، البريد الإلكتروني، حسابات LinkedIn و GitHub والروابط الإضافية.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
