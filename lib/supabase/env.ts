export const MISSING_SUPABASE_ENV_ERROR =
  "Missing Supabase env vars. Create .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return {
        url: "https://placeholder.supabase.co",
        anonKey: "placeholder-anon-key",
      };
    }
    throw new Error(MISSING_SUPABASE_ENV_ERROR);
  }

  return { url, anonKey };
}
