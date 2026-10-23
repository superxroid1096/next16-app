"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  locale: "ar" | "en";
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  action: () => void;
}

export function CommandPalette({ locale }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isAr = locale === "ar";
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const setMode = (mode: string) => {
    if (mode === "default") {
      document.documentElement.removeAttribute("data-mode");
      localStorage.removeItem("visitMode");
    } else {
      document.documentElement.setAttribute("data-mode", mode);
      localStorage.setItem("visitMode", mode);
    }
    setIsOpen(false);
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIsOpen(false);
  };

  const commands: CommandItem[] = [
    // Sections
    {
      id: "nav-projects",
      title: isAr ? "الانتقال إلى المشاريع" : "Go to Projects",
      subtitle: isAr ? "استعراض معرض الأعمال" : "View portfolio work",
      category: isAr ? "الأقسام" : "Sections",
      action: () => {
        window.location.hash = "projects";
        setIsOpen(false);
      },
    },
    {
      id: "nav-skills",
      title: isAr ? "الانتقال إلى المهارات" : "Go to Skills",
      subtitle: isAr ? "الترسانة التقنية والأدوات" : "Tech stack & tools",
      category: isAr ? "الأقسام" : "Sections",
      action: () => {
        window.location.hash = "skills";
        setIsOpen(false);
      },
    },
    {
      id: "nav-experience",
      title: isAr ? "الانتقال إلى الخبرات" : "Go to Experience",
      subtitle: isAr ? "المسار المهني وسجل الوظائف" : "Career path and history",
      category: isAr ? "الأقسام" : "Sections",
      action: () => {
        window.location.hash = "experience";
        setIsOpen(false);
      },
    },
    {
      id: "nav-certificates",
      title: isAr ? "الانتقال إلى الشهادات" : "Go to Certificates",
      subtitle: isAr ? "الاعتمادات المهنية والدورات" : "Credentials & certs",
      category: isAr ? "الأقسام" : "Sections",
      action: () => {
        window.location.hash = "certificates";
        setIsOpen(false);
      },
    },
    {
      id: "nav-feedbacks",
      title: isAr ? "الانتقال إلى آراء الزوار" : "Go to Reviews",
      subtitle: isAr ? "شهادات الزملاء والعملاء" : "Visitor testimonials",
      category: isAr ? "الأقسام" : "Sections",
      action: () => {
        window.location.hash = "feedbacks";
        setIsOpen(false);
      },
    },
    {
      id: "nav-contact",
      title: isAr ? "الانتقال إلى التواصل" : "Go to Contact",
      subtitle: isAr ? "واتساب، إيميل والروابط" : "WhatsApp, email & socials",
      category: isAr ? "الأقسام" : "Sections",
      action: () => {
        window.location.hash = "contact";
        setIsOpen(false);
      },
    },

    // Visit Modes
    {
      id: "mode-hire",
      title: isAr ? "تفعيل وضع: توظيف (Recruiter)" : "Set Mode: Recruiter",
      subtitle: isAr ? "تقديم الخبرات والشهادات والمشاريع" : "Prioritize career & work",
      category: isAr ? "وضع الزيارة" : "Visit Mode",
      action: () => setMode("hire"),
    },
    {
      id: "mode-client",
      title: isAr ? "تفعيل وضع: عميل أعمال (Client)" : "Set Mode: Client",
      subtitle: isAr ? "تقديم الأعمال المنجزة وقنوات التواصل" : "Prioritize work & chat",
      category: isAr ? "وضع الزيارة" : "Visit Mode",
      action: () => setMode("client"),
    },
    {
      id: "mode-tech",
      title: isAr ? "تفعيل وضع: اطلاع تقني (Tech)" : "Set Mode: Tech",
      subtitle: isAr ? "تقديم الكود والتقنيات والهندسة" : "Prioritize code & stack",
      category: isAr ? "وضع الزيارة" : "Visit Mode",
      action: () => setMode("tech"),
    },
    {
      id: "mode-default",
      title: isAr ? "إعادة تعيين الوضع الافتراضي" : "Reset to Default Mode",
      subtitle: isAr ? "الترتيب التلقائي" : "Standard layout",
      category: isAr ? "وضع الزيارة" : "Visit Mode",
      action: () => setMode("default"),
    },

    // Preferences
    {
      id: "pref-theme",
      title: isAr ? "تبديل المظهر (فاتح / داكن)" : "Toggle Theme (Light / Dark)",
      category: isAr ? "التفضيلات" : "Preferences",
      action: toggleTheme,
    },
    {
      id: "pref-lang",
      title: isAr ? "Switch to English" : "التبديل إلى العربية",
      category: isAr ? "التفضيلات" : "Preferences",
      action: () => {
        router.push(isAr ? "/en" : "/");
        setIsOpen(false);
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Modern Sleek Search Bar in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-bg-alt)]/90 hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
        title="Command Palette (Ctrl + K)"
        aria-label={isAr ? "بحث في الموقع" : "Search portfolio"}
      >
        <svg className="w-3.5 h-3.5 text-[var(--color-fg-subtle)] group-hover:text-[var(--color-accent)] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:inline-block text-xs text-[var(--color-fg-subtle)] group-hover:text-[var(--color-fg-muted)] transition-colors w-28 text-start select-none">
          {isAr ? "بحث سريع..." : "Search..."}
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-fg-subtle)] shadow-2xs">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3 bg-[var(--color-bg-alt)]/40">
              <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن قسم، مهارة، أو مشروع... (Esc للإغلاق)" : "Search sections, skills, or projects... (Esc to close)"}
                className="w-full bg-transparent text-sm text-[var(--color-fg)] placeholder-[var(--color-fg-subtle)] focus:outline-none font-medium"
              />
              <span className="text-[10px] font-mono text-[var(--color-fg-subtle)] px-2 py-0.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] select-none">
                ESC
              </span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--color-fg-muted)] space-y-1">
                  <p className="font-semibold">{isAr ? "لا توجد نتائج مطابقة." : "No matching results."}</p>
                  <p className="text-[11px] text-[var(--color-fg-subtle)]">{isAr ? "جرب البحث بكلمات أخرى" : "Try searching with different keywords"}</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="w-full text-start p-3 rounded-2xl hover:bg-[var(--color-bg-alt)] flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-fg-subtle)] shrink-0 group-hover:border-[var(--color-accent)]/30 group-hover:text-[var(--color-accent)] transition-colors">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
