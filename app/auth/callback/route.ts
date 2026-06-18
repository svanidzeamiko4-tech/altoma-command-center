import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  SUPABASE_COOKIE_ENCODING,
  supabaseCookieOptions,
} from "@/lib/supabase/cookie-config";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirectUrl = `${origin}/os`;

  const redirectWithError = (message: string) => {
    console.error("[auth/callback]", message);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(message)}`
    );
  };

  if (!code) {
    const oauthError =
      searchParams.get("error_description") ?? searchParams.get("error");
    return redirectWithError(
      oauthError ?? "Missing authorization code in callback URL"
    );
  }

  const { url, anonKey } = getSupabaseEnv();
  let supabaseResponse = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(url, anonKey, {
    cookieEncoding: SUPABASE_COOKIE_ENCODING,
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.redirect(redirectUrl);
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithError(error.message);
  }

  return supabaseResponse;
}
