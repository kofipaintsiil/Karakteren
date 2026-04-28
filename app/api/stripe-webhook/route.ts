import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getPeriodEnd(sub: Record<string, unknown>): string | null {
  // Newer Stripe API versions put current_period_end on the subscription item
  const directEnd = sub.current_period_end as number | undefined;
  if (directEnd && directEnd > 0) return new Date(directEnd * 1000).toISOString();

  const items = sub.items as { data?: { current_period_end?: number }[] } | undefined;
  const itemEnd = items?.data?.[0]?.current_period_end;
  if (itemEnd && itemEnd > 0) return new Date(itemEnd * 1000).toISOString();

  // Fallback: 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe ikke konfigurert" }, { status: 503 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Ugyldig signatur" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { user_id?: string }; customer?: string; subscription?: string };
    const userId = session.metadata?.user_id;
    if (!userId) return NextResponse.json({ ok: true });

    const subId = session.subscription as string;
    const sub = await stripe.subscriptions.retrieve(subId, { expand: ["items"] });
    const subRaw = sub as unknown as Record<string, unknown>;

    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subId,
      status: sub.status,
      current_period_end: getPeriodEnd(subRaw),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as unknown as Record<string, unknown>;
    await supabase
      .from("subscriptions")
      .update({
        status: sub.status as string,
        current_period_end: getPeriodEnd(sub),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", sub.id as string);
  }

  return NextResponse.json({ ok: true });
}
