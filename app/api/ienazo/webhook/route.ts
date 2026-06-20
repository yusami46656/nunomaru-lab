// Stripe Webhook：署名検証 → checkout.session.completed で所有権を付与する。
// service role キーで RLS を迂回して entitlements に upsert する。
//
// テスト時のローカル転送：
//   stripe listen --forward-to localhost:3411/api/ienazo/webhook
//   出力された whsec_... を STRIPE_WEBHOOK_SECRET に設定する。
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/ienazo/supabase/admin";
import { clean } from "@/lib/ienazo/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripeSecret = clean(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = clean(process.env.STRIPE_WEBHOOK_SECRET);
  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json({ error: "Webhook 未設定。" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "署名がありません。" }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecret);
  const body = await req.text(); // 署名検証には生のボディが必要。

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: `署名検証に失敗: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const workSlug = session.metadata?.work_slug;

    if (userId && workSlug) {
      const admin = createAdminClient();
      const { error } = await admin.from("ienazo_entitlements").upsert(
        {
          user_id: userId,
          work_slug: workSlug,
          source: "stripe",
          stripe_session_id: session.id,
        },
        { onConflict: "user_id,work_slug" },
      );
      if (error) {
        // 失敗を返すと Stripe が再送してくれる。
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
