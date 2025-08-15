import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD = "/";
const LOGIN = "/login";
const HOME = "/home";
const REGISTER = "/register";

const PUBLIC_ROUTES = new Set([LOGIN, HOME, REGISTER]);

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;
  const token = cookies.get("token")?.value;
  const invitationId = nextUrl.searchParams.get("invitationId");
  const INVITATION_LOGIN = `/login&invitationId=${invitationId}`;

  const isPublicRoute = isPublic(pathname);
  if (invitationId) {
    return isPublicRoute
      ? NextResponse.next()
      : redirectTo(INVITATION_LOGIN, nextUrl);
  }
  if (!token) {
    return isPublicRoute ? NextResponse.next() : redirectTo(LOGIN, nextUrl);
  }

  return isPublicRoute ? redirectTo(DASHBOARD, nextUrl) : NextResponse.next();
}

function isPublic(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.has(pathname) ||
    Array.from(PUBLIC_ROUTES).some((route) => pathname.startsWith(`${route}/`))
  );
}

function redirectTo(path: string, baseUrl: URL): NextResponse {
  return NextResponse.redirect(new URL(path, baseUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|images).*)"],
};
