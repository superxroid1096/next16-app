"use client";

interface BilingualInputProps {
  label: string;
  namePrefix: string;
  arValue?: string;
  enValue?: string;
  onChangeAr?: (val: string) => void;
  onChangeEn?: (val: string) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholderAr?: string;
  placeholderEn?: string;
  errorAr?: string;
  errorEn?: string;
}

export function BilingualInput({
  label,
  namePrefix,
  arValue = "",
  enValue = "",
  onChangeAr,
  onChangeEn,
  required = false,
  multiline = false,
  rows = 3,
  placeholderAr = "",
  placeholderEn = "",
  errorAr,
  errorEn,
}: BilingualInputProps) {
  const isMissingTranslation =
    (arValue.trim() !== "" && enValue.trim() === "") ||
    (enValue.trim() !== "" && arValue.trim() === "");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[var(--color-fg)] flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
        {isMissingTranslation && (
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            تنبيه: النسخة {arValue.trim() === "" ? "العربية" : "الإنجليزية"} غير مكتملة
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Arabic Field (RTL) */}
        <div>
          <div className="relative">
            <span className="absolute top-2.5 start-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)] bg-[var(--color-surface)] px-1 rounded pointer-events-none z-1">
              عربي
            </span>
            {multiline ? (
              <textarea
                name={`${namePrefix}.ar`}
                defaultValue={arValue}
                onChange={(e) => onChangeAr?.(e.target.value)}
                rows={rows}
                dir="rtl"
                placeholder={placeholderAr}
                className="w-full pt-8 pb-3 px-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm transition-all"
              />
            ) : (
              <input
                type="text"
                name={`${namePrefix}.ar`}
                defaultValue={arValue}
                onChange={(e) => onChangeAr?.(e.target.value)}
                dir="rtl"
                placeholder={placeholderAr}
                className="w-full pt-7 pb-2 px-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm transition-all"
              />
            )}
          </div>
          {errorAr && (
            <p className="text-xs text-[var(--color-danger)] mt-1">{errorAr}</p>
          )}
        </div>

        {/* English Field (LTR) */}
        <div>
          <div className="relative">
            <span className="absolute top-2.5 start-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)] bg-[var(--color-surface)] px-1 rounded pointer-events-none z-1">
              EN
            </span>
            {multiline ? (
              <textarea
                name={`${namePrefix}.en`}
                defaultValue={enValue}
                onChange={(e) => onChangeEn?.(e.target.value)}
                rows={rows}
                dir="ltr"
                placeholder={placeholderEn}
                className="w-full pt-8 pb-3 px-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm transition-all"
              />
            ) : (
              <input
                type="text"
                name={`${namePrefix}.en`}
                defaultValue={enValue}
                onChange={(e) => onChangeEn?.(e.target.value)}
                dir="ltr"
                placeholder={placeholderEn}
                className="w-full pt-7 pb-2 px-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm transition-all"
              />
            )}
          </div>
          {errorEn && (
            <p className="text-xs text-[var(--color-danger)] mt-1">{errorEn}</p>
          )}
        </div>
      </div>
    </div>
  );
}
