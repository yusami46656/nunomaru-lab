// 短命プレイチケット（JWT）。所有検証を通したユーザーにだけ発行し、
// プレイエンジン（別タブ）が起動時に検証する想定。
// URL 流用での再生を防ぐため寿命を短くする（既定 90 秒）。
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { clean } from "@/lib/ienazo/config";

const AUDIENCE = "ienazo-engine";
// プレイセッション（長命）：90秒チケットを verify した後に発行し、
// プレイ中の進捗 API（数時間）を認可する。契約：ienazo/docs/IENAZO_PLAY_GATE_CONTRACT.md
const AUDIENCE_SESSION = "ienazo-engine-session";
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

/** チケットを検証する（プレイエンジンの verify-ticket API で使う）。 */
export async function verifyTicket(token: string): Promise<JWTPayload & { slug?: string }> {
  const { payload } = await jwtVerify(token, secretKey(), {
    audience: AUDIENCE,
    issuer: ISSUER,
  });
  return payload;
}

/** プレイセッショントークンを発行する（既定 12 時間）。verify-ticket 成功時に返す。 */
export async function issueSession(userId: string, slug: string, ttlSeconds = 60 * 60 * 12): Promise<string> {
  return await new SignJWT({ slug })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE_SESSION)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secretKey());
}

/** プレイセッショントークンを検証する（progress API で使う）。 */
export async function verifySession(token: string): Promise<JWTPayload & { slug?: string }> {
  const { payload } = await jwtVerify(token, secretKey(), {
    audience: AUDIENCE_SESSION,
    issuer: ISSUER,
  });
  return payload;
}
