import Link from "next/link";

interface FooterProps {
  name: string;
  locale: "ar" | "en";
}

export function SiteFooter({ name, locale }: FooterProps) {
  const isAr = locale === "ar";
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-fg-muted)]">
        <p>
          © {year} {name || (isAr ? "البورتفوليو الشخصي" : "Personal Portfolio")}.{" "}
          {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </p>

        <div className="flex items-center gap-4">
          <a href="#top" className="hover:text-[var(--color-fg)] transition-colors">
            {isAr ? "الرجوع للأعلى ↑" : "Back to top ↑"}
          </a>
          <span>•</span>
          <Link
            href="/admin"
            className="hover:text-[var(--color-fg)] transition-colors"
          >
            {isAr ? "لوحة الإدارة" : "Admin Panel"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
