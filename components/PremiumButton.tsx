"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function PremiumButton({ plan = "monthly" }: { plan?: "monthly" | "annual" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Noe gikk galt");
      setLoading(false);
    }
  }

  return (
    <Button size="md" fullWidth onClick={handleClick} disabled={loading}>
      {loading ? "Laster…" : "Start 7-dagers prøveperiode"}
    </Button>
  );
}
