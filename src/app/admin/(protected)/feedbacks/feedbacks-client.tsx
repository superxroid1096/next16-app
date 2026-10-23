"use client";

import { useState } from "react";
import {
  updateFeedbackStatusAction,
  deleteFeedbackAction,
} from "@/lib/actions/feedbacks";
import type { FeedbackDTO } from "@/lib/data/dto";

export function FeedbacksClient({
  initialFeedbacks,
}: {
  initialFeedbacks: FeedbackDTO[];
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = initialFeedbacks.filter((fb) => {
    if (filter === "all") return true;
    return fb.status === filter;
  });

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    setLoadingId(id);
    await updateFeedbackStatusAction(id, status);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرأي نهائياً؟")) return;
    setLoadingId(id);
    await deleteFeedbackAction(id);
    setLoadingId(null);
  };

  const counts = {
    all: initialFeedbacks.length,
    pending: initialFeedbacks.filter((f) => f.status === "pending").length,
    approved: initialFeedbacks.filter((f) => f.status === "approved").length,
    rejected: initialFeedbacks.filter((f) => f.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] w-fit">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[var(--color-accent)] text-white shadow-xs"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          }`}
        >
          الكل ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "pending"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          }`}
        >
          قيد المراجعة ({counts.pending})
        </button>

        <button
          type="button"
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "approved"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          المعتمدة ({counts.approved})
        </button>

        <button
          type="button"
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "rejected"
              ? "bg-red-600 text-white shadow-xs"
              : "text-red-600 dark:text-red-400 hover:bg-red-500/10"
          }`}
        >
          المرفوضة ({counts.rejected})
        </button>
      </div>

      {/* Feedbacks Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]">
          لا توجد آراء مسجلة في هذا القسم.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                {/* Header: Name, Role, Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[var(--color-fg)]">
                      {item.name}
                    </h3>
                    {item.roleOrCompany && (
                      <p className="text-xs text-[var(--color-fg-muted)]">
                        {item.roleOrCompany}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg-muted)]">
                      {item.locale === "ar" ? "عربي" : "EN"}
                    </span>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        item.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : item.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.status === "approved"
                        ? "معتمد"
                        : item.status === "pending"
                        ? "معلق"
                        : "مرفوض"}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-sm text-[var(--color-fg)] leading-relaxed bg-[var(--color-bg-alt)] p-4 rounded-xl border border-[var(--color-border)] whitespace-pre-wrap">
                  {item.message}
                </p>

                <p className="text-[11px] text-[var(--color-fg-subtle)] mt-2">
                  تاريخ الإرسال:{" "}
                  {new Date(item.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.status !== "approved" && (
                    <button
                      type="button"
                      disabled={loadingId === item._id}
                      onClick={() => handleStatusChange(item._id, "approved")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      اعتماد ونشر
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={loadingId === item._id}
                      onClick={() => handleStatusChange(item._id, "rejected")}
                      className="text-xs px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-500/10 font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      رفض
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  disabled={loadingId === item._id}
                  onClick={() => handleDelete(item._id)}
                  className="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-500/10 font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
