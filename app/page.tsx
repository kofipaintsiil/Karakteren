import Link from "next/link";
import { BookOpen, Calculator, Zap, TestTube, Dna, Scroll, Check } from "lucide-react";
import Blobb from "@/components/Blobb";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Karakteren — Øv til muntlig eksamen",
  description: "AI-sensor trekker tema, stiller eksamens­spørsmål og gir deg karakter 1–6 med tilbakemelding. Gratis for norske VGS-elever.",
};

const subjects: { label: string; icon: LucideIcon; color: string; border: string }[] = [
  { label: "Norsk",       icon: BookOpen,    color: "var(--blue-soft)",   border: "var(--blue)" },
  { label: "Matematikk",  icon: Calculator,  color: "var(--coral-soft)",  border: "var(--coral)" },
  { label: "Fysikk",      icon: Zap,         color: "var(--yellow-soft)", border: "var(--yellow-press)" },
  { label: "Kjemi",       icon: TestTube,    color: "var(--green-soft)",  border: "var(--green)" },
  { label: "Biologi",     icon: Dna,         color: "var(--blue-soft)",   border: "var(--blue)" },
  { label: "Historie",    icon: Scroll,      color: "var(--yellow-soft)", border: "var(--yellow-press)" },
];

const steps = [
  {
    n: "1",
    title: "Trekk et tema",
    body: "Blobb velger et tilfeldig tema fra pensum — akkurat som en ekte sensor.",
    color: "var(--coral-soft)",
    border: "var(--coral)",
    numColor: "var(--coral-press)",
  },
  {
    n: "2",
    title: "Svar på spørsmål",
    body: "Snakk i mikrofonen eller skriv svaret ditt. Blobb stiller oppfølgings­spørsmål.",
    color: "var(--blue-soft)",
    border: "var(--blue)",
    numColor: "var(--blue)",
  },
  {
    n: "3",
    title: "Få karakter 1–6",
    body: "Etter prøven får du en detaljert tilbakemelding og veiledning til neste økt.",
    color: "var(--green-soft)",
    border: "var(--green)",
    numColor: "var(--green-press)",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

      {/* Nav */}
      <header style={{
        maxWidth: "640px", margin: "0 auto",
        padding: "0 16px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, fontSize: "1.125rem", color: "var(--text)" }}>
          <span style={{
            width: "32px", height: "32px",
            borderRadius: "var(--r-md)",
            backgroundColor: "var(--coral)",
            border: "2px solid var(--coral-press)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: "14px",
          }}>K</span>
          Karakteren
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user ? (
            <Link href="/dashboard"><Button size="sm">Gå til dashboard</Button></Link>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Logg inn</Button></Link>
              <Link href="/login?signup=1"><Button size="sm">Prøv gratis</Button></Link>
            </>
          )}
        </div>
      </header>

      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "0 16px" }}>

        {/* Hero */}
        <section style={{ paddingTop: "40px", paddingBottom: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            <Blobb state="happy" size={120} />
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 7vw, 2.875rem)",
            fontWeight: 800, lineHeight: 1.1,
            color: "var(--text)", marginBottom: "14px",
          }}>
            Øv til muntlig.<br />
            <span style={{ color: "var(--coral)" }}>Tørr det faktisk.</span>
          </h1>
          <p style={{
            fontSize: "1rem", color: "var(--text-muted)", fontWeight: 600,
            maxWidth: "34ch", marginBottom: "28px", lineHeight: 1.7,
          }}>
            AI-sensor trekker tema, stiller spørsmål og gir deg karakter 1–6. Ingen dom, ingen vitner.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "320px" }}>
            {user ? (
              <Link href="/dashboard" style={{ width: "100%" }}>
                <Button size="lg" fullWidth>Gå til dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login?signup=1" style={{ width: "100%" }}>
                  <Button size="lg" fullWidth>Start gratis — 3 prøver/mnd</Button>
                </Link>
                <p style={{ fontSize: "12px", color: "var(--text-faint)", fontWeight: 600 }}>
                  Ingen betalingskort nødvendig
                </p>
              </>
            )}
            <Link href="/welcome" style={{ width: "100%" }}>
              <Button variant="secondary" size="lg" fullWidth>Se hvordan det fungerer</Button>
            </Link>
          </div>
        </section>

        {/* Stats strip */}
        <section style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderBottom: "4px solid var(--border-dark)",
          borderRadius: "var(--r-xl)",
          padding: "20px 24px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px", marginBottom: "48px", textAlign: "center",
        }}>
          {[
            { n: "10", label: "fag" },
            { n: "1–6", label: "karakter" },
            { n: "gratis", label: "å starte" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontWeight: 800, fontSize: "1.375rem", color: "var(--coral)" }}>{s.n}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>{s.label}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: "6px" }}>
            Slik fungerer det
          </p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: "20px" }}>
            Tre steg til bedre karakter
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {steps.map((s) => (
              <div key={s.n} style={{
                backgroundColor: s.color,
                border: `2px solid ${s.border}`,
                borderBottom: `4px solid ${s.border}`,
                borderRadius: "var(--r-lg)",
                padding: "20px",
                display: "flex", gap: "16px", alignItems: "flex-start",
              }}>
                <span style={{
                  width: "36px", height: "36px", flexShrink: 0,
                  borderRadius: "var(--r-full)",
                  backgroundColor: s.border,
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "16px",
                }}>
                  {s.n}
                </span>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "15px", color: "var(--text)", marginBottom: "4px" }}>{s.title}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subject grid */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text)", marginBottom: "14px" }}>
            Alle fag, klare til eksamen
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {subjects.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href="/login?signup=1" className="btn-3d" style={{
                  backgroundColor: s.color,
                  border: `2px solid ${s.border}`,
                  borderBottom: `4px solid ${s.border}`,
                  borderRadius: "var(--r-lg)",
                  padding: "16px",
                  display: "flex", alignItems: "center", gap: "12px",
                  textDecoration: "none",
                }}>
                  <Icon size={22} strokeWidth={2} color={s.border} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{s.label}</span>
                </Link>
              );
            })}
          </div>
          <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, textAlign: "center" }}>
            + Naturfag, Samfunnsfag, Engelsk, Geografi
          </p>
        </section>

        {/* Blobb quote */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{
            backgroundColor: "var(--coral-soft)",
            border: "2px solid var(--coral-mid)",
            borderBottom: "4px solid var(--coral)",
            borderRadius: "var(--r-xl)",
            padding: "24px",
            display: "flex", alignItems: "center", gap: "20px",
          }}>
            <Blobb state="thinking" size={72} />
            <div>
              <p style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--coral)", marginBottom: "6px" }}>
                Blobb sier
              </p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.5 }}>
                &ldquo;Greit, la oss se hva du faktisk kan da...&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderBottom: "4px solid var(--border-dark)",
            borderRadius: "var(--r-xl)", padding: "24px",
          }}>
            <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: "4px" }}>Gratis</p>
            <p style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--text)", marginBottom: "16px" }}>
              0<span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>kr</span>
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["3 prøver/mnd", "Alle fag", "Enkel tilbakemelding"].map((f) => (
                <li key={f} style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={13} strokeWidth={2.5} color="var(--green)" style={{ flexShrink: 0 }} />{f}
                </li>
              ))}
            </ul>
          </div>
          <div style={{
            backgroundColor: "var(--coral-soft)",
            border: "2px solid var(--coral)",
            borderBottom: "4px solid var(--coral-press)",
            borderRadius: "var(--r-xl)", padding: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--coral-press)" }}>Premium</p>
              <span style={{
                fontSize: "10px", fontWeight: 800,
                backgroundColor: "var(--coral)", color: "#fff",
                borderRadius: "var(--r-full)", padding: "3px 8px",
              }}>POPULÆR</span>
            </div>
            <p style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--coral-press)", marginBottom: "16px" }}>
              99<span style={{ fontSize: "0.875rem", color: "var(--coral)", fontWeight: 600 }}>kr/mnd</span>
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Ubegrensede prøver", "Detaljert tilbakemelding", "Del resultater med venner"].map((f) => (
                <li key={f} style={{ fontSize: "13px", color: "var(--coral-press)", fontWeight: 600, display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={13} strokeWidth={2.5} color="var(--coral)" style={{ flexShrink: 0 }} />{f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ marginBottom: "64px", textAlign: "center" }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderBottom: "4px solid var(--border-dark)",
            borderRadius: "var(--r-xl)",
            padding: "40px 24px",
          }}>
            <Blobb state="idle" size={80} />
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", margin: "16px 0 8px" }}>
              Klar for en prøve?
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "24px", lineHeight: 1.6 }}>
              {user ? "Fortsett der du slapp." : "Start med 3 gratis prøver. Ingen betalingskort nødvendig."}
            </p>
            <Link href={user ? "/dashboard" : "/login?signup=1"}>
              <Button size="lg">{user ? "Gå til dashboard" : "Lag gratis konto"}</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer style={{
        borderTop: "2px solid var(--border)",
        padding: "24px 16px",
        textAlign: "center",
        fontSize: "13px", color: "var(--text-faint)", fontWeight: 600,
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
          <Link href="/pricing" style={{ color: "var(--text-faint)", textDecoration: "none" }}>Priser</Link>
          <Link href="/profil/personvern" style={{ color: "var(--text-faint)", textDecoration: "none" }}>Personvern</Link>
          <Link href="/login" style={{ color: "var(--text-faint)", textDecoration: "none" }}>Logg inn</Link>
        </div>
        © 2025 Karakteren
      </footer>
    </div>
  );
}
