import type { Metadata } from "next";
import { Almarai, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Dynamic personal portfolio",
  robots: { index: false, follow: false }, // No SEO per BRD
};

/**
 * Inline script that runs before first paint to set
 * data-theme and data-mode on <html>, preventing flash.
 */
const themeAndModeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var mode = localStorage.getItem('visitMode');
    var html = document.documentElement;
    if (theme === 'dark' || theme === 'light') {
      html.setAttribute('data-theme', theme);
    }
    if (mode === 'hire' || mode === 'client' || mode === 'tech') {
      html.setAttribute('data-mode', mode);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${almarai.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeAndModeScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
