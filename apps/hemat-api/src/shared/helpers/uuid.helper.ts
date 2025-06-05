import * as uuid from 'uuid';

export class UUID {
  /**
   * Return v1 uuid
   * @returns {string}
   */
  public static v1(): string {
    return uuid.v1();
  }

  /**
   * Return v4 uuid
   * @returns {string}
   */
  public static v4(): string {
    return uuid.v4();
  }

  /**
   * Return v6 uuid
   * @returns {string}
   */
  public static v6(): string {
    return uuid.v6();
  }

  /**
   * Return v7 uuid
   * @returns {string}
   */
  public static v7(): string {
    return uuid.v7();
  }

  /**
   * Return validate uuid
   * @returns {string}
   */
  public static isValid(str: string): boolean {
    return uuid.validate(str);
  }
}
