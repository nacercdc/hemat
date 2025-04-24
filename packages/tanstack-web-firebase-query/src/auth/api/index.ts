import type { UserCredential } from "firebase/auth";
type IHeaders = Record<string, string>;
export async function login(token: string, headers?: IHeaders) {
  const headersConfig: IHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };
  await fetch("/api/login", {
    method: "GET",
    headers: headersConfig,
  });
}

export async function loginWithCredential(credential: UserCredential) {
  const idToken = await credential.user.getIdToken();
  await login(idToken);
}

export async function logout(headers?: IHeaders) {
  await fetch("/api/logout", {
    method: "GET",
    headers,
  });
  window.location.reload();
}

export async function checkEmailVerification(headers?: IHeaders) {
  await fetch("/api/check-email-verification", {
    method: "GET",
    headers,
  });
}
