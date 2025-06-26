import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken, setAuthCookies } from "./app/api/utils";

const DASHBOARD = "/";
const LOGIN = "/login";
const PUBLIC_ROUTES = new Set([LOGIN]);

function isPublic(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.has(pathname) ||
    Array.from(PUBLIC_ROUTES).some((route) => pathname.startsWith(`${route}/`))
  );
}

function redirectTo(path: string, request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("token")?.value;
  const refreshToken = cookies.get("refreshToken")?.value;
  const expires = cookies.get("expires")?.value;

  const isPublicRoute = isPublic(pathname);
  const isLoginPage = pathname === LOGIN;

  if (!token) {
    return isPublicRoute ? NextResponse.next() : redirectTo(LOGIN, request);
  }

  const response = NextResponse.next();
  if (refreshToken && expires && Date.now() >= Number(expires)) {
    try {
      const session = await refreshAccessToken(refreshToken);

      if (session) {
        setAuthCookies(response, session);
      } else {
        return redirectTo(LOGIN, request);
      }
    } catch {
      return redirectTo(LOGIN, request);
    }
  }

  if (isLoginPage) {
    return redirectTo(DASHBOARD, request);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|images).*)"],
};
