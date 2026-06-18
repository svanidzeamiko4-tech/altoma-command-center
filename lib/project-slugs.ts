export function projectOsHref(dbSlug: string): string {
  const map: Record<string, string> = {
    at_analytics: "at-analytics",
    vault: "founder-vault",
    future_projects: "future-projects",
  };

  return `/os/${map[dbSlug] ?? dbSlug}`;
}

export function resolveProjectSlug(urlSlug: string): string {
  const map: Record<string, string> = {
    "at-analytics": "at_analytics",
    "founder-vault": "vault",
    "future-projects": "future_projects",
  };

  return map[urlSlug] ?? urlSlug;
}
