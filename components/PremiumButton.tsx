"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function PremiumButton({ plan = "monthly" }: { plan?: "monthly" | "annual" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/pricing");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Noe gikk galt. Prøv igjen.");
        setLoading(false);
      }
    } catch {
      setError("Kunne ikke koble til betalingstjenesten. Sjekk internett og prøv igjen.");
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <Button size="md" fullWidth onClick={handleClick} disabled={loading}>
        {loading ? "Laster…" : "Bli Premium"}
      </Button>
      {error && (
        <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--error, #e53e3e)", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
