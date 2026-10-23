"use client";

import { useState, useRef, useEffect } from "react";
import type { SiteSettingsDTO } from "@/lib/data/dto";

interface CyberTerminalProps {
  settings: SiteSettingsDTO;
  locale: "ar" | "en";
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export function CyberTerminal({ settings, locale }: CyberTerminalProps) {
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = useState<"terminal" | "brief">("terminal");
  const [inputVal, setInputVal] = useState("");
  
  // Client Brief State
  const [briefType, setBriefType] = useState("web-app");
  const [briefTimeline, setBriefTimeline] = useState("flexible");

  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: "sysinfo --status",
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400">✔ SYSTEM INITIALIZED: v2.4.0-stable</p>
          <p className="text-emerald-300">
            ENGINEER: <span className="text-white font-semibold">{isAr ? settings.name.ar || settings.name.en : settings.name.en || settings.name.ar}</span>
          </p>
          <p className="text-purple-300">
            ROLE: <span className="text-slate-300">{isAr ? settings.jobTitle.ar || settings.jobTitle.en : settings.jobTitle.en || settings.jobTitle.ar}</span>
          </p>
          <p className="text-slate-400">
            STATUS: <span className="text-emerald-400 font-bold">READY FOR NEW CLIENT WORK</span>
          </p>
        </div>
      ),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    let output: React.ReactNode = null;

    if (cleanCmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (cleanCmd === "help") {
      output = (
        <div className="text-xs space-y-1 text-slate-300">
          <p className="text-emerald-400 font-bold">AVAILABLE COMMANDS:</p>
          <p><span className="text-emerald-400 font-mono">projects</span> - View featured work & case studies</p>
          <p><span className="text-emerald-400 font-mono">stack</span> - Inspect technical weapons & frameworks</p>
          <p><span className="text-emerald-400 font-mono">contact</span> - Retrieve direct communication protocols</p>
          <p><span className="text-emerald-400 font-mono">hire</span> - Instant collaboration dispatch</p>
          <p><span className="text-emerald-400 font-mono">clear</span> - Flush terminal buffer</p>
        </div>
      );
    } else if (cleanCmd === "projects" || cleanCmd === "run projects") {
      output = (
        <div className="text-xs space-y-1.5 text-slate-300">
          <p className="text-emerald-300 font-bold">NAVIGATING TO SELECTED PROJECTS...</p>
          <p className="text-slate-400">High-performance production applications with measurable business impact.</p>
          <a href="#projects" className="inline-block mt-1 text-xs font-mono text-emerald-400 underline hover:text-emerald-300">
            [SCROLL TO PROJECTS ↓]
          </a>
        </div>
      );
    } else if (cleanCmd === "stack" || cleanCmd === "check stack") {
      output = (
        <div className="text-xs space-y-1 text-slate-300">
          <p className="text-purple-400 font-bold">PRODUCTION TECH ARSENAL:</p>
          <p className="text-emerald-300 font-mono">► Core: Next.js 16, React 19, TypeScript 5, Node.js</p>
          <p className="text-emerald-300 font-mono">► Storage: MongoDB, PostgreSQL, Redis, Cloudinary</p>
          <p className="text-emerald-300 font-mono">► Styling: Modern Tailwind CSS, Logical CSS, Motion</p>
        </div>
      );
    } else if (cleanCmd === "contact" || cleanCmd === "cat contact.json") {
      output = (
        <div className="text-xs space-y-1 font-mono text-slate-300">
          <p className="text-slate-500">&#123;</p>
          {settings.whatsapp && <p className="pl-4 text-emerald-400">&quot;whatsapp&quot;: &quot;{settings.whatsapp}&quot;,</p>}
          {settings.email && <p className="pl-4 text-emerald-300">&quot;email&quot;: &quot;{settings.email}&quot;,</p>}
          {settings.github && <p className="pl-4 text-purple-300">&quot;github&quot;: &quot;{settings.github}&quot;,</p>}
          {settings.linkedIn && <p className="pl-4 text-blue-400">&quot;linkedIn&quot;: &quot;{settings.linkedIn}&quot;</p>}
          <p className="text-slate-500">&#125;</p>
        </div>
      );
    } else if (cleanCmd === "hire" || cleanCmd === "ping whatsapp") {
      const whatsappHref = settings.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
        : "#contact";
      output = (
        <div className="text-xs space-y-1">
          <p className="text-emerald-400 font-bold">DIRECT CHANNEL OPEN:</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50 text-xs font-mono"
          >
            <span>DISPATCH WHATSAPP MESSAGE ↗</span>
          </a>
        </div>
      );
    } else {
      output = (
        <p className="text-xs text-rose-400">
          Command not recognized: <span className="font-mono text-white">&quot;{cmd}&quot;</span>. Type <span className="text-emerald-300 underline cursor-pointer" onClick={() => handleCommand("help")}>help</span> for commands.
        </p>
      );
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInputVal("");
  };

  // Generate WhatsApp brief link
  const getWhatsAppBriefHref = () => {
    const rawNumber = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "";
    const typeLabel =
      briefType === "ecommerce" ? (isAr ? "متجر إلكتروني متكامل" : "E-Commerce Platform") :
      briefType === "saas" ? (isAr ? "منصة سحابية / SaaS" : "SaaS Platform") :
      briefType === "landing" ? (isAr ? "موقع شركة / تعريفي احترافي" : "High-Converting Company Website") :
      (isAr ? "تطبيق ويب متقدم" : "Custom Web Application");

    const timeLabel =
      briefTimeline === "urgent" ? (isAr ? "في أقرب وقت ممكن (عاجل)" : "Urgent / ASAP") :
      briefTimeline === "month" ? (isAr ? "خلال شهر" : "Within 1 month") :
      (isAr ? "جدول زمني مرن" : "Flexible timeline");

    const message = isAr
      ? `مرحباً، أود بدء مشروع جديد معك:\n- نوع المشروع: ${typeLabel}\n- الموعد المتوقع: ${timeLabel}\n- أود مناقشة التفاصيل وبدء العمل.`
      : `Hi, I would like to build a new project with you:\n- Project Type: ${typeLabel}\n- Timeline: ${timeLabel}\n- Let's discuss details and next steps.`;

    return rawNumber
      ? `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`
      : "#contact";
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[#120f0b]/95 backdrop-blur-2xl shadow-2xl shadow-black/30 text-left" dir="ltr">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-[#18140e] border-b border-[var(--color-border)] flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-xs"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-xs"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-xs"></span>
          <span className="text-xs text-slate-400 font-mono ml-2 tracking-wider">
            interactive-terminal
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              activeTab === "terminal"
                ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Console
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brief")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              activeTab === "brief"
                ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚡ Project Scope Generator
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {activeTab === "terminal" ? (
        <div className="p-4 sm:p-5 flex flex-col justify-between h-[310px] overflow-hidden">
          {/* Output log */}
          <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-emerald-500/20">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="text-purple-400">developer@root:~$</span>
                  <span className="text-white font-bold">{item.command}</span>
                </div>
                <div className="pl-2 border-l border-emerald-500/20 text-slate-300">
                  {item.output}
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Quick Action Chips + Input */}
          <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-500 self-center">Quick cmds:</span>
              {["projects", "stack", "contact", "hire", "clear"].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleCommand(cmd)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors cursor-pointer"
                >
                  ${cmd}
                </button>
              ))}
            </div>

            {/* Input Line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommand(inputVal);
              }}
              className="flex items-center gap-2 text-xs"
            >
              <span className="text-[var(--color-accent)] font-bold">➜</span>
              <span className="text-amber-400/80 font-mono">~$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type 'help' or click a command..."
                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600 text-xs font-mono"
              />
              <span className="w-2 h-4 bg-[var(--color-accent)] cursor-blink"></span>
            </form>
          </div>
        </div>
      ) : (
        /* Client Brief Generator Tab */
        <div className="p-4 sm:p-5 h-[310px] flex flex-col justify-between text-xs space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-accent)] font-bold uppercase tracking-wider text-[11px]">
                {isAr ? "محدد تفاصيل المشروع السريع" : "Quick Project Scope Estimator"}
              </span>
              <span className="text-[10px] text-[var(--color-accent)] font-bold px-2 py-0.5 rounded bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                DIRECT RESPONSE
              </span>
            </div>

            {/* Project Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400">
                {isAr ? "اختر نوع المشروع المطلوب:" : "Select your target project:"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "ecommerce", label: isAr ? "🛒 متجر إلكتروني" : "🛒 E-Commerce" },
                  { id: "saas", label: isAr ? "⚡ منصة سحابية SaaS" : "⚡ SaaS Platform" },
                  { id: "web-app", label: isAr ? "🛠️ تطبيق ويب مخصص" : "🛠️ Web App" },
                  { id: "landing", label: isAr ? "🚀 موقع شركة احترافي" : "🚀 Brand Site" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBriefType(item.id)}
                    className={`p-2 rounded-xl text-[11px] text-left transition-all border cursor-pointer ${
                      briefType === item.id
                        ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] shadow-xs font-bold"
                        : "bg-black/40 border-[var(--color-border)] text-slate-400 hover:border-[var(--color-accent)]/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400">
                {isAr ? "الجدول الزمني المطلوب:" : "Desired Timeline:"}
              </label>
              <div className="flex gap-2">
                {[
                  { id: "urgent", label: isAr ? "عاجل (أقرب وقت)" : "Urgent / ASAP" },
                  { id: "month", label: isAr ? "خلال شهر" : "Within 1 Month" },
                  { id: "flexible", label: isAr ? "مرن" : "Flexible" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBriefTimeline(item.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] text-center border transition-all cursor-pointer ${
                      briefTimeline === item.id
                        ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                        : "bg-black/40 border-[var(--color-border)] text-slate-400 hover:border-[var(--color-accent)]/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action button */}
          <a
            href={getWhatsAppBriefHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] hover:opacity-95 text-slate-950 font-bold text-center text-xs tracking-wide shadow-lg shadow-black/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isAr ? "إرسال ملخص المشروع عبر الواتساب فوراً ←" : "Send Brief to WhatsApp Now →"}</span>
          </a>
        </div>
      )}
    </div>
  );
}
