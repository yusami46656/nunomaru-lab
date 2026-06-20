// 短命プレイチケット（JWT）。所有検証を通したユーザーにだけ発行し、
// プレイエンジン（別タブ）が起動時に検証する想定。
// URL 流用での再生を防ぐため寿命を短くする（既定 90 秒）。
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { clean } from "@/lib/ienazo/config";

const AUDIENCE = "ienazo-engine";
const ISSUER = "ienazo-site";

function secretKey(): Uint8Array {
  const secret = clean(process.env.IENAZO_TICKET_SECRET);
  if (!secret) throw new Error("IENAZO_TICKET_SECRET が未設定です。");
  return new TextEncoder().encode(secret);
}

export const ticketReady = () => Boolean(clean(process.env.IENAZO_TICKET_SECRET));

/** ユーザー×作品の短命チケットを発行する。 */
export async function issueTicket(userId: string, slug: string, ttlSeconds = 90): Promise<string> {
  return await new SignJWT({ slug })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secretKey());
}

/** チケットを検証する（後日プレイエンジン側 verify-ticket API で使う）。 */
export async function verifyTicket(token: string): Promise<JWTPayload & { slug?: string }> {
  const { payload } = await jwtVerify(token, secretKey(), {
    audience: AUDIENCE,
    issuer: ISSUER,
  });
  return payload;
}
