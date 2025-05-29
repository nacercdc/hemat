import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { getTokenExpireMilliseconds } from "@etm/utilities";
import { BASE_COOKIE_CONFIG } from "../configs/cookie.config";
import type { LoginRequestBody, LoginResponse } from "../types";
import { authenticateUser } from "../utils";

function setAuthCookies(
  response: NextResponse,
  loginResponse: LoginResponse
): void {
  const cookies = [
    serialize("token", loginResponse.token, BASE_COOKIE_CONFIG),
    serialize("refreshToken", loginResponse.refreshToken, BASE_COOKIE_CONFIG),
    serialize(
      "expires",
      getTokenExpireMilliseconds(loginResponse.expires).toString(),
      BASE_COOKIE_CONFIG
    ),
  ];

  response.headers.set("Set-Cookie", cookies.join(", "));
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as LoginRequestBody;

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const loginResponse = await authenticateUser(body);

    const response = NextResponse.json(
      { success: true, user: loginResponse },
      { status: 200 }
    );

    setAuthCookies(response, loginResponse);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
