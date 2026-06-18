import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/os")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login" && user) {
    const osUrl = request.nextUrl.clone();
    osUrl.pathname = "/os";
    return NextResponse.redirect(osUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/os/:path*", "/login"],
};
