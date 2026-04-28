import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hjelp og støtte" };

const faqs = [
  {
    q: "Hvordan fungerer eksamen?",
    a: "Blobb trekker et tilfeldig tema fra pensum og stiller deg spørsmål — akkurat som en ekte sensor. Du svarer i mikrofonen eller skriver svaret ditt. Etter samtalen gir Blobb deg karakter 1–6 med konkret tilbakemelding.",
  },
  {
    q: "Hvor mange eksamener får jeg gratis?",
    a: "Gratis-planen gir deg 3 eksamener per måned. Kvoten nullstilles den 1. hver måned. Med Premium får du ubegrenset antall eksamener.",
  },
  {
    q: "Mikrofonen virker ikke — hva gjør jeg?",
    a: "Sjekk at nettleseren har tilgang til mikrofonen din (klikk på låsikonet i adressefeltet). På iPhone må du bruke Safari — Chrome støtter ikke taleinnspilling på iOS. Du kan alltids skrive svarene dine i stedet.",
  },
  {
    q: "Stemmen til Blobb høres ikke — hva gjør jeg?",
    a: "Sjekk at lydvolumet ikke er skrudd ned og at telefonen ikke er på stille. Noen nettlesere blokkerer lyd som ikke startes av brukeren — prøv å trykke på skjermen først.",
  },
  {
    q: "Hvilke fag støttes?",
    a: "Norsk, Matematikk (1T, R1, R2, 2P), Fysikk 1 og 2, Kjemi 1 og 2, Biologi 1 og 2, Naturfag, Samfunnsfag, Historie, Engelsk og Geografi.",
  },
  {
    q: "Er svarene mine private?",
    a: "Ja. Samtalene dine lagres bare lokalt på enheten din under eksamen. Etter fullføring lagres kun karakter, tema og fag — ikke selve teksten. Se personvernsiden for full oversikt.",
  },
  {
    q: "Hvordan avslutter jeg abonnementet?",
    a: "Du kan avbestille når som helst fra Stripe-portalen. Tilgangen varer til slutten av faktureringsperioden. Send oss en e-post hvis du trenger hjelp.",
  },
];

export default function HjelpPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>

        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: "6px" }}>
          Hjelp og støtte
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "28px" }}>
          Vanlige spørsmål om Karakteren
        </p>

        <div style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          marginBottom: "24px",
        }}>
          {faqs.map((faq, i) => (
            <details
              key={i}
              style={{
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              <summary style={{
                padding: "16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text)",
                cursor: "pointer",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}>
                {faq.q}
                <ChevronRight size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
              </summary>
              <p style={{
                padding: "0 16px 16px",
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: 500,
                lineHeight: 1.7,
              }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* Contact */}
        <div style={{
          backgroundColor: "var(--coral-soft)",
          border: "2px solid var(--coral-mid)",
          borderBottom: "4px solid var(--coral)",
          borderRadius: "var(--r-lg)",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            width: "40px", height: "40px", flexShrink: 0,
            borderRadius: "var(--r-md)",
            backgroundColor: "var(--coral)",
            border: "2px solid var(--coral-press)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Mail size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--text)", marginBottom: "2px" }}>
              Fant du ikke svaret?
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
              Send oss en e-post på{" "}
              <a
                href="mailto:hei@karakteren.no"
                style={{ color: "var(--coral-press)", textDecoration: "none", fontWeight: 700 }}
              >
                hei@karakteren.no
              </a>
            </p>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <Link
            href="/profil/personvern"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              backgroundColor: "var(--surface)",
              border: "2px solid var(--border)",
              borderRadius: "var(--r-lg)",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>Personverninnstillinger</span>
            <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
          </Link>
        </div>

      </div>
    </AppShell>
  );
}
