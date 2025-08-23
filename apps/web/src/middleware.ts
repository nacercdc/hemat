import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN = "/login";
const HOME = "/home";
const REGISTER = "/register";

const PUBLIC_ROUTES = new Set([LOGIN, HOME, REGISTER]);

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;
  const token = cookies.get("token")?.value;
  const invitationId = nextUrl.searchParams.get("invitationId");
  const invitationEmail = nextUrl.searchParams.get("email");
  const invitationAssessmentName = nextUrl.searchParams.get("assessmentName");

  const isPublicRoute = isPublic(pathname);

  if (!invitationId && !token && !isPublicRoute) {
    if (pathname !== LOGIN) {
      return redirectTo(LOGIN, nextUrl);
    }
    return NextResponse.next();
  }

  if (invitationId && !token) {
    const target = `${LOGIN}?invitationId=${invitationId}&email=${invitationEmail}&assessmentName=${invitationAssessmentName}`;

    if (pathname === REGISTER) {
      return NextResponse.next();
    }
    if (pathname !== LOGIN) {
      return redirectTo(target, nextUrl);
    }

    return NextResponse.next();
  }

  if (invitationId && token) {
    const target = `/invitations/accept/${invitationId}?email=${invitationEmail}&assessmentName=${invitationAssessmentName}`;
    if (pathname !== target) {
      return redirectTo(target, nextUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/invitations/accept/") && token) {
    return NextResponse.next();
  }

  return NextResponse.next();
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
