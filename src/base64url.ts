import { Buffer } from 'buffer';

export class Base64Url {
  static toBuffer = (str: string): Buffer =>
    Buffer.from(this.unescape(str), "base64");

  private static unescape = (str: string) =>
    (str + "===".slice((str.length + 3) % 4))
      .replace(/-/g, "+")
      .replace(/_/g, "/");
}
