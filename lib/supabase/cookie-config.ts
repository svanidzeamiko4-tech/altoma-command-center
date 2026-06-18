import type { CookieOptions } from "@supabase/ssr";

export const SUPABASE_COOKIE_ENCODING = "base64url" as const;

export const supabaseCookieOptions: CookieOptions = {
  path: "/",
  sameSite: "lax",
};
