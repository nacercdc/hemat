import { hash, verify } from 'argon2';

export class HashHelper {
  /**
   * Encrypts plain string
   *
   * @param plain {string}
   * @returns Promise<string> Returns encrypted
   */
  public static async encrypt(plain: string): Promise<string> {
    return await hash(plain);
  }

  /**
   * Compares encrypted and provided string
   *
   * @param plain {string}
   * @param encrypted {string}
   * @returns Promise<boolean> Returns Boolean if provided string and encrypted string are equal
   */
  public static async compare(
    plain: string,
    encrypted: string,
  ): Promise<boolean> {
    return await verify(encrypted, plain);
  }
}
