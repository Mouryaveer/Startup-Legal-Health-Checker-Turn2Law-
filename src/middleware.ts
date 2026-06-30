import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Guard admin routes
  if (path.startsWith("/admin")) {
    const session = request.cookies.get("t2l_health_admin")?.value;
    const isLoginPage = path === "/admin/login";

    if (!session && !isLoginPage) {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }

    if (session && isLoginPage) {
      const url = new URL("/admin", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
