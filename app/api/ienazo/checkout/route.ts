// 有料作品の Stripe Checkout セッションを作成する。
// ログイン必須。metadata に user_id / work_slug を載せ、Webhook で所有権を確定する。
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/ienazo/supabase/server";
import { supabaseReady, SITE_URL, clean } from "@/lib/ienazo/config";
import { WORKS } from "@/data/ienazo/works";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripeSecret = clean(process.env.STRIPE_SECRET_KEY);
  if (!supabaseReady || !stripeSecret) {
    return NextResponse.json({ error: "決済は準備中です（未設定）。" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    ({ slug } = await req.json());
  } catch {
    /* noop */
  }
  const work = WORKS.find((w) => w.slug === slug);
  if (!work || work.type !== "paid") {
    return NextResponse.json({ error: "対象の作品が見つかりません。" }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecret);
  const metadata = { user_id: user.id, work_slug: work.slug };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      work.stripePriceId
        ? { price: work.stripePriceId, quantity: 1 }
        : {
            quantity: 1,
            price_data: {
              currency: "jpy",
              unit_amount: work.priceJPY,
              product_data: { name: work.title, description: work.tagline },
            },
          },
    ],
    metadata,
    // payment_intent にも載せておくと照合・サポート時に追える。
    payment_intent_data: { metadata },
    customer_email: user.email ?? undefined,
    success_url: `${SITE_URL}/ienazo/account/library?purchased=${work.slug}`,
    cancel_url: `${SITE_URL}/ienazo/works/${work.slug}`,
  });

  return NextResponse.json({ url: session.url });
}
