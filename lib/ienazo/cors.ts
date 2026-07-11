// プレイエンジン（別オリジンの Vite SPA）からの CORS 呼び出しを許可するヘルパー。
// 許可オリジンは ENGINE_BASE_URL のオリジンと、開発時の localhost に限定する。
// 契約：ienazo/docs/IENAZO_PLAY_GATE_CONTRACT.md
import { ENGINE_BASE_URL } from "@/lib/ienazo/config";

function allowedOrigins(): string[] {
  const list: string[] = [];
  if (ENGINE_BASE_URL) {
    try {
      list.push(new URL(ENGINE_BASE_URL).origin);
    } catch {
      /* 不正な URL は無視 */
    }
  }
  if (process.env.NODE_ENV !== "production") {
    list.push("http://localhost:5173", "http://127.0.0.1:5173");
  }
  return list;
}

/** リクエスト元 Origin が許可リストにあれば、その Origin を返す CORS ヘッダを作る。 */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allow = allowedOrigins().includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
