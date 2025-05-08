import { Request } from 'express';

interface AuthHeader {
  scheme: string;
  value: string;
}

function parseAuthHeader(value: string): AuthHeader | null {
  if (typeof value !== 'string') return null;

  const matches = value.match(/(\S+)\s+(\S+)/);
  return matches && { scheme: matches[1]?.toLowerCase(), value: matches[2] };
}

export function getBearerToken(request: Request): string | null {
  const authorization: string | null = request?.headers?.authorization ?? null;

  if (!authorization) return null;

  const authParams = parseAuthHeader(authorization);
  let token: string | null = null;

  if (authParams && authParams.scheme === 'bearer') {
    token = authParams.value;
  }

  return token;
}
