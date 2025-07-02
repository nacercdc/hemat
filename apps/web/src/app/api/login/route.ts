/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { serialize } from "cookie";

import { env } from "~/env";
import { SET_COOKIE_CONFIG } from "../configs";
import { getTokenExpireMilliseconds } from "@etm/utilities";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const res = await fetch(`${env.NEXT_PUBLIC_HOST_URL}auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsedResult = await res.json();

    if (!res.ok) {
      throw new Error(
        parsedResult.message || "Invalid email and password combinations."
      );
    }

    const response = new NextResponse(
      JSON.stringify({ success: true, user: parsedResult })
    );

    response.headers.set(
      "Set-Cookie",
      [
        serialize("token", parsedResult.token, SET_COOKIE_CONFIG),
        serialize("refreshToken", parsedResult.refreshToken, SET_COOKIE_CONFIG),
        serialize(
          "expires",
          getTokenExpireMilliseconds(parsedResult.expires).toString(),
          SET_COOKIE_CONFIG
        ),
      ].join(", ")
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
