import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { fetchProfile } from "@/lib/sessions-server";
import { redirect } from "next/navigation";
import PrivacyControls from "./PrivacyControls";

export default async function PersonvernPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profil/personvern");

  const profile = await fetchProfile(user.id);
  const showOnLeaderboard = profile?.show_on_leaderboard ?? true;

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: "6px" }}>
          Personvern
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "28px" }}>
          Kontroller hvem som kan se deg
        </p>

        <PrivacyControls
          userId={user.id}
          initialShowOnLeaderboard={showOnLeaderboard}
        />
      </div>
    </AppShell>
  );
}
