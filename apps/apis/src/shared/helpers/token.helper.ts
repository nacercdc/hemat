import { randomBytes } from 'crypto';

/**
 * Generates a secure random alphanumeric token.
 * @param length The length of the token (default: 24).
 * @returns A random alphanumeric token.
 */
export function generateRandomToken(length: number = 24): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(Math.ceil(length / 2));
  let token = '';
  for (let i = 0; i < bytes.length && token.length < length; i++) {
    const randomIndex = bytes[i] % chars.length;
    token += chars[randomIndex];
  }
  return token.padEnd(length, chars[0]);
}
