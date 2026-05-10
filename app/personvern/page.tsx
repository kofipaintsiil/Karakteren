import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description: "Personvernerklæring for Karakteren",
  robots: { index: true, follow: true },
};

export default function PersonvernPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 20px 80px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "13px", textDecoration: "none", marginBottom: "32px" }}>
          ← Tilbake
        </Link>

        <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "6px" }}>
          Personvernerklæring
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "40px" }}>
          Sist oppdatert: mai 2025
        </p>

        {[
          {
            title: "1. Behandlingsansvarlig",
            body: `Karakteren er behandlingsansvarlig for dine personopplysninger. Du kan kontakte oss på kontakt@karakteren.no for spørsmål om personvern.`,
          },
          {
            title: "2. Hvilke opplysninger vi samler inn",
            body: `Vi samler inn: e-postadresse og passord (kryptert) ved registrering; eksamensrelaterte preferanser du lagrer (fag, dato, nivå); transaksjons- og abonnementsdata via Stripe (kortnummer lagres ikke av oss); push-varsel-tokens dersom du godtar varsler; og tekniske loggdata som IP-adresse og nettlesertype for drifts- og sikkerhetsformål.`,
          },
          {
            title: "3. Hvordan vi bruker opplysningene",
            body: `Opplysningene brukes til: å drifte og forbedre tjenesten; å administrere abonnementet ditt; å sende deg push-varsler du har bedt om; å gi deg AI-genererte spørsmål og tilbakemeldinger tilpasset dine valg; og å forebygge misbruk og svindel.`,
          },
          {
            title: "4. Rettslig grunnlag (GDPR)",
            body: `Vi behandler dine personopplysninger på grunnlag av: avtale (art. 6(1)(b)) — nødvendig for å levere tjenesten du har registrert deg for; berettiget interesse (art. 6(1)(f)) — for sikkerhet og driftslogger; og samtykke (art. 6(1)(a)) — for push-varsler og markedsføring.`,
          },
          {
            title: "5. Tredjeparter vi deler data med",
            body: `Supabase (database og autentisering, lagret i EU); Stripe (betalingsprosessering, PCI DSS-sertifisert); Anthropic (AI-modell som behandler dine svar under en prøve — ingen data lagres av Anthropic etter svar er generert); Vercel (applikasjonshosting); og Vercel Analytics (anonymisert trafikkdata). Vi selger aldri personopplysninger til tredjepart.`,
          },
          {
            title: "6. Overføring til tredjeland",
            body: `Noen av våre leverandører er lokalisert utenfor EØS (bl.a. USA). Overføringen skjer i henhold til EU-kommisjonens standardavtalevilkår (SCC) eller tilsvarende godkjent overføringsmekanisme.`,
          },
          {
            title: "7. Lagringstid",
            body: `Vi lagrer kontoinformasjon så lenge kontoen er aktiv. Transaksjonsdata beholdes i 5 år i henhold til bokføringsloven. Push-tokens slettes umiddelbart ved avmelding. Du kan be om sletting av all data ved å slette kontoen din i innstillinger eller kontakte oss.`,
          },
          {
            title: "8. Dine rettigheter",
            body: `Du har rett til: innsyn i hvilke opplysninger vi har om deg; retting av uriktige opplysninger; sletting («retten til å bli glemt»); begrensning av behandling; dataportabilitet; og å klage til Datatilsynet (datatilsynet.no). Send forespørsler til kontakt@karakteren.no. Vi svarer innen 30 dager.`,
          },
          {
            title: "9. Push-varsler",
            body: `Varsler sendes bare om du eksplisitt samtykker. Du kan trekke tilbake samtykket i innstillinger i appen eller i telefonens systeminnstillinger. Vi sender kun relevante varsler om eksamensdatoer og aktivitet.`,
          },
          {
            title: "10. Informasjonskapsler (cookies)",
            body: `Vi bruker én teknisk nødvendig sesjons-cookie for innlogging (satt av Supabase). Vi bruker ingen sporings- eller markedsføringscookies. Vercel Analytics bruker ingen cookies og er GDPR-kompatibel.`,
          },
          {
            title: "11. Barn",
            body: `Tjenesten er ikke rettet mot barn under 13 år. Dersom vi blir oppmerksomme på at vi har samlet inn data fra barn under 13 år uten foreldresamtykke, sletter vi disse umiddelbart.`,
          },
          {
            title: "12. Endringer",
            body: `Vi kan oppdatere denne erklæringen. Vesentlige endringer varsles via e-post minst 14 dager før de trer i kraft.`,
          },
          {
            title: "13. Kontakt og klage",
            body: `Kontakt oss på kontakt@karakteren.no. Du har også rett til å klage til Datatilsynet: www.datatilsynet.no.`,
          },
        ].map(({ title, body }) => (
          <section key={title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--text)", marginBottom: "8px" }}>
              {title}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
              {body}
            </p>
          </section>
        ))}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", gap: "20px", fontSize: "13px" }}>
          <Link href="/vilkaar" style={{ color: "var(--accent-dark)", textDecoration: "none" }}>Vilkår for bruk</Link>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>karakteren.no</Link>
        </div>
      </div>
    </div>
  );
}
