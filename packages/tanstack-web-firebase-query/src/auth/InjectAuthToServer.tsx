import { getTokens } from "next-firebase-auth-edge";
import type { SetAuthCookiesOptions } from "next-firebase-auth-edge/next/cookies";
import React from "react";
import { toUser } from "./helpers/user";
import { AuthProvider } from "./AuthProvider";
interface Props {
  headers: () => Promise<Headers>;
  cookies: () => Promise<unknown>;
  authConfig: SetAuthCookiesOptions;
  children: React.ReactNode;
}
export async function InjectAuthToServer({
  cookies,
  headers,
  authConfig,
  children,
}: Props) {
  const tokens = await getTokens(await cookies(), {
    ...authConfig,
    headers: await headers(),
  });
  const user = tokens ? toUser(tokens) : null;
  return <AuthProvider user={user}>{children}</AuthProvider>;
}
