import AppShell from "@/components/layout/AppShell";
import Badge from "@/components/ui/Badge";
import { Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchLeaderboard } from "@/lib/sessions-server";
import LeaderboardClient from "./LeaderboardClient";

const SUBJECTS = ["Alle", "Norsk", "Matematikk", "Naturfag", "Fysikk", "Kjemi", "Biologi", "Historie", "Samfunnsfag", "Engelsk", "Geografi"];

export default async function ToplistePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const entries = await fetchLeaderboard();
  const userRank = user ? entries.findIndex((e) => e.user_id === user.id) + 1 : 0;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
            Toppliste
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600 }}>
            Hvem øver mest? (Og best?)
          </p>
        </div>

        {/* Your rank callout */}
        {userRank > 0 && (
          <div style={{
            backgroundColor: "var(--coral-soft)",
            border: "2px solid var(--coral-mid)",
            borderBottom: "4px solid var(--coral)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--coral-press)", marginBottom: "2px" }}>
                Din plassering
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--coral-press)" }}>
                #{userRank}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--coral-press)" }}>
                {entries[userRank - 1]?.avg_grade?.toFixed(1) ?? "—"}
              </p>
              <p style={{ fontSize: "11px", color: "var(--coral)", fontWeight: 600 }}>snittkarakter</p>
            </div>
          </div>
        )}

        {/* Subject filter + list — client component handles filter state */}
        <LeaderboardClient
          entries={entries}
          subjects={SUBJECTS}
          medals={medals}
          currentUserId={user?.id ?? null}
        />

        {entries.length === 0 && (
          <div style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "48px 24px",
            textAlign: "center",
          }}>
            <Flag size={36} strokeWidth={1.5} color="var(--text-faint)" style={{ marginBottom: "12px" }} />
            <p style={{ fontWeight: 800, color: "var(--text)", marginBottom: "6px" }}>Ingen resultater ennå</p>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600 }}>
              Vær den første på listen!
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
