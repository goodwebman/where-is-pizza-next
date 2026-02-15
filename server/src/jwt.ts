import * as crypto from "crypto";

export class JWTHandler {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return Buffer.from(str, "base64").toString();
  }

  createAccessToken(payload: object, expiresIn: number = 900): string {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { ...payload, iat: now, exp: now + expiresIn, type: "access" };

    const base64Header = this.base64UrlEncode(JSON.stringify(header));
    const base64Payload = this.base64UrlEncode(JSON.stringify(fullPayload));

    const signature = crypto
      .createHmac("sha256", this.secretKey)
      .update(`${base64Header}.${base64Payload}`)
      .digest("base64url");

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  createRefreshToken(): string {
    return crypto.randomBytes(40).toString("hex");
  }

  verifyToken(token: string): boolean {
    try {
      const [headerB64, payloadB64, signatureB64] = token.split(".");
      const expectedSignature = crypto
        .createHmac("sha256", this.secretKey)
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64url");

      if (signatureB64 !== expectedSignature) return false;

      const payload = JSON.parse(this.base64UrlDecode(payloadB64));
      const now = Math.floor(Date.now() / 1000);
      return !payload.exp || payload.exp > now;
    } catch {
      return false;
    }
  }

  getPayload(token: string): object | null {
    try {
      const [, payloadB64] = token.split(".");
      return JSON.parse(this.base64UrlDecode(payloadB64));
    } catch {
      return null;
    }
  }
}
