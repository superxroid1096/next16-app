/**
 * Cache tag names used across the app.
 * Centralised here so we never misspell a tag.
 */
export const tags = {
  settings: "settings",
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  skills: "skills",
  experience: "experience",
  certificates: "certificates",
  feedbacks: "feedbacks",
} as const;
