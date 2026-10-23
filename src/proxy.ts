import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware:
 * - Optimistic redirect for /admin (Phase 3).
 * - Real defense remains in verifySession() (DAL) inside each page/action.
 * - Handles locale detection and routing for the public site via next-intl.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic check for /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("portfolio_admin_session");

    if (pathname === "/admin/login") {
      if (sessionCookie?.value) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all paths except:
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - Static files with extensions
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
