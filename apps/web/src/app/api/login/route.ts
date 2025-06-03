import { NextResponse } from "next/server";
import type { LoginRequestBody } from "../types";
import { authenticateUser, setAuthCookies } from "../utils";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as LoginRequestBody;
    if (!body.email || !body.password) {
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
