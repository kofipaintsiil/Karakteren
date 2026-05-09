import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe ikke konfigurert. Legg til STRIPE_SECRET_KEY i Vercel." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const plan: "monthly" | "annual" = body.plan === "annual" ? "annual" : "monthly";

  const priceId =
    plan === "annual"
      ? (process.env.STRIPE_ANNUAL_PRICE_ID ?? "")
      : (process.env.STRIPE_PRICE_ID ?? "");

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://karakteren.vercel.app"}/dashboard?upgraded=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://karakteren.vercel.app"}/pricing`,
      customer_email: user.email,
      metadata: { user_id: user.id, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ukjent Stripe-feil";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: `Betalingsfeil: ${message}` }, { status: 500 });
  }
}
