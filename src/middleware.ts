import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifyTokenEdge } from "@/lib/auth-edge";

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/connexion";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyTokenEdge(token) : null;

  if (pathname.startsWith("/admin")) {
    if (!session) return redirectToLogin(request, pathname);
    if (session.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/espace";
      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith("/espace") ||
    pathname.startsWith("/apprendre")
  ) {
    if (!session) return redirectToLogin(request, pathname);
  }
  // /studio is public (demo images via Pollinations); API enforces auth only for video/credits

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/espace/:path*",
    "/apprendre/:path*",
  ],
};
