import { createBrowserClient, type CookieOptions } from "@supabase/ssr";
import { parse, serialize } from "cookie";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_COOKIE_ENCODING,
  supabaseCookieOptions,
} from "@/lib/supabase/cookie-config";
import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error(
      "lib/supabase/client createClient() must only be called in the browser."
    );
  }

  const { url, anonKey } = getSupabaseEnv();

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey, {
      cookieEncoding: SUPABASE_COOKIE_ENCODING,
      cookieOptions: supabaseCookieOptions,
      isSingleton: true,
      cookies: {
        getAll() {
          const parsed = parse(document.cookie);
          return Object.entries(parsed).map(([name, value]) => ({
            name,
            value: value ?? "",
          }));
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = serialize(name, value, {
              ...supabaseCookieOptions,
              ...options,
              path: options?.path ?? supabaseCookieOptions.path,
              sameSite:
                (options?.sameSite as "lax" | "strict" | "none" | undefined) ??
                supabaseCookieOptions.sameSite,
              secure:
                options?.secure ??
                window.location.protocol === "https:",
            });
          });
        },
      },
    });
  }

  return browserClient;
}
