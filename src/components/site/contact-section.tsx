import type { SiteSettingsDTO } from "@/lib/data/dto";

interface ContactSectionProps {
  settings: SiteSettingsDTO;
  locale: "ar" | "en";
}

export function ContactSection({ settings, locale }: ContactSectionProps) {
  const isAr = locale === "ar";

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <section id="contact" className="section-wrapper py-20 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
            {isAr ? "قنوات التواصل" : "Get In Touch"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--color-fg)] mt-2">
            {isAr ? "لنبنِ شيئاً استثنائياً معاً" : "Let's Build Something Great"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-fg-muted)] mt-3 leading-relaxed max-w-xl mx-auto">
            {isAr
              ? "سواء كنت ترغب في توظيفي، مناقشة مشروع جديد، أو تبادل الأفكار الهندسية، يسعدني دائماً تواصلك."
              : "Whether you have an exciting project, full-time opportunity, or technical inquiry, my inbox is always open."}
          </p>
        </div>

        {/* Primary Contact Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[var(--color-accent)] hover:opacity-95 text-slate-950 text-sm font-bold transition-all inline-flex items-center gap-2 shadow-md shadow-black/10"
            >
              <svg className="w-4 h-4 fill-slate-950" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.42-.101.825z" />
              </svg>
              <span>{isAr ? "محادثة عبر واتساب" : "Chat on WhatsApp"}</span>
            </a>
          )}

          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
              className="px-6 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-fg)] text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span dir="ltr">{settings.email}</span>
            </a>
          )}
        </div>

        {/* Social / Extra Links */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          {settings.linkedIn && (
            <a
              href={settings.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
            >
              LinkedIn
            </a>
          )}

          {settings.github && (
            <a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
            >
              GitHub
            </a>
          )}

          {settings.extraLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
            >
              {isAr ? link.label.ar || link.label.en : link.label.en || link.label.ar}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
