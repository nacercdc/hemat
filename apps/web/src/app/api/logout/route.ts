import { NextResponse } from "next/server";
import { clearAuthCookies } from "../utils";

export function POST(): NextResponse {
  const response = NextResponse.json({ success: true }, { status: 200 });
  clearAuthCookies(response);
  return response;
}
