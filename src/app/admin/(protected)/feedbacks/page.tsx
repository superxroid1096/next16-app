import { getFeedbacksAdmin } from "@/lib/data/admin-queries";
import { FeedbacksClient } from "./feedbacks-client";

export const dynamic = "force-dynamic";

export default async function AdminFeedbacksPage() {
  const feedbacks = await getFeedbacksAdmin();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          إدارة آراء الزوار
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          مراجعة التقييمات والآراء الواردة من زوار الموقع، واعتمادها قبل الظهور العام
        </p>
      </div>

      <FeedbacksClient initialFeedbacks={feedbacks} />
    </div>
  );
}
