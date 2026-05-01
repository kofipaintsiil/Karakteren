import AppShell from "@/components/layout/AppShell";
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
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "4px" }}>
            Toppliste
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Hvem øver mest? (Og best?)
          </p>
        </div>

        {/* Your rank callout */}
        {userRank > 0 && (
          <div style={{
            backgroundColor: "var(--accent-bg)",
            border: "1px solid var(--accent)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--accent-dark)", marginBottom: "2px" }}>
                Din plassering
              </p>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-dark)" }}>
                #{userRank}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--accent-dark)" }}>
                {entries[userRank - 1]?.avg_grade?.toFixed(1) ?? "—"}
              </p>
              <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 600 }}>snittkarakter</p>
            </div>
          </div>
        )}

        <LeaderboardClient
          entries={entries}
          subjects={SUBJECTS}
          medals={medals}
          currentUserId={user?.id ?? null}
        />

        {entries.length === 0 && (
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "48px 24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏆</div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>Ingen resultater ennå</p>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Vær den første på listen!
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
