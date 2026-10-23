import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",

  // Arabic has no prefix (/), English is under /en
  localePrefix: {
    mode: "as-needed",
  },
});
