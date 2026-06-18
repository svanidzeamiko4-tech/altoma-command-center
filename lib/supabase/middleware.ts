import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_COOKIE_ENCODING,
  supabaseCookieOptions,
} from "@/lib/supabase/cookie-config";
import {
  getSupabaseEnv,
  MISSING_SUPABASE_ENV_ERROR,
} from "@/lib/supabase/env";

function setupRequiredResponse(): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Altoma Command Center — Setup Required</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0A0A0A; color: #F0EFE9; max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; line-height: 1.6; }
    h1 { color: #F5A623; font-size: 1.25rem; }
    code { background: #141416; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
    ol { padding-left: 1.25rem; }
    li { margin: 0.5rem 0; }
  </style>
</head>
<body>
  <h1>Supabase setup required</h1>
  <p>${MISSING_SUPABASE_ENV_ERROR}</p>
  <ol>
    <li>Copy <code>.env.local.example</code> to <code>.env.local</code></li>
    <li>Create a Supabase project at <a href="https://supabase.com" style="color:#F5A623">supabase.com</a></li>
    <li>Project Settings → API → copy URL and anon key into <code>.env.local</code></li>
    <li>Set <code>FOUNDER_EMAIL</code> and <code>ALTOMA_INTERNAL_API_KEY</code></li>
    <li>Run <code>supabase/schema-full.sql</code> in the SQL Editor</li>
    <li>Restart: <code>npm run dev</code></li>
  </ol>
  <p>See <code>README.md</code> → Local Setup for full steps.</p>
</body>
</html>`;

  return new NextResponse(html, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  let url: string;
  let anonKey: string;

  try {
    ({ url, anonKey } = getSupabaseEnv());
  } catch {
    return { supabaseResponse: setupRequiredResponse(), user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookieEncoding: SUPABASE_COOKIE_ENCODING,
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
