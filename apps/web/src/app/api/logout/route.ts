import { NextResponse } from "next/server";
import { clearAuthCookies } from "../utils";

export function GET(): NextResponse {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
