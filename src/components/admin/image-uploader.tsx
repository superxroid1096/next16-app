"use client";

import { useState } from "react";
import type { ProjectImageDTO } from "@/lib/data/dto";

interface ImageUploaderProps {
  images: ProjectImageDTO[];
  onChange: (images: ProjectImageDTO[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Get signed params from our backend
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "portfolio/projects" }),
      });

      if (!signRes.ok) {
        throw new Error("فشل في الحصول على تصريح رفع الصور");
      }

      const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

      const uploadedImages: ProjectImageDTO[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          throw new Error(`فشل رفع الصورة: ${file.name}`);
        }

        const data = await uploadRes.json();

        uploadedImages.push({
          _id: `temp_${Date.now()}_${i}`,
          publicId: data.public_id,
          url: data.secure_url,
          width: data.width,
          height: data.height,
          alt: { ar: "", en: "" },
          isCover: images.length === 0 && i === 0, // first image is cover by default
          order: images.length + i,
        });
      }

      onChange([...images, ...uploadedImages]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصور");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const setCover = (index: number) => {
    const next = images.map((img, i) => ({
      ...img,
      isCover: i === index,
    }));
    onChange(next);
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((img) => img.isCover)) {
      next[0].isCover = true;
    }
    onChange(next);
  };

  const updateAlt = (index: number, lang: "ar" | "en", value: string) => {
    const next = [...images];
    next[index] = {
      ...next[index],
      alt: {
        ...next[index].alt,
        [lang]: value,
      },
    };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-fg)]">
            صور المشروع ومعرض الأعمال
          </label>
          <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
            يتم الرفع مباشرة إلى Cloudinary مع تحسين الحجم والصيغة تلقائياً
          </p>
        </div>

        <label className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-xs font-semibold hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
          {isUploading ? (
            <span>جاري الرفع...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ رفع صور</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-[var(--color-danger)]">
          {uploadError}
        </div>
      )}

      {/* Images List */}
      {images.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-[var(--color-border)] text-xs text-[var(--color-fg-muted)] bg-[var(--color-bg-alt)]/50">
          لم يتم رفع صور لهذا المشروع بعد.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.publicId || idx}
              className={`p-3 rounded-2xl bg-[var(--color-bg-alt)] border transition-all flex flex-col gap-3 ${
                img.isCover
                  ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 shadow-xs"
                  : "border-[var(--color-border)]"
              }`}
            >
              {/* Image Preview & Badges */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt?.ar || "صورة المشروع"}
                  className="w-full h-full object-cover"
                />

                {img.isCover && (
                  <span className="absolute top-2 start-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white shadow-xs">
                    صورة الغلاف
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 end-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                  title="حذف الصورة"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Alt texts for accessibility */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="وصف بديل بالعربية (Alt text)"
                  value={img.alt?.ar || ""}
                  onChange={(e) => updateAlt(idx, "ar", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-fg)]"
                />
                <input
                  type="text"
                  placeholder="Alt text in English"
                  value={img.alt?.en || ""}
                  onChange={(e) => updateAlt(idx, "en", e.target.value)}
                  dir="ltr"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-fg)]"
                />
              </div>

              {/* Actions */}
              {!img.isCover && (
                <button
                  type="button"
                  onClick={() => setCover(idx)}
                  className="text-[11px] py-1.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-border)] font-medium transition-colors cursor-pointer"
                >
                  تعيين كصورة غلاف
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
