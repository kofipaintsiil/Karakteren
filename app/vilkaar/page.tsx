import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vilkår for bruk",
  description: "Vilkår for bruk av Karakteren",
  robots: { index: true, follow: true },
};

export default function VilkaarPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 20px 80px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "13px", textDecoration: "none", marginBottom: "32px" }}>
          ← Tilbake
        </Link>

        <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "6px" }}>
          Vilkår for bruk
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "40px" }}>
          Sist oppdatert: mai 2025
        </p>

        {[
          {
            title: "1. Om tjenesten",
            body: `Karakteren er en AI-drevet treningsplattform for muntlig eksamen i videregående skole. Tjenesten driftes av Karakteren (heretter «vi», «oss» eller «Karakteren»). Ved å bruke appen godtar du disse vilkårene.`,
          },
          {
            title: "2. Hvem kan bruke Karakteren",
            body: `Tjenesten er beregnet på elever i norsk videregående skole. Du må være minst 13 år gammel for å opprette konto. Er du under 18 år, er det foreldrenes ansvar å godkjenne at du bruker tjenesten.`,
          },
          {
            title: "3. Konto og ansvar",
            body: `Du er ansvarlig for å holde innloggingsinformasjonen din konfidensiell og for all aktivitet som skjer via kontoen din. Varsle oss umiddelbart på kontakt@karakteren.no dersom du mistenker uautorisert bruk.`,
          },
          {
            title: "4. Abonnement og betaling",
            body: `Karakteren tilbyr en gratis plan og en Premium-plan. Premium faktureres via Stripe månedlig eller årlig. Prisen vises alltid før du bekrefter kjøpet. Vi forbeholder oss retten til å endre priser med 30 dagers varsel.`,
          },
          {
            title: "5. Angrerett og refusjon",
            body: `I henhold til norsk angrerettlov har forbrukere 14 dagers angrerett fra kjøpsdatoen. Dersom du ønsker å benytte angreretten, kontakter du oss på kontakt@karakteren.no. Etter at angreretten er utløpt, gis det som hovedregel ikke refusjon for gjenværende abonnementsperiode. Kjøp gjort via Apple App Store følger Apples egne refusjonsregler.`,
          },
          {
            title: "6. AI-generert innhold",
            body: `Spørsmål, tilbakemeldinger og karakterer i Karakteren genereres av kunstig intelligens og er ment som treningsstøtte. Innholdet er ikke faglig veiledning fra kvalifisert lærer, og vi garanterer ikke at det er korrekt, fullstendig eller oppdatert i tråd med gjeldende læreplan. Bruk tjenesten som et supplement til ordinær undervisning.`,
          },
          {
            title: "7. Forbudt bruk",
            body: `Du må ikke bruke tjenesten til å spre ulovlig innhold, forsøke å omgå tekniske sikkerhetstiltak, videreselge tilgang til tjenesten, eller bruke automatiserte verktøy for å misbruke tjenesten.`,
          },
          {
            title: "8. Immaterielle rettigheter",
            body: `Alt innhold vi har laget — design, tekst, kode og grafikk — tilhører Karakteren. Du får en begrenset, ikke-eksklusiv rett til å bruke tjenesten til eget, ikke-kommersielt formål.`,
          },
          {
            title: "9. Ansvarsbegrensning",
            body: `Karakteren leveres «som den er». Vi er ikke ansvarlige for indirekte tap, tap av data, eller skade som oppstår som følge av at tjenesten er utilgjengelig. Vårt samlede ansvar overfor deg kan ikke overstige det du har betalt oss de siste 12 månedene.`,
          },
          {
            title: "10. Avslutning av konto",
            body: `Du kan slette kontoen din når som helst i innstillinger. Vi kan suspendere eller slette kontoer som bryter disse vilkårene. Ved avslutning av konto slettes dine persondata i henhold til vår personvernerklæring.`,
          },
          {
            title: "11. Endringer i vilkårene",
            body: `Vi kan oppdatere disse vilkårene. Vesentlige endringer varsles via e-post eller app-melding med minst 14 dagers varsel. Fortsatt bruk etter ikrafttredelse anses som aksept av de nye vilkårene.`,
          },
          {
            title: "12. Gjeldende lov",
            body: `Disse vilkårene er underlagt norsk lov. Eventuelle tvister løses i norske domstoler med verneting i Oslo.`,
          },
          {
            title: "13. Kontakt",
            body: `Spørsmål om disse vilkårene kan sendes til kontakt@karakteren.no.`,
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
          <Link href="/personvern" style={{ color: "var(--accent-dark)", textDecoration: "none" }}>Personvernerklæring</Link>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>karakteren.no</Link>
        </div>
      </div>
    </div>
  );
}
