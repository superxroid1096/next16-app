"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "./command-palette";

interface HeaderProps {
  locale: "ar" | "en";
  name: string;
}

export function SiteHeader({ locale, name }: HeaderProps) {
  const isAr = locale === "ar";
  const pathname = usePathname();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Sync theme
    const savedTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const navLinks = [
    { href: "#projects", label: isAr ? "المشاريع" : "Projects" },
    { href: "#skills", label: isAr ? "المهارات" : "Skills" },
    { href: "#experience", label: isAr ? "الخبرات" : "Experience" },
    { href: "#certificates", label: isAr ? "الشهادات" : "Certificates" },
    { href: "#feedbacks", label: isAr ? "الآراء" : "Reviews" },
    { href: "#contact", label: isAr ? "التواصل" : "Contact" },
  ];

  // Language switch target path
  const switchLocaleHref = isAr ? "/en" : "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-surface)]/85 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href={isAr ? "/" : "/en"} className="flex items-center gap-2 group">
          <span className="font-extrabold text-base sm:text-lg text-[var(--color-fg)] tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
            {name || (isAr ? "البورتفوليو" : "Portfolio")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls: Theme, Lang */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Command Palette */}
          <CommandPalette locale={locale} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="تبديل المظهر"
            className="p-2 rounded-xl text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language Switcher */}
          <Link
            href={switchLocaleHref}
            className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-accent)] transition-colors uppercase tracking-wider"
          >
            {isAr ? "EN" : "عربي"}
          </Link>

          {/* Mobile menu hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] cursor-pointer"
            aria-label="القائمة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
