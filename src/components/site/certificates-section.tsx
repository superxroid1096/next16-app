import type { CertificateDTO } from "@/lib/data/dto";

interface CertificatesSectionProps {
  certificates: CertificateDTO[];
  locale: "ar" | "en";
}

export function CertificatesSection({
  certificates,
  locale,
}: CertificatesSectionProps) {
  const isAr = locale === "ar";

  return (
    <section id="certificates" className="section-wrapper py-16 scroll-mt-20">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {isAr ? "الاعتمادات والدورات" : "Certifications"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-fg)] mt-1">
              {isAr ? "الشهادات والاعتمادات" : "Certificates & Credentials"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
            {isAr
              ? "الشهادات المهنية والدورات المتخصصة في هندسة البرمجيات والتقنيات السحابية."
              : "Professional certifications and specialized training in software engineering."}
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)] font-mono">
            {isAr ? "لم يتم إضافة شهادات بعد." : "No certificates found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const title = isAr
                ? cert.title.ar || cert.title.en
                : cert.title.en || cert.title.ar;
              const issuer = isAr
                ? cert.issuer.ar || cert.issuer.en
                : cert.issuer.en || cert.issuer.ar;
              const dateStr = new Date(cert.date).toLocaleDateString(
                isAr ? "ar-EG" : "en-US",
                { year: "numeric", month: "short" }
              );
              const hashId = cert._id.slice(-6).toUpperCase();

              return (
                <div
                  key={cert._id}
                  className="rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 shadow-sm hover:shadow-xl hover:shadow-[var(--color-accent)]/10 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Accent Strip */}
                  <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 space-y-4">
                    {/* Header: Shield Icon + Issuer + Date */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/25 flex items-center justify-center text-[var(--color-accent)] shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                          {issuer}
                        </span>
                        <span className="text-xs text-[var(--color-fg-muted)]">
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-lg text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>

                  {/* Verification Footer Link */}
                  <div className="p-6 pt-0">
                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent)]/15 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-xs font-semibold text-[var(--color-accent)] transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{isAr ? "التحقق من صحة الاعتماد" : "Verify Credential"}</span>
                        <span className="transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">↗</span>
                      </a>
                    ) : (
                      <div className="py-2 px-3 text-center text-xs text-[var(--color-fg-muted)] border-t border-[var(--color-border)]/50">
                        {isAr ? "✔ شهادة معتمدة وموثقة" : "✔ Verified Credential"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
