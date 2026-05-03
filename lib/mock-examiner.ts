// Kompetansemål hentet fra udir.no LK20 — oppdatert april 2026

export interface ExamTopic {
  name: string;
  opening: string;
  followUps: string[];
  tooShort: string;
  closing: string;
}

export interface SubjectData {
  topics: ExamTopic[];
}

const EXAMINER_DATA: Record<string, SubjectData> = {

  // ─── NORSK (NOR01-06, Vg3 studieforberedende) ───────────────────────────────
  norsk: {
    topics: [
      {
        name: "Litterær analyse",
        opening: "Du har trukket tema: Litterær analyse. Velg et verk du har lest — roman, novelle eller drama — og analyser det. Hva handler det om, og hvilke virkemidler bruker forfatteren?",
        followUps: [
          "Du nevnte verket. Kan du gå dypere inn i temaene? Hva sier teksten om samtiden den ble skrevet i?",
          "Hvordan bruker forfatteren komposisjon og fortellerperspektiv til å skape mening?",
          "Kan du sammenligne dette verket med et annet fra samme epoke eller av en annen forfatter?",
          "Hvilken epoke tilhører verket — realisme, modernisme eller noe annet — og hva kjennetegner den epoken?",
        ],
        tooShort: "Kan du utdype det? En god analyse trenger å gå inn på både innhold, form og kontekst.",
        closing: "Takk. Jeg har nå et godt grunnlag for å vurdere din litterære kompetanse.",
      },
      {
        name: "Retorikk og sakprosa",
        opening: "Du har trukket tema: Retorikk og sakprosa. Forklar hva en retorisk analyse er, og hvilke elementer den inkluderer.",
        followUps: [
          "Hva er de tre appelleringsformene etos, logos og patos — og hvordan brukes de i overtalelse?",
          "Gi et eksempel på en tekst eller tale du har analysert retorisk, og beskriv virkemidlene.",
          "Hva kjennetegner sakprosa som sjanger, og hva skiller den fra skjønnlitteratur?",
          "Hvordan vurderer du om en kilde er troverdig og faglig relevant?",
        ],
        tooShort: "Prøv å gå mer konkret til verks — bruk fagbegreper og gi eksempler.",
        closing: "Takk. Jeg setter nå karakter basert på det du har presentert.",
      },
      {
        name: "Språkhistorie og norske dialekter",
        opening: "Du har trukket tema: Språkhistorie og norske dialekter. Forklar hvorfor Norge har to skriftspråk, og hva som er bakgrunnen for det.",
        followUps: [
          "Hva er sammenhengen mellom språk, kultur og identitet i norsk sammenheng?",
          "Hva kjennetegner utviklingen av talespråket i Norge de siste tiårene?",
          "Hva er samnorsk-debatten, og hvorfor ble den kontroversiell?",
          "Reflekter over hvordan dialekter og sosiolekter påvirker kommunikasjon og tilhørighet.",
        ],
        tooShort: "Kan du utdype? Prøv å trekk inn konkrete eksempler fra norsk språkhistorie.",
        closing: "Bra. Jeg har fått et godt innblikk i din forståelse av norsk språk og kultur.",
      },
      {
        name: "Norrøn litteratur og mytologi",
        opening: "Du har trukket tema: Norrøn litteratur og mytologi. Hva kjennetegner norrøn litteratur, og hvilke sjangere finnes innen den?",
        followUps: [
          "Hva er en norrøn saga, og hva skiller islendingesagaene fra kongesagaene?",
          "Hva er Edda-diktningen, og hva forteller den oss om norrøn mytologi og verdensbilde?",
          "Hvilken betydning har norrøn kultur og litteratur for norsk kulturell identitet i dag?",
          "Kan du nevne et norrønt verk du kjenner og si noe om temaene i det?",
        ],
        tooShort: "Prøv å utdype med konkrete verk, navn og fagbegreper.",
        closing: "Takk. Jeg vurderer nå din kunnskap om norrøn litteratur.",
      },
      {
        name: "Modernisme og samtidslyrikk",
        opening: "Du har trukket tema: Modernisme og samtidslyrikk. Hva kjennetegner modernistisk diktning, og hva er de viktigste bruddene med eldre litteraturtradisjon?",
        followUps: [
          "Hvem er noen sentrale norske eller nordiske modernistiske forfattere, og hva preget verkene deres?",
          "Hva kjennetegner lyrikk som sjanger — rytme, rim, bilder og komposisjon?",
          "Analyser et dikt du kjenner: hva er tema, og hvilke virkemidler bruker dikteren?",
          "Hva er forskjellen mellom modernisme og postmodernisme i litteraturen?",
        ],
        tooShort: "Kan du gi et mer konkret svar? Bruk gjerne et bestemt dikt eller forfatter som eksempel.",
        closing: "Bra. Jeg setter nå karakter basert på din forståelse av lyrikk og modernisme.",
      },
      {
        name: "Sjangerlære — epikk, lyrikk og dramatikk",
        opening: "Du har trukket tema: Sjangerlære. Forklar de tre hovedsjangrene i litteraturen — epikk, lyrikk og dramatikk — og hva som kjennetegner dem.",
        followUps: [
          "Hva er de viktigste episke sjangrene, og hva skiller roman fra novelle?",
          "Hva er komposisjon i en fortelling, og hva betyr begreper som ramme, in medias res og kronologi?",
          "Forklar begrepene jeg-forteller og allvitende forteller, og hva effekten er av hvert valg.",
          "Velg en tekst du har lest og plasser den i en sjanger — begrunn svaret ditt.",
        ],
        tooShort: "Utdyp gjerne med eksempler fra konkrete tekster du kjenner.",
        closing: "Takk. Jeg vurderer nå din sjangerkompetanse.",
      },
      {
        name: "Sammensatte tekster og mediekritikk",
        opening: "Du har trukket tema: Sammensatte tekster og mediekritikk. Forklar hva en sammensatt tekst er, og gi eksempler på slike tekster.",
        followUps: [
          "Hva er semiotikk, og hva er forskjellen mellom verbale og visuelle tegn?",
          "Drøft hvordan reklame og sosiale medier bruker virkemidler for å påvirke oss.",
          "Hva er kildekritikk, og hva bør du sjekke når du vurderer en nettartikkel eller et innlegg?",
          "Hva er fake news og desinformasjon, og hvilken rolle spiller algoritmene i spredningen?",
        ],
        tooShort: "Prøv å gå dypere — trekk inn konkrete eksempler fra medier du kjenner.",
        closing: "Takk. Jeg setter nå karakter basert på det du har presentert.",
      },
      {
        name: "Realisme og naturalisme",
        opening: "Du har trukket tema: Realisme og naturalisme. Hva kjennetegner realistisk litteratur, og når oppstod retningen?",
        followUps: [
          "Hva er naturalisme, og hva skiller den fra realismen?",
          "Hvem er Henrik Ibsen, og hva kjennetegner hans dramatikk?",
          "Velg ett av Ibsens skuespill og analyser et sentralt tema i det.",
          "Hva sier realistisk litteratur om samfunnsproblemer, og er den fortsatt relevant i dag?",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete verk og forfatternavn.",
        closing: "Takk. Jeg vurderer nå din kunnskap om norsk og skandinavisk realisme.",
      },
    ],
  },

  // ─── MATEMATIKK (MAT09-01, 1T) ──────────────────────────────────────────────
  matematikk: {
    topics: [
      {
        name: "Derivasjon og funksjonsdrøfting",
        opening: "Du har trukket tema: Derivasjon og funksjonsdrøfting. Forklar hva derivasjon er, og hva den deriverte forteller oss om en funksjon.",
        followUps: [
          "Deriver f av x lik x i tredje minus 3x i andre pluss 2, og finn eventuelle ekstrempunkter.",
          "Hva er sammenhengen mellom fortegnet til den deriverte og om funksjonen er stigende eller synkende?",
          "Hva vil det si at en funksjon har et vendepunkt, og hvordan finner vi det?",
          "Forklar begrepet momentan vekstfart og forskjellen mellom det og gjennomsnittlig vekstfart.",
        ],
        tooShort: "Kan du utdype? Vis gjerne med et konkret eksempel eller regnestykke.",
        closing: "Takk. Jeg har vurdert din matematiske forståelse og setter nå karakter.",
      },
      {
        name: "Trigonometri",
        opening: "Du har trukket tema: Trigonometri. Definer sinus, cosinus og tangens i en rettvinklet trekant.",
        followUps: [
          "Formuler sinussetningen og forklar når vi bruker den.",
          "Formuler cosinussetningen og vis et eksempel på bruk.",
          "En trekant har sider a lik 7, b lik 5 og vinkel C lik 60 grader. Bruk cosinussetningen til å finne side c.",
          "Hva er sammenhengen mellom trigonometri og enhetssirkelen?",
        ],
        tooShort: "Prøv å gå mer konkret til verks — vis gjerne beregninger eller formler.",
        closing: "Takk for svarene dine. Jeg setter nå karakter.",
      },
      {
        name: "Polynomer og algebraiske metoder",
        opening: "Du har trukket tema: Polynomer og algebraiske metoder. Hva er et polynom, og hva kjennetegner en andregradsfunksjon?",
        followUps: [
          "Løs ligningen x i andre minus 5x pluss 6 lik 0, og forklar hvilken metode du bruker.",
          "Hva er polynomdivisjon, og hva bruker vi det til?",
          "Forklar sammenhengen mellom røttene til et polynom og faktoriseringen av det.",
          "Hva er en rasjonale funksjon, og hva kjennetegner dens graf sammenlignet med et polynom?",
        ],
        tooShort: "Kan du gi et mer fullstendig svar? Bruk gjerne formler og eksempler.",
        closing: "Bra. Jeg har nå vurdert dine algebraiske ferdigheter.",
      },
      {
        name: "Sannsynlighetsregning og kombinatorikk",
        opening: "Du har trukket tema: Sannsynlighetsregning og kombinatorikk. Forklar hva sannsynlighet er, og hva vi mener med et utfallsrom.",
        followUps: [
          "Hva er addisjonsprinsippet og multiplikasjonsprinsippet, og når bruker vi dem?",
          "Forklar hva en permutasjon og en kombinasjon er, og gi et eksempel på hvert.",
          "Hva er betinget sannsynlighet, og hva er Bayes' setning?",
          "En pose inneholder 5 røde og 3 blå kuler. Du trekker to uten tilbakelegging. Hva er sannsynligheten for at begge er røde?",
        ],
        tooShort: "Kan du utdype med et konkret regnestykke?",
        closing: "Takk. Jeg setter nå karakter basert på dine svar.",
      },
      {
        name: "Funksjoner og grafer",
        opening: "Du har trukket tema: Funksjoner og grafer. Forklar hva en funksjon er, og gi eksempler på ulike typer funksjoner.",
        followUps: [
          "Hva er definisjonsmengde og verdimengde, og gi et eksempel for en rasjonalfunksjon?",
          "Hva kjennetegner grafen til en lineær, kvadratisk og eksponentiell funksjon?",
          "Hva er en omvendt funksjon, og hva er betingelsen for at en funksjon er inverterbar?",
          "Forklar hva det vil si at to funksjoner er like, og løs f av x lik g av x for konkrete funksjoner.",
        ],
        tooShort: "Prøv å gi et mer presist svar med fagbegreper og eksempler.",
        closing: "Bra. Jeg vurderer nå din forståelse av funksjoner.",
      },
      {
        name: "Lineære ligninger og likningssystemer",
        opening: "Du har trukket tema: Lineære ligninger og likningssystemer. Forklar hva en lineær ligning er, og beskriv løsningsmetoder.",
        followUps: [
          "Løs systemet: 2x pluss 3y lik 7 og x minus y lik 1, og forklar metoden du bruker.",
          "Hva er innsettingsmetoden og addisjonsmetoden, og når passer de best?",
          "Forklar geometrisk hva løsningen på et likningssystem representerer.",
          "Hva skjer med løsningen hvis to ligninger er parallelle eller identiske?",
        ],
        tooShort: "Kan du vise løsningen steg for steg?",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Geometri og koordinatgeometri",
        opening: "Du har trukket tema: Geometri og koordinatgeometri. Forklar hva Pythagoras' setning sier, og gi et eksempel på bruk.",
        followUps: [
          "Hva er formelen for arealet av en trekant, et parallellogram og en sirkel?",
          "Hva er koordinatsystemet, og hva er formelen for avstand mellom to punkter?",
          "Forklar hva en sirkel er, og hva er likningen til en sirkel med sentrum i origo?",
          "Hva er en vektor, og hva er sammenhengen mellom vektorer og koordinatgeometri?",
        ],
        tooShort: "Prøv å utdype med konkrete eksempler og formler.",
        closing: "Bra. Jeg har nå vurdert din geometriforståelse.",
      },
    ],
  },

  // ─── NATURFAG (NAT01-04, Vg1 SF) ────────────────────────────────────────────
  naturfag: {
    topics: [
      {
        name: "Bølger og elektromagnetisk stråling",
        opening: "Du har trukket tema: Bølger og elektromagnetisk stråling. Forklar hva et bølgefenomen er, og gi eksempler på ulike typer bølger.",
        followUps: [
          "Hva kjennetegner det elektromagnetiske spekteret, og hvilke typer stråling inngår i det?",
          "Hva er forskjellen mellom ioniserende og ikke-ioniserende stråling, og hvilke helseeffekter kan de ha?",
          "Forklar hvordan trådløs kommunikasjon fungerer, og hvilke bølger som brukes.",
          "Hva er fotoelektrisk effekt, og hva forteller det oss om lysets natur?",
        ],
        tooShort: "Kan du utdype? Prøv å trekk inn konkrete eksempler og fagbegreper.",
        closing: "Takk. Jeg setter nå karakter basert på det du har forklart.",
      },
      {
        name: "Genetikk og bioteknologi",
        opening: "Du har trukket tema: Genetikk og bioteknologi. Forklar hva DNA er, og hvilken funksjon det har i en celle.",
        followUps: [
          "Hva er arvegang, og hva er forskjellen mellom dominant og recessivt arvegang?",
          "Hva er bioteknologi, og gi eksempler på bruk i dag?",
          "Gi eksempler på bruk av bioteknologi i dag, og drøft etiske spørsmål knyttet til dette.",
          "Hva er mutasjoner, og hva kan forårsake dem?",
        ],
        tooShort: "Prøv å utdype svaret ditt — ta for deg ett punkt grundigere.",
        closing: "Takk. Jeg vurderer nå kunnskapene dine.",
      },
      {
        name: "Klima og bærekraft",
        opening: "Du har trukket tema: Klima og bærekraft. Forklar drivhuseffekten og hva som forårsaker den.",
        followUps: [
          "Hva er forskjellen mellom naturlig og menneskeskapt klimaendring?",
          "Drøft konsekvensene av klimaendringer for natur og samfunn, lokalt og globalt.",
          "Hva er kjemiske bindinger, og hvordan henger de sammen med karbonforbindelsers rolle i klimaet?",
          "Hva gjøres internasjonalt for å begrense klimaendringene, og hva mener du er de viktigste tiltakene?",
        ],
        tooShort: "Kan du gi et mer utfyllende svar? Trekk inn fagbegreper og eksempler.",
        closing: "Takk for refleksjonene dine. Jeg setter nå karakter.",
      },
      {
        name: "Celler og livet",
        opening: "Du har trukket tema: Celler og livet. Forklar hva en celle er, og hva som skiller levende organismer fra ikke-levende materie.",
        followUps: [
          "Hva er de viktigste organellene i en eukaryot celle, og hva gjør de?",
          "Forklar hva fotosyntese er, og hva som produseres i prosessen.",
          "Hva er celleånding, og hva er sammenhengen mellom fotosyntese og celleånding?",
          "Hva er virus, og hva er forskjellen mellom et virus og en bakterie?",
        ],
        tooShort: "Prøv å gi et mer presist svar med fagbegreper.",
        closing: "Takk. Jeg vurderer nå din forståelse av cellebiologi.",
      },
      {
        name: "Kjemiske reaksjoner og stoffer",
        opening: "Du har trukket tema: Kjemiske reaksjoner og stoffer. Forklar hva et grunnstoff og en kjemisk forbindelse er, og gi eksempler.",
        followUps: [
          "Hva er periodesystemet, og hva forteller plasseringen til et grunnstoff om dets egenskaper?",
          "Hva er en kjemisk reaksjon, og hva er konservering av masse?",
          "Forklar hva en syre og en base er, og hva skjer ved nøytralisering?",
          "Hva er forskjellen mellom organiske og uorganiske kjemiske forbindelser?",
        ],
        tooShort: "Kan du utdype? Bruk fagbegreper og gi konkrete eksempler på stoffer.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Universet og romfart",
        opening: "Du har trukket tema: Universet og romfart. Forklar hva big bang-teorien er og hva observasjonsgrunnlaget for den er.",
        followUps: [
          "Hva er solsystemet, og hva kjennetegner de ulike planetene?",
          "Hva er en stjerne, og hva er stjerners livssyklus?",
          "Hva er mørk materie og mørk energi, og hva vet vi om dem?",
          "Hva er den internasjonale romstasjonen, og hva er formålet med romforskning?",
        ],
        tooShort: "Prøv å gi et mer detaljert svar med fagbegreper.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Teknologi og samfunn",
        opening: "Du har trukket tema: Teknologi og samfunn. Forklar hva teknologi er, og gi eksempler på teknologier som har endret samfunnet.",
        followUps: [
          "Hva er kunstig intelligens, og hva er mulighetene og utfordringene ved bruk av det?",
          "Drøft sammenhengen mellom teknologiutvikling og bærekraft.",
          "Hva er personvern, og hvilke utfordringer gir digital teknologi for personvern?",
          "Forklar hva medisinsk teknologi er, og gi eksempler på nyvinninger de siste tiårene.",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete eksempler og fagbegreper.",
        closing: "Bra. Jeg vurderer nå din forståelse av teknologi og samfunn.",
      },
    ],
  },

  // ─── FYSIKK (FYS01-02) ──────────────────────────────────────────────────────
  fysikk: {
    topics: [
      {
        name: "Bevegelse og krefter",
        opening: "Du har trukket tema: Bevegelse og krefter. Forklar hva rettlinjet bevegelse er, og beskriv sammenhengen mellom posisjon, hastighet og akselerasjon.",
        followUps: [
          "En bil bremser fra 30 meter per sekund til 0 på 6 sekunder. Hva er akselerasjonen, og hvilken kraft virker?",
          "Hva sier Newtons andre lov, og hvordan bruker du den til beregninger?",
          "Hva er bevegelsesmengde, og hva sier loven om bevaring av bevegelsesmengde?",
          "Forklar forskjellen mellom skalare og vektorstørrelser, og gi eksempler.",
        ],
        tooShort: "Kan du utdype? Vis gjerne med beregninger eller tegninger.",
        closing: "Takk. Jeg har vurdert din forståelse av mekanikk.",
      },
      {
        name: "Energi og termodynamikk",
        opening: "Du har trukket tema: Energi og termodynamikk. Forklar begrepet energibevaring og gi eksempler på energiomvandlinger.",
        followUps: [
          "Hva er virkningsgrad, og hva begrenser virkningsgraden i praktiske maskiner?",
          "Forklar hva temperatur er, og hva som skjer på molekylnivå når et stoff varmes opp.",
          "Hva er strålingsbalansen til jorda, og hva skjer når den forstyrres?",
          "Hva er forskjellen mellom fornybare og ikke-fornybare energikilder?",
        ],
        tooShort: "Prøv å gi et mer presist svar — bruk fagbegreper og vis forståelse for sammenhengene.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Elektrisitet og magnetisme",
        opening: "Du har trukket tema: Elektrisitet og magnetisme. Forklar sammenhengen mellom ladning, spenning, strøm og motstand.",
        followUps: [
          "Formuler Ohms lov og bruk den på et konkret eksempel.",
          "Hva er et elektrisk felt og et magnetfelt, og hvordan påvirker de hverandre?",
          "Forklar prinsippet bak elektromagnetisk induksjon og et praktisk eksempel på bruk.",
          "Hva er forskjellen mellom serieforbindelse og parallelforbindelse i en krets?",
        ],
        tooShort: "Kan du utdype? Prøv å knytte svaret ditt til konkrete eksempler.",
        closing: "Takk for svarene dine. Jeg vurderer nå.",
      },
      {
        name: "Rettlinjet bevegelse og fritt fall",
        opening: "Du har trukket tema: Rettlinjet bevegelse og fritt fall. Forklar hva fritt fall er, og hvilke krefter virker på et objekt i fritt fall.",
        followUps: [
          "Hva er tyngdeakselerasjonen, og hva er dens verdi nær jordoverflaten?",
          "En stein kastes rett opp med hastighet 15 meter per sekund. Hvor høyt stiger den, og hvor lang tid tar det?",
          "Hva er luftmotstand, og hva er terminalfart?",
          "Forklar Galileos bidrag til forståelsen av bevegelse og fritt fall.",
        ],
        tooShort: "Kan du vise beregningene steg for steg?",
        closing: "Bra. Jeg setter nå karakter basert på dine svar.",
      },
      {
        name: "Bølger og lyd",
        opening: "Du har trukket tema: Bølger og lyd. Forklar hva en mekanisk bølge er, og hva som skiller transversalbølger fra longitudinalbølger.",
        followUps: [
          "Hva er lyd, og hva bestemmer tonehøyde og lydstyrke?",
          "Hva er Dopplereffekten, og gi et eksempel fra dagliglivet?",
          "Hva er interferens og superposisjonsprinsippet?",
          "Hva er resonans, og gi et praktisk eksempel?",
        ],
        tooShort: "Prøv å utdype med konkrete eksempler og fagbegreper.",
        closing: "Takk. Jeg vurderer nå din forståelse av bølgefysikk.",
      },
      {
        name: "Gravitasjon og himmelmekanikk",
        opening: "Du har trukket tema: Gravitasjon og himmelmekanikk. Forklar Newtons gravitasjonslov og hva den sier om kraften mellom to masser.",
        followUps: [
          "Hva er Keplers tre lover, og hva sier de om planetenes bevegelse?",
          "Hva er sirkelbevegelse, og hva er sentripetalkraft?",
          "Forklar hva geostasjonær bane er, og hva den brukes til.",
          "Hva er tidevannskrefter, og hva forårsaker tidevann?",
        ],
        tooShort: "Kan du utdype? Bruk gjerne formler og konkrete eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Atomfysikk og radioaktivitet",
        opening: "Du har trukket tema: Atomfysikk og radioaktivitet. Forklar hva et atom er, og beskriv atomets oppbygging.",
        followUps: [
          "Hva er radioaktivt henfall, og hva er de tre typene stråling — alfa, beta og gamma?",
          "Hva er halveringstid, og hvordan brukes den i radiometrisk datering?",
          "Hva er kjernereaksjoner, og hva er forskjellen mellom fisjon og fusjon?",
          "Drøft bruk og risiko ved radioaktivitet i medisin og energiproduksjon.",
        ],
        tooShort: "Prøv å gi et mer presist svar med fagbegreper.",
        closing: "Bra. Jeg har nå vurdert din kompetanse i atomfysikk.",
      },
    ],
  },

  // ─── KJEMI (KJE01-02) ───────────────────────────────────────────────────────
  kjemi: {
    topics: [
      {
        name: "Syre-base og pH",
        opening: "Du har trukket tema: Syre-base og pH. Forklar hva en syre og en base er ifølge Brønsted-Lowry-teorien.",
        followUps: [
          "Hva er pH, og hva forteller en pH-verdi oss om konsentrasjonen av hydroniumer i løsningen?",
          "En løsning har H-pluss-konsentrasjon på 2,5 ganger 10 i minus femte. Beregn pH-verdien.",
          "Hva er en buffer, og hvorfor er buffere viktige i biologiske systemer som blod?",
          "Hva skjer kjemisk ved nøytralisering, og hva er titrering?",
        ],
        tooShort: "Prøv å utdype med en formel eller et konkret eksempel.",
        closing: "Takk for svarene dine. Jeg vurderer nå din kjemikompetanse.",
      },
      {
        name: "Likevekter og reaksjonsfart",
        opening: "Du har trukket tema: Likevekter og reaksjonsfart. Forklar hva et kjemisk likevektssystem er.",
        followUps: [
          "Hva sier massevirkningsloven, og hvordan bruker vi den til å beregne likevektskonstanten?",
          "Hva er Le Chateliers prinsipp, og gi et eksempel på hvordan et system reagerer på en forstyrrelse?",
          "Hvilke faktorer påvirker reaksjonsfarten, og hva er forklaringen på atomnivå?",
          "Hva er en katalysator, og hva er forskjellen mellom en homogen og en heterogen katalysator?",
        ],
        tooShort: "Kan du gi et mer fullstendig svar med fagbegreper?",
        closing: "Takk. Jeg har nå vurdert din forståelse av kjemiske likevekter.",
      },
      {
        name: "Organisk kjemi",
        opening: "Du har trukket tema: Organisk kjemi. Forklar hva organiske forbindelser er og hva som kjennetegner dem.",
        followUps: [
          "Hva er forskjellen mellom mettede og umettede karbonforbindelser, og hva kjennetegner alkaner, alkener og alkyner?",
          "Forklar reaksjonstypene addisjon og substitusjon med et eksempel for hver.",
          "Hva er funksjonelle grupper, og gi eksempler på alkohol, karboksylsyre og ester.",
          "Hva er grønn kjemi, og hva betyr det for bærekraftig produksjon og nedbrytning av stoffer?",
        ],
        tooShort: "Prøv å gå dypere — bruk fagbegreper og eksempler på faktiske forbindelser.",
        closing: "Bra. Jeg setter nå karakter basert på det du har presentert.",
      },
      {
        name: "Periodesystemet og kjemiske bindinger",
        opening: "Du har trukket tema: Periodesystemet og kjemiske bindinger. Forklar hvordan periodesystemet er organisert, og hva vi kan lese ut av det.",
        followUps: [
          "Hva er forskjellen mellom metaller og ikke-metaller i periodesystemet?",
          "Forklar hva ionebinding, kovalent binding og metallisk binding er, og gi eksempler.",
          "Hva er elektrontetthet og elektronegativitet, og hvordan påvirker de bindingstypen?",
          "Hva er intermolekylære krefter, og hva er van der Waals-krefter og hydrogenbinding?",
        ],
        tooShort: "Kan du utdype med konkrete eksempler på grunnstoffer og forbindelser?",
        closing: "Takk. Jeg vurderer nå din forståelse av kjemiske bindinger.",
      },
      {
        name: "Støkiometri og kjemiske beregninger",
        opening: "Du har trukket tema: Støkiometri og kjemiske beregninger. Forklar hva mol er, og hva Avogadros tall brukes til.",
        followUps: [
          "Hva er molarmasse, og hvordan beregner vi den?",
          "Balanser reaksjonsligningen for forbrenning av propan, og beregn mengder ut fra et gitt antall mol.",
          "Hva er konsentrasjon, og hva er enhetene for molaritet?",
          "Hva er utbytte i en kjemisk reaksjon, og hva er den begrensende reaktant?",
        ],
        tooShort: "Prøv å vise beregningsstegene konkret.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Gasser og tilstandsformer",
        opening: "Du har trukket tema: Gasser og tilstandsformer. Forklar hva de tre tilstandsformene for stoff er, og hva som bestemmer hvilken form et stoff er i.",
        followUps: [
          "Hva er ideell gasslov, og hva sier den om sammenhengen mellom trykk, volum og temperatur?",
          "Hva er daltonslov om partialtrykk?",
          "Hva er damptrykk og kokepunkt, og hva bestemmer disse?",
          "Forklar hva som skjer med et stoff på partikkelnivå når det smelter og koker.",
        ],
        tooShort: "Kan du utdype? Bruk gjerne formler og konkrete eksempler.",
        closing: "Takk. Jeg setter nå karakter basert på dine svar.",
      },
    ],
  },

  // ─── BIOLOGI (BIO01-02) ─────────────────────────────────────────────────────
  biologi: {
    topics: [
      {
        name: "Cellebiologi og celledeling",
        opening: "Du har trukket tema: Cellebiologi og celledeling. Forklar forskjellen mellom en prokaryot og en eukaryot celle.",
        followUps: [
          "Hva er mitose og meiose, og hva er hensikten med hver av dem?",
          "Beskriv cellens organeller — mitokondriene, ribosomene og cellekjernen — og forklar rollene deres.",
          "Hva er homeostase, og gi et eksempel på en reguleringsmekanisme i menneskekroppen.",
          "Hva er cellesyklus, og hva skjer dersom reguleringen svikter?",
        ],
        tooShort: "Kan du utdype? Prøv å forklare mer presist med fagbegreper.",
        closing: "Takk. Jeg vurderer nå din forståelse av cellebiologi.",
      },
      {
        name: "Genetikk og arv",
        opening: "Du har trukket tema: Genetikk og arv. Forklar hva DNA er, og beskriv sammenhengen mellom gen, kromosom og arv.",
        followUps: [
          "Hva er genotype og fenotype, og hva er forskjellen mellom dominant og recessivt allel?",
          "Forklar hva genetisk kode er, og hvordan proteinsyntese foregår i korthet.",
          "Hva er genteknologi, og gi et eksempel på kommersiell bruk og tilhørende etiske spørsmål.",
          "Hva er evolusjonære prosesser, og hvordan fører naturlig utvalg til artsdannelse?",
        ],
        tooShort: "Prøv å gi et mer utfyllende svar — bruk fagbegreper og eksempler.",
        closing: "Takk. Jeg har nå et godt grunnlag for å vurdere dine kunnskaper.",
      },
      {
        name: "Økologi og bærekraft",
        opening: "Du har trukket tema: Økologi og bærekraft. Forklar hva et økosystem er, og beskriv energistrømmen gjennom det.",
        followUps: [
          "Hva er biotiske og abiotiske faktorer i et miljø, og gi eksempler på begge?",
          "Hva er stoffkretsløp, og forklar karbonkretsløpet.",
          "Drøft hvordan menneskelig aktivitet påvirker artsmangfold og bærekraft.",
          "Hva regulerer populasjonsvekst i naturen, og gi eksempler på toppredatorer sin rolle.",
        ],
        tooShort: "Kan du gi et mer utfyllende svar? Trekk inn konkrete eksempler fra naturen.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Fotosyntese og celleånding",
        opening: "Du har trukket tema: Fotosyntese og celleånding. Forklar hva fotosyntese er, og skriv sumformelen for prosessen.",
        followUps: [
          "Hva er lysfasen og mørkereasjonen i fotosyntesen, og hva skjer i hver?",
          "Forklar hva celleånding er, og hva er ATP sin rolle i cellens energiomsetning?",
          "Hva er forskjellen mellom aerob og anaerob celleånding?",
          "Drøft sammenhengen mellom fotosyntese og det globale karbonkretsløpet.",
        ],
        tooShort: "Prøv å gå dypere — forklar det biokjemiske grunnlaget.",
        closing: "Takk. Jeg vurderer nå din forståelse av energiomsetning i celler.",
      },
      {
        name: "Nervesystemet og sanser",
        opening: "Du har trukket tema: Nervesystemet og sanser. Forklar hva sentralnervesystemet og det perifere nervesystemet er.",
        followUps: [
          "Hva er en nevron, og hvordan overføres nerveimpulser?",
          "Hva er en synapse, og hva er nevrotransmittere?",
          "Hva er sanseceller, og forklar kort hvordan synet eller hørselen fungerer.",
          "Hva er refleksbue, og gi et eksempel på en refleks?",
        ],
        tooShort: "Kan du utdype? Bruk fagbegreper og konkrete eksempler.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Immunsystemet og sykdom",
        opening: "Du har trukket tema: Immunsystemet og sykdom. Forklar hva immunsystemet er, og hva som er dets viktigste oppgaver.",
        followUps: [
          "Hva er det uspesifikke og det spesifikke immunforsvaret, og hva kjennetegner hvert?",
          "Hva er antistoffer, og hva er B- og T-lymfocytter sin rolle?",
          "Hva er vaksinasjon, og hvordan fungerer det biologisk?",
          "Hva er autoimmune sykdommer, og hva er AIDS — og hva gjør HIV mot immunsystemet?",
        ],
        tooShort: "Prøv å gi et mer presist svar med fagbegreper.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Plantenes biologi",
        opening: "Du har trukket tema: Plantenes biologi. Forklar hva som kjennetegner planteceller, og hva som skiller dem fra dyreceller.",
        followUps: [
          "Hva er plantenes organ — rot, stengel og blad — og hva er deres funksjon?",
          "Hva er transpirert, og hva er transporten av vann og næringsstoffer i planter?",
          "Hva er pollinering og frøspredning, og hva er plantenes reproduksjonsstrategier?",
          "Hva er tropisme, og gi eksempler på fototropisme og gravitropisme?",
        ],
        tooShort: "Kan du utdype? Bruk fagbegreper og konkrete eksempler på plantearter.",
        closing: "Bra. Jeg vurderer nå din forståelse av plantenes biologi.",
      },
    ],
  },

  // ─── HISTORIE (HIS01-03, Vg3) ───────────────────────────────────────────────
  historie: {
    topics: [
      {
        name: "Andre verdenskrig og okkupasjonen av Norge",
        opening: "Du har trukket tema: Andre verdenskrig og okkupasjonen av Norge. Hva var de viktigste årsakene til at krigen brøt ut i 1939?",
        followUps: [
          "Hva skjedde i Norge den 9. april 1940, og hva var den umiddelbare norske responsen?",
          "Drøft Vidkun Quislings rolle under okkupasjonen og hva begrepet 'quisling' har blitt et symbol på.",
          "Hva var Holocausts omfang i Norge — hvem var de norske jødene, og hva skjedde med dem?",
          "Hva var de viktigste konsekvensene av krigen for Europa og for etableringen av FN og menneskerettighetserklæringen?",
        ],
        tooShort: "Kan du utdype? En god historisk analyse krever årsaker, forløp og konsekvenser.",
        closing: "Takk. Jeg har nå vurdert din historiske forståelse.",
      },
      {
        name: "Ideologier på 1900-tallet",
        opening: "Du har trukket tema: Ideologier på 1900-tallet. Gi en oversikt over de viktigste politiske ideologiene som preget det 20. århundret.",
        followUps: [
          "Hva kjennetegner fascisme og nazisme, og hva skilte dem fra hverandre?",
          "Hva er kommunisme som ideologi, og hva er sammenhengen med den russiske revolusjonen i 1917?",
          "Drøft den kalde krigen som ideologisk konflikt mellom kapitalisme og kommunisme.",
          "Reflekter over hvordan ideologier ble brukt til å legitimere undertrykkelse og terror på 1900-tallet.",
        ],
        tooShort: "Prøv å nyansere svaret ditt — historiske ideologier er komplekse.",
        closing: "Takk for refleksjonene dine. Jeg setter nå karakter.",
      },
      {
        name: "Kolonisering og avkolonisering",
        opening: "Du har trukket tema: Kolonisering og avkolonisering. Hva var de viktigste drivkreftene bak europeisk kolonisering fra 1400-tallet?",
        followUps: [
          "Hva var konsekvensene av kolonisering for de koloniserte folkene — politisk, kulturelt og økonomisk?",
          "Når og hvordan begynte avkolonisering, og hva var de viktigste hendelsene?",
          "Drøft sammenhengen mellom kolonialhistorien og globale ulikheter i dag.",
          "Forklar hva migrasjon er, og drøft årsaker til at folk i dag flykter eller emigrerer.",
        ],
        tooShort: "Kan du gi et mer utfyllende svar med konkrete eksempler og land?",
        closing: "Takk. Jeg vurderer nå din historiske kompetanse.",
      },
      {
        name: "Den industrielle revolusjon",
        opening: "Du har trukket tema: Den industrielle revolusjon. Forklar hva den industrielle revolusjon var, og når og hvor den startet.",
        followUps: [
          "Hva var de teknologiske nyvinningene som drev industrialiseringen, og hva er dampmaskinen sin rolle?",
          "Hva var de sosiale konsekvensene av industrialiseringen — for arbeiderklassen, familien og byene?",
          "Hva er kapitalisme, og hvordan vokste den frem under industrialiseringen?",
          "Drøft sammenhengen mellom industrialiseringen og fremveksten av fagforeninger og arbeiderbevegelsen.",
        ],
        tooShort: "Kan du gi et mer utfyllende svar? Trekk inn konkrete land og perioder.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Den kalde krigen",
        opening: "Du har trukket tema: Den kalde krigen. Forklar hva den kalde krigen var, og hva som utløste den etter andre verdenskrig.",
        followUps: [
          "Hva er NATO og Warszawapakten, og hva var formålet med dem?",
          "Hva var Cubakrisen i 1962, og hva var faren den representerte?",
          "Drøft våpenkappløpet og romkappløpet som uttrykk for supermaktrivalisering.",
          "Hva var de viktigste hendelsene som ledet til den kalde krigens slutt, og hva skjedde med Sovjetunionen?",
        ],
        tooShort: "Prøv å utdype med konkrete hendelser og årstall.",
        closing: "Bra. Jeg har nå vurdert din kunnskap om den kalde krigen.",
      },
      {
        name: "Norsk samtidshistorie etter 1945",
        opening: "Du har trukket tema: Norsk samtidshistorie etter 1945. Forklar hva som kjennetegnet Norges gjenreisning etter krigen.",
        followUps: [
          "Hva er velferdsstaten, og hvilken rolle spilte Arbeiderpartiet i å bygge den opp?",
          "Hva er oljeøkonomien, og hva betydde funn av olje i Nordsjøen for Norge?",
          "Drøft Norges rolle i NATO og forholdet mellom Norge og EU.",
          "Hva er de viktigste samfunnsendringene i Norge fra 1970-tallet til i dag?",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete hendelser, personer og årstall.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Første verdenskrig og mellomkrigstiden",
        opening: "Du har trukket tema: Første verdenskrig og mellomkrigstiden. Hva var de viktigste årsakene til at første verdenskrig brøt ut i 1914?",
        followUps: [
          "Hva var alliansesystemet, og hva var Sarajevoskuddet og dets konsekvenser?",
          "Hva var Versaillestraktaten, og hva var dens konsekvenser for Germany og Europa?",
          "Drøft mellomkrigstidens krise — den store depresjonen og fremveksten av ekstreme bevegelser.",
          "Hva er sammenhengen mellom første verdenskrig og fremveksten av fascismen?",
        ],
        tooShort: "Prøv å nyansere svaret — forklar årsaker, forløp og konsekvenser.",
        closing: "Takk. Jeg vurderer nå din forståelse av mellomkrigstiden.",
      },
    ],
  },

  // ─── SAMFUNNSFAG (SAK01-01, VGS) ────────────────────────────────────────────
  samfunnsfag: {
    topics: [
      {
        name: "Demokrati og maktfordeling",
        opening: "Du har trukket tema: Demokrati og maktfordeling. Hva kjennetegner et demokrati, og hva er de viktigste demokratiske prinsippene?",
        followUps: [
          "Hva er maktfordelingsprinsippet, og hvilke tre statsmakter har vi i Norge?",
          "Hva er forskjellen mellom direkte og representativt demokrati, og gi et eksempel på hvert?",
          "Hva er menneskerettigheter, og gi eksempler på brudd på disse i dag?",
          "Drøft sammenhengen mellom maktutøvelse, ytringsfrihet og demokrati.",
        ],
        tooShort: "Kan du gi et mer fullstendig svar med konkrete eksempler?",
        closing: "Takk. Jeg har nå et godt grunnlag for å vurdere deg.",
      },
      {
        name: "Identitet, sosialisering og utenforskap",
        opening: "Du har trukket tema: Identitet, sosialisering og utenforskap. Forklar hva sosialisering er, og hvem de viktigste sosialiseringsagentene er.",
        followUps: [
          "Hva er identitet, og hvordan påvirkes den av familie, venner, kultur og sosiale medier?",
          "Hva er sosial ulikhet, og hvilke faktorer bidrar til utenforskap i det norske samfunnet?",
          "Drøft sammenhengen mellom rasisme, diskriminering og hatefulle ytringer.",
          "Hva er kulturelle likheter og ulikheter i Norge og Sápmi, og hva betyr urfolksrettigheter?",
        ],
        tooShort: "Prøv å utdype — trekk inn konkrete eksempler fra samfunnet.",
        closing: "Takk for refleksjonene. Jeg setter nå karakter.",
      },
      {
        name: "Økonomi og globalisering",
        opening: "Du har trukket tema: Økonomi og globalisering. Forklar hva personlig økonomi er, og hvilke faktorer påvirker den.",
        followUps: [
          "Hva er forskjellen mellom BNP og levestandard, og hva er HDI?",
          "Hva er globalisering, og drøft positive og negative konsekvenser av den.",
          "Hva er næringsstruktur, og hvordan har arbeidslivet i Norge endret seg de siste tiårene?",
          "Drøft sammenhengen mellom teknologisk innovasjon og endringer i arbeidsmarkedet.",
        ],
        tooShort: "Kan du gi et mer detaljert svar? Bruk fagbegreper og eksempler.",
        closing: "Takk. Jeg vurderer nå din samfunnsfaglige forståelse.",
      },
      {
        name: "Velferdsstaten og arbeidsliv",
        opening: "Du har trukket tema: Velferdsstaten og arbeidsliv. Forklar hva den norske velferdsstaten er, og hva som kjennetegner den.",
        followUps: [
          "Hva er NAV, og hvilke ytelser tilbyr det norske velferdssystemet?",
          "Hva er trepartssamarbeidet i norsk arbeidsliv, og hva er fagforeninger sin rolle?",
          "Drøft utfordringene den norske velferdsstaten møter i fremtiden — eldrebølge og finansiering.",
          "Hva er arbeidsløshet, og hva er sammenhengen mellom utdanning og arbeidsmuligheter?",
        ],
        tooShort: "Prøv å utdype med konkrete eksempler og tall fra norsk samfunn.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Medier, kildekritikk og påvirkning",
        opening: "Du har trukket tema: Medier, kildekritikk og påvirkning. Forklar hva medienes rolle er i et demokratisk samfunn.",
        followUps: [
          "Hva er pressens fire friheter og VVP — Vær Varsom-plakaten?",
          "Hva er kildekritikk, og hva bør du sjekke når du vurderer en nyhetsartikkel?",
          "Hva er desinformasjon og propaganda, og hva er algoritmenes rolle i informasjonsspredning?",
          "Drøft sammenhengen mellom sosiale medier, polarisering og demokratisk deltakelse.",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete eksempler på mediebruk og -påvirkning.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Internasjonale organisasjoner og konflikter",
        opening: "Du har trukket tema: Internasjonale organisasjoner og konflikter. Hva er FN, og hva er FNs rolle i internasjonal politikk?",
        followUps: [
          "Hva er NATO, og hva er kollektivt forsvar og Artikkel 5?",
          "Hva er EU, og hva er Norges forhold til EU gjennom EØS-avtalen?",
          "Drøft årsaker til en aktuell internasjonal konflikt og hva som kan bidra til fred.",
          "Hva er menneskerettigheter, og hva er Internasjonalt straffedomstol (ICC)?",
        ],
        tooShort: "Prøv å gi et mer nyansert svar med konkrete eksempler.",
        closing: "Bra. Jeg har nå vurdert din forståelse av internasjonal politikk.",
      },
      {
        name: "Kriminalitet og rettsvesen",
        opening: "Du har trukket tema: Kriminalitet og rettsvesen. Forklar hva kriminalitet er, og hva som er de viktigste teoriene om årsaker til kriminalitet.",
        followUps: [
          "Hva er straffens formål ifølge norsk rett — er det hevn, rehabilitering eller noe annet?",
          "Hva er domstolssystemet i Norge, og hva er forskjellen mellom sivil- og strafferett?",
          "Drøft sammenhengen mellom sosiale forhold og kriminalitet.",
          "Hva er politiets rolle i et demokratisk samfunn, og hva er borgernes rettigheter ved pågripelse?",
        ],
        tooShort: "Kan du utdype? Bruk fagbegreper og konkrete eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
    ],
  },

  // ─── ENGELSK (ENG01-05, Vg1 SF) ─────────────────────────────────────────────
  engelsk: {
    topics: [
      {
        name: "Literature and society",
        opening: "You have drawn the topic: Literature and society. Choose a piece of literature in English you have read, and tell me about its themes and what it says about the society it depicts.",
        followUps: [
          "How does the author use literary devices — such as symbolism, irony or narrative perspective — to convey meaning?",
          "Can you compare this text to another work from a different time or place? What similarities and differences do you find?",
          "What does the text tell us about power, identity or social inequality?",
          "How has the topic you described in the text changed in society from then to now?",
        ],
        tooShort: "Could you elaborate? A good literary analysis requires discussion of both content and form.",
        closing: "Thank you. I will now assess your answers.",
      },
      {
        name: "Global English and cultural diversity",
        opening: "You have drawn the topic: Global English and cultural diversity. How did English become a global language, and what are the consequences of this?",
        followUps: [
          "What is the difference between English as a native language and English as a lingua franca?",
          "How does cultural diversity manifest in English-speaking societies, and what challenges and opportunities does it create?",
          "Can you reflect on how media and popular culture from English-speaking countries influence other cultures?",
          "What are some arguments for and against using English as the world's common language?",
        ],
        tooShort: "Could you develop your answer further? I need more specific examples and reasoning.",
        closing: "Thank you. I will now set your grade.",
      },
      {
        name: "Critical reading and academic language",
        opening: "You have drawn the topic: Critical reading and academic language. How do you approach reading a non-fiction text critically?",
        followUps: [
          "What makes a source reliable, and how do you evaluate sources in an academic context?",
          "Explain the difference between fact and opinion, and give an example from a text you have read.",
          "How do you structure an academic argument, and what is the role of evidence?",
          "Can you reflect on how language choices — tone, register, vocabulary — shape how a message is received?",
        ],
        tooShort: "Could you elaborate with more specific examples?",
        closing: "Thank you. I have now assessed your academic language skills.",
      },
      {
        name: "Technology, AI and the digital world",
        opening: "You have drawn the topic: Technology, AI and the digital world. What are the main ways technology has changed how we communicate and access information?",
        followUps: [
          "What are the benefits and risks of artificial intelligence, and how is it changing jobs and society?",
          "How do social media platforms affect our identity, mental health and relationships?",
          "What is digital privacy, and what rights should people have over their personal data?",
          "How can we use technology responsibly to support sustainability and solve global problems?",
        ],
        tooShort: "Could you develop your answer with more specific examples?",
        closing: "Thank you. I will now set your grade.",
      },
      {
        name: "Environmental challenges and sustainability",
        opening: "You have drawn the topic: Environmental challenges and sustainability. What are the main environmental challenges facing the world today?",
        followUps: [
          "What is climate change, and what are the most important causes and consequences?",
          "What is the difference between climate change mitigation and adaptation?",
          "How are English-speaking countries contributing to or addressing the climate crisis?",
          "What can individuals, businesses and governments do to live more sustainably?",
        ],
        tooShort: "Could you elaborate? Please include specific examples and countries.",
        closing: "Thank you. I have now assessed your knowledge of environmental issues.",
      },
      {
        name: "Politics, democracy and human rights",
        opening: "You have drawn the topic: Politics, democracy and human rights. What are the core principles of democracy, and why are they important?",
        followUps: [
          "What are human rights, and what international frameworks protect them?",
          "How does the political system work in a major English-speaking country of your choice?",
          "What threats do democracies face today — from populism, polarisation or authoritarian governments?",
          "Can you discuss a current political issue from an English-speaking country and present different perspectives on it?",
        ],
        tooShort: "Could you develop your answer with more specific examples and reasoning?",
        closing: "Thank you. I will now set your grade.",
      },
      {
        name: "The American Dream and social mobility",
        opening: "You have drawn the topic: The American Dream and social mobility. What is the American Dream, and where does the concept come from?",
        followUps: [
          "To what extent is the American Dream a reality today? What evidence supports or challenges it?",
          "How do race, class and gender affect social mobility in the United States?",
          "Can you connect the American Dream to a work of literature, film or music you know?",
          "How does the idea of the American Dream compare to similar ideals in other societies?",
        ],
        tooShort: "Could you elaborate with more specific examples and perspectives?",
        closing: "Thank you. I have now assessed your knowledge of American society and culture.",
      },
      {
        name: "Post-colonial literature and identity",
        opening: "You have drawn the topic: Post-colonial literature and identity. What is post-colonial literature, and what kinds of themes does it typically explore?",
        followUps: [
          "Can you discuss a specific post-colonial work you have read, and what it says about identity or belonging?",
          "How does language become a tool of power or resistance in post-colonial contexts?",
          "What is the relationship between colonialism and issues of race and inequality that persist today?",
          "How do post-colonial writers challenge or rewrite dominant historical narratives?",
        ],
        tooShort: "Could you elaborate with a specific text or author as an example?",
        closing: "Thank you. I will now set your grade.",
      },
    ],
  },

  // ─── GEOGRAFI (GEO01-02) ────────────────────────────────────────────────────
  geografi: {
    topics: [
      {
        name: "Klimaendringer og naturkatastrofer",
        opening: "Du har trukket tema: Klimaendringer og naturkatastrofer. Forklar hva drivhuseffekten er, og hvilke menneskelige aktiviteter bidrar mest til klimaendringer.",
        followUps: [
          "Velg en aktuell natur- eller miljøkatastrofe og gjør rede for årsaker og konsekvenser for mennesker og natur.",
          "Hva er forskjellen mellom klimatilpasning og klimautslippsreduksjon, og hvilke tiltak brukes i dag?",
          "Drøft hva klimaendringer betyr for norsk natur, arktis og nordområdene spesielt.",
          "Hva er Norges ansvar i den globale klimadugnaden, og hva gjøres konkret?",
        ],
        tooShort: "Prøv å gi et mer utfyllende svar med konkrete eksempler og steder.",
        closing: "Takk. Jeg vurderer nå din geografifaglige forståelse.",
      },
      {
        name: "Ressursbruk og bærekraft",
        opening: "Du har trukket tema: Ressursbruk og bærekraft. Forklar hva bærekraftig utvikling er, og hvilke tre dimensjoner det innebærer.",
        followUps: [
          "Drøft ulike interesser knyttet til ressurs- og arealbruk i Norge og Sápmi.",
          "Hva er sammenhengen mellom din egen ressursbruk og global ulikhet?",
          "Hva kjennetegner geologiske prosesser som har dannet norske landskap, og hvordan utnytter vi ressursene der?",
          "Reflekter over sammenhengen mellom forbruksmønster i rike land og miljøpåvirkning globalt.",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete eksempler og geografiske områder.",
        closing: "Takk for svarene dine. Jeg setter nå karakter.",
      },
      {
        name: "Demografi og globale levekår",
        opening: "Du har trukket tema: Demografi og globale levekår. Hva er demografi, og hva er de viktigste demografiske endringene i verden i dag?",
        followUps: [
          "Hva er årsaker til befolkningsvekst i noen regioner og nedgang i andre?",
          "Drøft ulike levekår i forskjellige deler av verden — hva forklarer ulikheten?",
          "Hva er årsaker til migrasjon, og hva er forskjellen mellom flyktning og arbeidsinnvandrer?",
          "Hva er urbanisering, og hvilke utfordringer skaper det for byer i fattige land?",
        ],
        tooShort: "Prøv å nyansere svaret ditt med eksempler fra ulike deler av verden.",
        closing: "Takk. Jeg har nå et godt grunnlag for å vurdere deg.",
      },
      {
        name: "Norges geografi og naturressurser",
        opening: "Du har trukket tema: Norges geografi og naturressurser. Beskriv Norges geografiske kjennetegn — landform, klima og naturressurser.",
        followUps: [
          "Hva er en fjord, og hva er de geologiske prosessene bak fjorddannelse?",
          "Hva er Norges viktigste naturressurser, og hvordan har de formet norsk økonomi og samfunn?",
          "Drøft sammenhengen mellom naturgeografi og næringsvirksomhet i ulike deler av Norge.",
          "Hva er nordområdenes geopolitiske og ressursmessige betydning?",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete steder og geografiske prosesser.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Urbanisering og byplanlegging",
        opening: "Du har trukket tema: Urbanisering og byplanlegging. Forklar hva urbanisering er, og hva som driver befolkningsvekst i byer.",
        followUps: [
          "Hva er utfordringene med rask urbanisering i land i det globale sør?",
          "Hva er bærekraftig byplanlegging, og gi eksempler på tiltak i norske byer?",
          "Hva er segregasjon i byer, og hva er sammenhengen med sosial ulikhet?",
          "Drøft fordeler og ulemper med å bo i by versus bygd.",
        ],
        tooShort: "Prøv å gi et mer detaljert svar med eksempler fra konkrete byer.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Geopolitikk og internasjonale konflikter",
        opening: "Du har trukket tema: Geopolitikk og internasjonale konflikter. Forklar hva geopolitikk er, og hva som kjennetegner internasjonale konflikter i dag.",
        followUps: [
          "Hva er årsaker til en aktuell regional konflikt, og hvilke ressurser eller grenser er involvert?",
          "Hva er sammenhengen mellom ressurser — olje, vann, mineraler — og geopolitiske spenninger?",
          "Hva er flyktningkriser, og hva er FNs og nabostatenes ansvar?",
          "Drøft Norges geopolitiske posisjon i Arktis og i NATO-samarbeidet.",
        ],
        tooShort: "Kan du utdype med konkrete eksempler og steder?",
        closing: "Bra. Jeg vurderer nå din geopolitiske forståelse.",
      },
      {
        name: "Natur- og kulturlandskap",
        opening: "Du har trukket tema: Natur- og kulturlandskap. Forklar hva som er forskjellen på naturlandskap og kulturlandskap.",
        followUps: [
          "Hva er jordsmonn, og hva bestemmer jordsmonntypene i ulike regioner?",
          "Hva er tropisk regnskog, savanne og tundra — og hva kjennetegner dem?",
          "Drøft sammenhengen mellom avskoging, landbruk og klimaendringer.",
          "Hva er UNESCO-verdensarv, og gi eksempler på natur- og kulturminner i Norge?",
        ],
        tooShort: "Prøv å gi et mer utfyllende svar med eksempler fra ulike klimasoner.",
        closing: "Takk. Jeg setter nå karakter.",
      },
    ],
  },

  // ─── MATEMATIKK R1 (MAT03-02) ───────────────────────────────────────────────
  "matematikk-r1": {
    topics: [
      {
        name: "Derivasjon og grenseverdier",
        opening: "Du har trukket tema: Derivasjon og grenseverdier. Forklar hva en grenseverdi er, og hva sammenhengen er mellom grenseverdier og kontinuitet.",
        followUps: [
          "Hva er definisjonen av den deriverte, og hvordan bestemmer vi den geometrisk, algebraisk og numerisk?",
          "Deriver f av x lik e til x pluss ln av x, og forklar hvilke regler du bruker.",
          "Hva er sammenhengen mellom derivasjon og eksponentiell og logistisk vekst?",
          "Forklar hva en omvendt funksjon er, og hvordan deriverer vi den?",
        ],
        tooShort: "Kan du utdype med konkrete eksempler og regneregler?",
        closing: "Takk. Jeg vurderer nå din forståelse av R1-matematikk.",
      },
      {
        name: "Logaritmer og eksponentialfunksjoner",
        opening: "Du har trukket tema: Logaritmer og eksponentialfunksjoner. Forklar hva en logaritme er, og hva sammenhengen er mellom logaritme og eksponentialfunksjon.",
        followUps: [
          "Hva er regnereglene for logaritmer, og gi et eksempel på bruk av hver?",
          "Løs ligningen 3 til x lik 81, og forklar fremgangsmåten.",
          "Hva er logistisk vekst, og hva kjennetegner den sammenlignet med eksponentiell vekst?",
          "Beskriv et reelt eksempel der eksponentialfunksjoner brukes til modellering.",
        ],
        tooShort: "Prøv å gå mer konkret til verks med formler og eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Vektorer i planet",
        opening: "Du har trukket tema: Vektorer i planet. Forklar hva en vektor er, og hva som skiller den fra en skalar størrelse.",
        followUps: [
          "Hva er regnereglene for vektorer — addisjon, subtraksjon og skalarmultiplikasjon?",
          "Hva er skalarproduktet, og hva kan vi bruke det til?",
          "Forklar parameterframstilling av en linje i planet med et eksempel.",
          "Gi et praktisk eksempel fra naturvitenskapen der vektorer brukes.",
        ],
        tooShort: "Kan du gi et mer fullstendig svar med eksempler?",
        closing: "Bra. Jeg har nå vurdert din vektorkompetanse.",
      },
      {
        name: "Kombinatorikk og sannsynlighetsregning",
        opening: "Du har trukket tema: Kombinatorikk og sannsynlighetsregning. Forklar multiplikasjonsprinsippet og permutasjoner.",
        followUps: [
          "Hva er binomialkoeffisienten, og hva er Pascals trekant?",
          "Hva er Binomialsetningen, og gi et eksempel på bruk?",
          "Hva er diskrete sannsynlighetsfordelinger, og hva er forventet verdi og varians?",
          "Hva er normalfordelingen, og hva kjennetegner en normalfordelt variabel?",
        ],
        tooShort: "Kan du utdype med konkrete beregninger?",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Trigonometriske identiteter og likninger",
        opening: "Du har trukket tema: Trigonometriske identiteter og likninger. Forklar hva enhetssirkelen er, og hva sinus og cosinus representerer der.",
        followUps: [
          "Hva er de viktigste trigonometriske identitetene, som Pythagoras-identiteten?",
          "Løs ligningen 2 sin x minus 1 lik 0 i intervallet null til 2 pi, og forklar fremgangsmåten.",
          "Hva er addisjonsteoremer for sinus og cosinus, og vis et eksempel?",
          "Forklar hva det vil si å dekomponere en funksjon som sin til a pluss fi.",
        ],
        tooShort: "Prøv å gi et mer presist svar med formler og beregninger.",
        closing: "Bra. Jeg vurderer nå din trigonometrikompetanse.",
      },
      {
        name: "Geometri med vektorer",
        opening: "Du har trukket tema: Geometri med vektorer. Forklar hva en linje og et plan er i det todimensjonale rom med vektorer.",
        followUps: [
          "Hva er normalvektor, og hva er likningen til en linje med kjent normalvektor?",
          "Forklar hva parallelle og vinkelrette linjer er i termer av vektorer.",
          "Hva er avstand fra et punkt til en linje, og vis beregningsformelen?",
          "Gi et eksempel der geometri og vektorer brukes i en praktisk situasjon.",
        ],
        tooShort: "Kan du utdype med formler og konkrete regneeksempler?",
        closing: "Takk. Jeg setter nå karakter.",
      },
    ],
  },

  // ─── MATEMATIKK R2 (MAT03-02) ───────────────────────────────────────────────
  "matematikk-r2": {
    topics: [
      {
        name: "Integrasjon",
        opening: "Du har trukket tema: Integrasjon. Forklar hva et integral er, og hva analysens fundamentalteorem sier.",
        followUps: [
          "Hva er forskjellen mellom et bestemt og ubestemt integral?",
          "Beregn integralet av f av x lik 3x i andre fra 0 til 2, og forklar geometrisk hva svaret representerer.",
          "Beskriv en algoritme for numerisk integrasjon og forklar når vi bruker den.",
          "Hva er praktiske anvendelser av integrasjon — gi to eksempler fra naturvitenskapen.",
        ],
        tooShort: "Kan du utdype? Vis gjerne med beregninger.",
        closing: "Takk. Jeg vurderer nå din integrasjonskompetanse.",
      },
      {
        name: "Rekker og følger",
        opening: "Du har trukket tema: Rekker og følger. Forklar hva en tallfølge er, og hva som kjennetegner en aritmetisk og geometrisk følge.",
        followUps: [
          "Hva er en uendelig rekke, og når konvergerer den?",
          "Gi et praktisk eksempel der geometriske rekker brukes, og gjør en beregning.",
          "Hva er en rekursiv sammenheng, og hvordan kan programmering brukes til å utforske den?",
          "Hva er Taylorrekker, og hva brukes de til i praksis?",
        ],
        tooShort: "Prøv å gi et mer presist svar — bruk fagbegreper og eksempler.",
        closing: "Takk. Jeg setter nå karakter basert på dine svar.",
      },
      {
        name: "Trigonometriske funksjoner og vektorer i rommet",
        opening: "Du har trukket tema: Trigonometriske funksjoner og vektorer i rommet. Forklar hva radianer er og sammenhengen til grader.",
        followUps: [
          "Hva kjennetegner sinus- og cosinusfunksjonene som periodiske funksjoner?",
          "Deriver f av x lik sin av x og g av x lik cos av x, og forklar regelen.",
          "Forklar hva en vektor i rommet er, og hva er kryssprodukt?",
          "Gi et eksempel der trigonometriske funksjoner og vektorer brukes til å modellere et fysisk fenomen.",
        ],
        tooShort: "Kan du utdype? Bruk gjerne formler og konkrete tall.",
        closing: "Takk. Jeg har nå vurdert din R2-kompetanse.",
      },
      {
        name: "Differensiallikninger",
        opening: "Du har trukket tema: Differensiallikninger. Forklar hva en differensialligning er, og gi et eksempel fra naturvitenskapen.",
        followUps: [
          "Hva er en separabel differensialligning, og forklar løsningsmetoden?",
          "Hva er eksponentiell vekst og forfall som differensiallikning, og gi en praktisk tolkning?",
          "Hva er logistisk vekstmodell som differensialligning, og hva er bæreevnen?",
          "Hva er numerisk løsning av differensialligninger — forklar Eulers metode.",
        ],
        tooShort: "Prøv å gi et mer konkret svar med formler og eksempler.",
        closing: "Bra. Jeg setter nå karakter.",
      },
      {
        name: "Komplekse tall og polynomlikninger",
        opening: "Du har trukket tema: Komplekse tall. Forklar hva imaginærenheten i er, og hva et komplekst tall er.",
        followUps: [
          "Hva er regnereglene for komplekse tall — addisjon, multiplikasjon og konjugert?",
          "Hva er absoluttverdi og argument til et komplekst tall, og hva er polarform?",
          "Hva sier fundamentalteoremet for algebra om røttene til et polynom?",
          "Løs andregradsligning med negativ diskriminant, og beskriv de komplekse røttene.",
        ],
        tooShort: "Kan du utdype med konkrete regnestykker og fagbegreper?",
        closing: "Takk. Jeg vurderer nå din kompetanse.",
      },
      {
        name: "Lineær algebra og matriser",
        opening: "Du har trukket tema: Lineær algebra og matriser. Forklar hva en matrise er, og hva matriser brukes til.",
        followUps: [
          "Hva er matrisemultiplikasjon, og hva er reglene for det?",
          "Hva er determinant til en 2 ganger 2 matrise, og hva sier det om løsbarheten av et likningssystem?",
          "Forklar hva en invers matrise er, og når den eksisterer.",
          "Gi et praktisk eksempel der matriser brukes til å modellere et problem.",
        ],
        tooShort: "Prøv å gi et mer presist svar med formler og eksempler.",
        closing: "Bra. Jeg har nå vurdert din lineær-algebra-kompetanse.",
      },
    ],
  },

  // ─── MATEMATIKK 2P (MAT05-04) ───────────────────────────────────────────────
  "matematikk-2p": {
    topics: [
      {
        name: "Økonomi og personlig finans",
        opening: "Du har trukket tema: Økonomi og personlig finans. Forklar hva vekstfaktor er, og gi et eksempel på bruk.",
        followUps: [
          "Hva er forskjellen mellom nominell lønn og reallønn, og hva er prisindeks?",
          "Drøft konsekvensene av å ta opp lån med høy rente over lang tid — bruk gjerne et beregningseksempel.",
          "Hva er prosentpoeng, og hva er forskjellen mellom det og prosent?",
          "Hva bør man vurdere når man tar økonomiske beslutninger som ung?",
        ],
        tooShort: "Kan du utdype med et konkret regnestykke?",
        closing: "Takk. Jeg vurderer nå din forståelse av 2P-matematikk.",
      },
      {
        name: "Statistikk og dataanalyse",
        opening: "Du har trukket tema: Statistikk og dataanalyse. Forklar hva sentralmål er, og nevn de viktigste typene.",
        followUps: [
          "Hva er spredningsmål, og hva forteller standardavvik oss?",
          "Hva er forskjellen mellom et stolpediagram og et histogram — når bruker vi hva?",
          "Drøft et datasett fra media eller lokalsamfunnet og hva det forteller oss.",
          "Hva kan gå galt når vi tolker statistikk, og hva er villedende grafikk?",
        ],
        tooShort: "Prøv å gi et mer utfyllende svar med konkrete eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Geometri og målestokk",
        opening: "Du har trukket tema: Geometri og målestokk. Forklar hva formlikhet er, og gi et eksempel.",
        followUps: [
          "Hva er målestokk, og hva betyr en målestokk på 1 til 50 000?",
          "Forklar Pythagoras' setning og gi et praktisk eksempel på bruk.",
          "Hva kjennetegner ulike geometriske figurer — trekanter, parallellogrammer og sirkler?",
          "Drøft sammenhengen mellom geometri og praktiske yrker.",
        ],
        tooShort: "Kan du utdype? Vis gjerne med beregninger.",
        closing: "Bra. Jeg har nå vurdert dine ferdigheter i 2P-matematikk.",
      },
      {
        name: "Funksjoner og modellering",
        opening: "Du har trukket tema: Funksjoner og modellering. Forklar hva en funksjon er, og gi eksempler på lineære og proporsjonale funksjoner.",
        followUps: [
          "Hva er sammenhengen mellom stigningstall og vekstfart i en lineær modell?",
          "Hva er en andregradsfunksjon, og hva kjennetegner grafen?",
          "Gi et eksempel der en matematisk funksjon brukes til å modellere noe fra virkeligheten.",
          "Hva er eksponentiell vekst, og hva er en praktisk anvendelse av det?",
        ],
        tooShort: "Prøv å gi et mer presist svar med formler og konkrete eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Sannsynlighet og kombinatorikk",
        opening: "Du har trukket tema: Sannsynlighet og kombinatorikk. Forklar hva sannsynlighet er og hva som er et utfallsrom.",
        followUps: [
          "Hva er forskjellen mellom kombinasjon og permutasjon — og gi et eksempel på hvert?",
          "En lotto-rekke består av 7 tall valgt blant 34. Hvor mange mulige rekker er det?",
          "Hva er betinget sannsynlighet, og gi et praktisk eksempel?",
          "Drøft sammenhengen mellom statistikk, sannsynlighet og beslutningstaking.",
        ],
        tooShort: "Kan du utdype med et konkret regnestykke?",
        closing: "Bra. Jeg setter nå karakter.",
      },
    ],
  },

  // ─── KJEMI 2 (KJE01-02) ─────────────────────────────────────────────────────
  "kjemi-2": {
    topics: [
      {
        name: "Redoksreaksjoner og elektrokjemi",
        opening: "Du har trukket tema: Redoksreaksjoner og elektrokjemi. Forklar hva en redoksreaksjon er, og hva oksidation og reduksjon innebærer.",
        followUps: [
          "Hva er et elektrokjemisk element, og hva er sammenhengen mellom spenning og energi?",
          "Forklar elektrolyse og gi et praktisk eksempel på bruk.",
          "Hva er sammenhengen mellom ladning, masse og spenning i elektrokjemiske beregninger?",
          "Gi et eksempel på en redoksreaksjon i biologiske systemer.",
        ],
        tooShort: "Kan du utdype med fagbegreper og et beregningseksempel?",
        closing: "Takk. Jeg vurderer nå din kjemi 2-kompetanse.",
      },
      {
        name: "Likevekter og entropi",
        opening: "Du har trukket tema: Likevekter og entropi. Forklar hva entropi er, og hva det sier om spontanitet i kjemiske reaksjoner.",
        followUps: [
          "Hva er sammenhengen mellom entalpi, entropi og Gibbs fri energi?",
          "Forklar massevirkningsloven og bruk den på et likevektssystem.",
          "Hva er en buffer, og drøft dens rolle i biologiske og industrielle systemer.",
          "Hva er løselighetslikevekt, og gi et eksempel på beregning?",
        ],
        tooShort: "Prøv å koble termodynamikkbegrepene til konkrete kjemiske eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Organisk kjemi og syntese",
        opening: "Du har trukket tema: Organisk kjemi og syntese. Forklar reaksjonstypene addisjon, eliminasjon og substitusjon.",
        followUps: [
          "Hva er hydrolyse og kondensasjon, og gi et eksempel på hver?",
          "Hva er faktorer som påvirker utbytte og renhet i en organisk syntese?",
          "Forklar prinsippene for kromatografi og hva vi bruker det til.",
          "Hva er biologiske makromolekyler, og hva kjennetegner proteiner og karbohydrater?",
        ],
        tooShort: "Kan du gi et mer detaljert svar med eksempler på konkrete forbindelser?",
        closing: "Bra. Jeg har nå vurdert din organisk-kjemi-kompetanse.",
      },
      {
        name: "Kjemisk analyse og instrumentering",
        opening: "Du har trukket tema: Kjemisk analyse og instrumentering. Forklar hva kvantitativ og kvalitativ analyse er.",
        followUps: [
          "Hva er spektroskopi, og hva bruker vi IR- og NMR-spektroskopi til?",
          "Hva er kromatografi, og hva er prinsippet bak gass- og væskekromatografi?",
          "Forklar hva en standardkurve er, og hva den brukes til i konsentrasjonsbestemmelse.",
          "Drøft usikkerhet og feilkilder i kjemiske analyser.",
        ],
        tooShort: "Kan du utdype med konkrete teknikker og eksempler?",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Polymerer og materialvitenskap",
        opening: "Du har trukket tema: Polymerer og materialvitenskap. Forklar hva en polymer er, og hva som kjennetegner polymere materialer.",
        followUps: [
          "Hva er forskjellen mellom addisjons- og kondensasjonspolymerer, og gi eksempler?",
          "Hva er biologiske polymerer — proteiner, nukleinsyrer, karbohydrater — og hva er særtrekk?",
          "Drøft miljøproblemene knyttet til plast og mulige løsninger.",
          "Hva er nanomaterialer, og hva er noen aktuelle anvendelser?",
        ],
        tooShort: "Prøv å gi et mer presist svar med kjemiske eksempler.",
        closing: "Bra. Jeg setter nå karakter.",
      },
    ],
  },

  // ─── FYSIKK 2 (FYS01-02) ────────────────────────────────────────────────────
  "fysikk-2": {
    topics: [
      {
        name: "Bevegelse i to dimensjoner og relativitet",
        opening: "Du har trukket tema: Bevegelse i to dimensjoner og relativitet. Forklar hva krumlinjet bevegelse er, og gi et eksempel.",
        followUps: [
          "Hva er sentripetalkraft, og hva forårsaker den i sirkelbevegelse?",
          "Beskriv prinsippene i spesiell relativitetsteori — hva sier de om tid og rom?",
          "Hva sier generell relativitetsteori, og hva er forskjellen fra den spesielle?",
          "Forklar energibevaring i et gravitasjonelt sentralfelt med et eksempel.",
        ],
        tooShort: "Kan du utdype? Bruk fagbegreper og konkrete beregninger.",
        closing: "Takk. Jeg vurderer nå din fysikk 2-kompetanse.",
      },
      {
        name: "Elektromagnetisme og induksjon",
        opening: "Du har trukket tema: Elektromagnetisme og induksjon. Beskriv det elektriske og magnetiske feltet og sammenhengen mellom dem.",
        followUps: [
          "Hva sier Faradays lov om induksjon, og gi et praktisk eksempel?",
          "Forklar hvordan en generator fungerer basert på elektromagnetisk induksjon.",
          "Hva er Lorentzkraften, og hva brukes den til?",
          "Drøft sammenhengen mellom elektromagnetisk induksjon og bærekraftig energiproduksjon.",
        ],
        tooShort: "Prøv å knytte svaret ditt til konkrete teknologiske eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Kvantemekanikk og moderne fysikk",
        opening: "Du har trukket tema: Kvantemekanikk og moderne fysikk. Forklar hva som skiller kvanteobjekter fra klassiske objekter.",
        followUps: [
          "Hva er bølge-partikkel-dualisme, og hva er et konkret eksempel?",
          "Hva er Heisenbergs usikkerhetsprinsipp?",
          "Forklar hva som menes med at energi er kvantisert, med et eksempel.",
          "Hva er forskjellen mellom fusjon og fisjon, og hva er potensialet for energiproduksjon?",
        ],
        tooShort: "Kan du utdype? Kvantemekanikk krever presis bruk av fagbegreper.",
        closing: "Bra. Jeg har nå vurdert din moderne fysikk-kompetanse.",
      },
      {
        name: "Termodynamikk og statistisk mekanikk",
        opening: "Du har trukket tema: Termodynamikk. Forklar hva de to første termodynamiske lovene sier.",
        followUps: [
          "Hva er entropi, og hva sier den andre termodynamiske loven om irreversible prosesser?",
          "Hva er en Carnot-prosess, og hva er maksimal virkningsgrad for en varmemotor?",
          "Forklar sammenhengen mellom temperatur og gjennomsnittlig kinetisk energi i en gass.",
          "Hva er en fasediagram, og hva er trippelpunktet til et stoff?",
        ],
        tooShort: "Prøv å gi et mer presist svar med fagbegreper og eksempler.",
        closing: "Takk. Jeg vurderer nå din termodynamikkompetanse.",
      },
      {
        name: "Optikk og bølgefysikk",
        opening: "Du har trukket tema: Optikk og bølgefysikk. Forklar hva refleksjon og brytning av lys er, og formuler Snells lov.",
        followUps: [
          "Hva er totalrefleksjon, og gi et eksempel på bruk i optiske fibere?",
          "Hva er diffraksjon og interferens, og gi et eksempel på hvert?",
          "Hva er en linse, og hva er forskjellen mellom konveks og konkav linse?",
          "Forklar hva polarisering av lys er, og hva det brukes til.",
        ],
        tooShort: "Kan du utdype? Bruk gjerne formler og konkrete eksempler.",
        closing: "Bra. Jeg setter nå karakter.",
      },
    ],
  },

  // ─── BIOLOGI 2 (BIO01-02) ───────────────────────────────────────────────────
  "biologi-2": {
    topics: [
      {
        name: "Evolusjon og artsdannelse",
        opening: "Du har trukket tema: Evolusjon og artsdannelse. Forklar Darwins teori om naturlig utvalg og hva som driver evolusjon.",
        followUps: [
          "Hva er genetisk variasjon, og hva er kildene til variasjon i en populasjon?",
          "Forklar hva artsdannelse er, og hva som er mekanismene bak det?",
          "Hva er molekylær evolusjon, og hva forteller DNA-sekvenser oss om slektskap?",
          "Drøft et eksempel på evolusjon som kan observeres i dag.",
        ],
        tooShort: "Kan du utdype? Trekk inn konkrete eksempler fra naturen.",
        closing: "Takk. Jeg vurderer nå din evolusjonsforståelse.",
      },
      {
        name: "Genetikk og genteknologi",
        opening: "Du har trukket tema: Genetikk og genteknologi. Forklar hva genetisk kode er og hvordan genuttrykk reguleres.",
        followUps: [
          "Hva er transkripsjon og translasjon, og hva er rollen til mRNA og tRNA?",
          "Forklar hva epigenetikk er og gi et eksempel.",
          "Hva er CRISPR-Cas9, og hva er mulighetene og etiske dilemmaene ved genredigering?",
          "Hva er kommersiell bruk av genteknologi i dag, og drøft etiske spørsmål.",
        ],
        tooShort: "Prøv å gå dypere — bruk fagbegreper og eksempler.",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Populasjonsøkologi og bærekraft",
        opening: "Du har trukket tema: Populasjonsøkologi og bærekraft. Forklar hva som regulerer vekst og størrelse på en populasjon.",
        followUps: [
          "Hva er bæreevne, og hva skjer med en populasjon som overskrider den?",
          "Hva er energistrøm og stoffkretsløp i et økosystem, og gi et konkret eksempel?",
          "Drøft sammenhengen mellom biologisk mangfold og stabiliteten til et økosystem.",
          "Vurder konsekvensene av menneskelig aktivitet på artsmangfold, og drøft tiltak.",
        ],
        tooShort: "Kan du utdype med konkrete eksempler fra natur eller forskning?",
        closing: "Bra. Jeg har nå vurdert din biologi 2-kompetanse.",
      },
      {
        name: "Biokjemi og metabolisme",
        opening: "Du har trukket tema: Biokjemi og metabolisme. Forklar hva metabolisme er, og hva som er forskjellen mellom katabolisme og anabolisme.",
        followUps: [
          "Hva er ATP, og hva er ATP sin sentrale rolle i cellulær energiomsetning?",
          "Forklar glykolyse og hva som produseres under prosessen.",
          "Hva er enzymer, og hva er aktive senter og substratspesifisitet?",
          "Hva er hormoner, og hva er eksempler på hormoner som regulerer metabolismen?",
        ],
        tooShort: "Kan du gi et mer presist svar med fagbegreper og kjemiske eksempler?",
        closing: "Takk. Jeg setter nå karakter.",
      },
      {
        name: "Nevrobiologi og sanser",
        opening: "Du har trukket tema: Nevrobiologi. Forklar hva en nevron er, og beskriv aksjonspotensialets forløp.",
        followUps: [
          "Hva er myelinskjede, og hva er saltatorisk ledning?",
          "Forklar hva en synapse er, og hva eksitatoriske og inhibitoriske nevrotransmittere gjør.",
          "Hva er hjernens ulike deler — storhjernen, lillehjernen og hjernestammen — og hva gjør de?",
          "Drøft sammenhengen mellom rusmidler og nevrotransmittersystemer.",
        ],
        tooShort: "Prøv å gi et mer presist svar med fagbegreper.",
        closing: "Bra. Jeg vurderer nå din nevrobiologiforståelse.",
      },
    ],
  },
};

// ─── FRANSK (FSP01-04 Niveau I — Fransk 1) ──────────────────────────────────
// Kompetansemål: LK20 Fremmedspråk nivå I
// Eksamen foregår på fransk.
const FRANSK_1_DATA: SubjectData = {
  topics: [
    {
      name: "Présentation personnelle et famille",
      opening: "Tu as tiré le thème : Présentation personnelle et famille. Présente-toi — ton âge, ta famille, ta ville — et décris ta relation avec ta famille.",
      followUps: [
        "Comment est ta relation avec tes parents et tes frères et sœurs ? Vous faites quoi ensemble ?",
        "Décris ta maison ou ton appartement. C'est comment ?",
        "Qu'est-ce que tu aimes faire avec ta famille pendant les vacances ?",
        "Comment est différente la famille française de la famille norvégienne, selon toi ?",
      ],
      tooShort: "Peux-tu développer davantage ? Utilise des phrases complètes et donne des détails.",
      closing: "Merci. J'ai maintenant une bonne base pour évaluer ta compétence.",
    },
    {
      name: "La vie quotidienne et l'école",
      opening: "Tu as tiré le thème : La vie quotidienne et l'école. Décris ta journée typique — le matin, à l'école et le soir.",
      followUps: [
        "Quelles sont tes matières préférées à l'école, et pourquoi ?",
        "Comment est le système scolaire en France ? Qu'est-ce qui est différent du système norvégien ?",
        "Qu'est-ce que tu fais après l'école ? Quels sont tes loisirs ?",
        "Comment organises-tu ton temps libre entre le travail scolaire et les activités ?",
      ],
      tooShort: "Essaie de développer ta réponse avec plus de détails et de vocabulaire.",
      closing: "Très bien. Je vais maintenant évaluer ta compétence linguistique.",
    },
    {
      name: "La gastronomie française",
      opening: "Tu as tiré le thème : La gastronomie française. Qu'est-ce que tu sais sur la cuisine française ? Cite des plats ou des spécialités typiques.",
      followUps: [
        "Décris un repas typiquement français — les entrées, le plat principal, le dessert.",
        "Pourquoi la gastronomie est-elle importante dans la culture française ?",
        "Compare la cuisine française avec la cuisine norvégienne — qu'est-ce qui est similaire et différent ?",
        "As-tu déjà mangé un plat français ? Décris ton expérience.",
      ],
      tooShort: "Peux-tu développer et donner des exemples concrets ?",
      closing: "Merci. J'ai les informations nécessaires pour t'évaluer.",
    },
    {
      name: "Paris et les régions françaises",
      opening: "Tu as tiré le thème : Paris et les régions françaises. Décris Paris — ce que tu sais sur la ville, ses monuments et son importance.",
      followUps: [
        "Quels sont les monuments les plus célèbres de Paris ? Décris-en un.",
        "La France a beaucoup de régions différentes. Peux-tu en décrire quelques-unes ?",
        "Quelle région de France aimerais-tu visiter, et pourquoi ?",
        "Quelle est la différence entre la vie à Paris et la vie en province ?",
      ],
      tooShort: "Développe davantage — donne des noms de lieux et des descriptions.",
      closing: "Bien. Je peux maintenant évaluer tes connaissances.",
    },
    {
      name: "Les loisirs et les vacances",
      opening: "Tu as tiré le thème : Les loisirs et les vacances. Décris ce que tu aimes faire pendant ton temps libre et comment les Français passent leurs vacances.",
      followUps: [
        "Qu'est-ce que tu fais le week-end ? Tes loisirs préférés ?",
        "Où les Français vont-ils souvent en vacances ? Pourquoi ?",
        "Compare les habitudes de vacances en France et en Norvège.",
        "Si tu pouvais partir en vacances en France, où irais-tu ? Pourquoi ?",
      ],
      tooShort: "Peux-tu donner plus de détails sur tes activités ?",
      closing: "Merci. J'ai suffisamment d'informations pour t'évaluer.",
    },
    {
      name: "La mode et le style de vie",
      opening: "Tu as tiré le thème : La mode et le style de vie. La France est connue pour la mode. Qu'est-ce que tu sais sur la mode française ?",
      followUps: [
        "Quelles marques ou créateurs français connais-tu ? Décris leur style.",
        "Comment la mode reflète-t-elle la culture et l'identité d'un pays ?",
        "Comment est le style vestimentaire des jeunes en France comparé à la Norvège ?",
        "Penses-tu que la mode est importante ? Pourquoi ou pourquoi pas ?",
      ],
      tooShort: "Développe ton opinion avec des arguments et des exemples.",
      closing: "Très bien. Je vais maintenant noter ta performance.",
    },
  ],
};

// ─── FRANSK (FSP01-04 Niveau II — Fransk 2) ─────────────────────────────────
// Kompetansemål: LK20 Fremmedspråk nivå II (FSP03-01)
// Eksamen foregår på fransk.
const FRANSK_2_DATA: SubjectData = {
  topics: [
    {
      name: "Culture et identité française",
      opening: "Tu as tiré le thème : Culture et identité française. Comment définirais-tu l'identité française ? Quelles sont les valeurs et les traditions qui caractérisent la France ?",
      followUps: [
        "La devise française est « Liberté, Égalité, Fraternité ». Comment ces valeurs se manifestent-elles dans la société française contemporaine ?",
        "En quoi la culture française — la gastronomie, l'art, la littérature — a-t-elle influencé le reste du monde ?",
        "Quelles tensions existe-t-il entre tradition et modernité dans la société française actuelle ?",
        "Comment l'immigration a-t-elle transformé l'identité culturelle de la France au XXIe siècle ?",
      ],
      tooShort: "Développe ta réflexion avec des exemples concrets et des arguments.",
      closing: "Merci. J'ai maintenant une base solide pour évaluer ta compétence.",
    },
    {
      name: "La Francophonie",
      opening: "Tu as tiré le thème : La Francophonie. Qu'est-ce que la Francophonie ? Décris l'étendue du français dans le monde et l'importance de cet espace culturel.",
      followUps: [
        "Sur quels continents parle-t-on français ? Donne des exemples de pays francophones et leur contexte historique.",
        "Quelle est l'importance de la langue française comme langue internationale et diplomatique ?",
        "En quoi les pays francophones d'Afrique diffèrent-ils culturellement de la France métropolitaine ?",
        "Quels sont les défis auxquels la Francophonie fait face face à la domination de l'anglais ?",
      ],
      tooShort: "Approfondis ta réponse — cite des pays, des organisations et des enjeux précis.",
      closing: "Très bien. J'évalue maintenant ta maîtrise de la langue et du contenu.",
    },
    {
      name: "Littérature et cinéma français",
      opening: "Tu as tiré le thème : Littérature et cinéma français. Présente un auteur, un roman ou un film français que tu as étudié, et explique pourquoi il est important.",
      followUps: [
        "Quels sont les thèmes principaux de l'œuvre que tu as choisie ? Qu'est-ce qu'elle dit de la société ?",
        "Comment la Nouvelle Vague a-t-elle révolutionné le cinéma français et international ?",
        "Cite quelques grands auteurs français — Molière, Camus, Sartre — et leurs contributions à la littérature.",
        "En quoi la littérature et le cinéma reflètent-ils les valeurs et les préoccupations d'une société ?",
      ],
      tooShort: "Précise davantage — parle d'œuvres concrètes et d'auteurs ou de réalisateurs.",
      closing: "Merci. Cela me donne suffisamment pour évaluer ta compétence culturelle et linguistique.",
    },
    {
      name: "Société et politique en France",
      opening: "Tu as tiré le thème : Société et politique en France. Décris le système politique français — comment fonctionne la Ve République ?",
      followUps: [
        "Quelles sont les institutions principales de la République française — le Président, l'Assemblée nationale, le Sénat ?",
        "Quels sont les grands défis sociaux auxquels la France fait face aujourd'hui — chômage, inégalités, immigration ?",
        "Comment fonctionne le système de protection sociale en France — la Sécurité sociale, les retraites ?",
        "Comparez le système politique français et le système norvégien. Quelles sont les différences principales ?",
      ],
      tooShort: "Développe ta réponse avec des institutions, des chiffres ou des exemples précis.",
      closing: "Très bien. J'ai les éléments nécessaires pour évaluer ta compétence.",
    },
    {
      name: "Environnement et développement durable",
      opening: "Tu as tiré le thème : Environnement et développement durable. Quels sont les principaux défis environnementaux auxquels la France et le monde font face ?",
      followUps: [
        "Quelle est la politique énergétique de la France ? Quelle est la place du nucléaire dans le mix énergétique ?",
        "Comment la France contribue-t-elle aux accords internationaux sur le climat — l'Accord de Paris ?",
        "Quelles actions individuelles et collectives peut-on prendre pour réduire notre impact environnemental ?",
        "Compare les politiques environnementales de la France et de la Norvège. Laquelle te semble plus efficace ?",
      ],
      tooShort: "Approfondit ta réponse — cite des accords, des politiques et des exemples concrets.",
      closing: "Merci. J'évalue maintenant tes connaissances et ta capacité à t'exprimer.",
    },
    {
      name: "Jeunesse et mode de vie",
      opening: "Tu as tiré le thème : Jeunesse et mode de vie. Comment décrirait-on la vie des jeunes en France aujourd'hui ? Quelles sont leurs valeurs, leurs préoccupations ?",
      followUps: [
        "Comment les réseaux sociaux influencent-ils l'identité et le mode de vie des jeunes en France ?",
        "Quelles sont les différences et similarités entre la jeunesse norvégienne et française ?",
        "Comment les jeunes Français voient-ils leur avenir professionnel — l'emploi, les études, les voyages ?",
        "Quelles causes sociales ou politiques mobilisent les jeunes en France aujourd'hui ?",
      ],
      tooShort: "Développe ta réflexion — donne des exemples de tendances ou de phénomènes sociaux.",
      closing: "Très bien. Cela me donne une bonne base pour t'évaluer.",
    },
    {
      name: "Éducation et vie professionnelle",
      opening: "Tu as tiré le thème : Éducation et vie professionnelle. Décris le système éducatif français — du primaire au supérieur — et compare-le au système norvégien.",
      followUps: [
        "Qu'est-ce que le baccalauréat français ? Comment fonctionne cet examen et quelle est son importance ?",
        "Quelles sont les Grandes Écoles en France et pourquoi sont-elles prestigieuses ?",
        "Comment le marché du travail en France se distingue-t-il du marché norvégien ?",
        "Quels sont les droits des travailleurs en France — les syndicats, les 35 heures, les congés ?",
      ],
      tooShort: "Précise davantage avec des exemples d'institutions ou de politiques éducatives.",
      closing: "Merci. J'ai suffisamment d'éléments pour évaluer ta compétence.",
    },
    {
      name: "Technologie et société moderne",
      opening: "Tu as tiré le thème : Technologie et société moderne. Comment la révolution numérique transforme-t-elle la société française et européenne ?",
      followUps: [
        "Quels sont les avantages et les risques de l'intelligence artificielle pour la société ?",
        "Comment la France positionne-t-elle sa politique numérique par rapport aux États-Unis et à la Chine ?",
        "En quoi les réseaux sociaux ont-ils changé la communication, la politique et les relations sociales ?",
        "Quelles mesures la France et l'Union européenne prennent-elles pour réguler les grandes entreprises technologiques ?",
      ],
      tooShort: "Développe ta réponse — apporte des exemples et des arguments structurés.",
      closing: "Très bien. Je vais maintenant noter ta performance globale.",
    },
  ],
};

EXAMINER_DATA["fransk-1"] = FRANSK_1_DATA;
EXAMINER_DATA["fransk-2"] = FRANSK_2_DATA;

const ALIASES: Record<string, string> = {
  "matematikk-1t": "matematikk",
  "kjemi-1": "kjemi",
  "fysikk-1": "fysikk",
  "biologi-1": "biologi",
};

export function getSubjectData(subject: string): SubjectData {
  const key = ALIASES[subject] ?? subject;
  return EXAMINER_DATA[key] ?? EXAMINER_DATA["matematikk"];
}

export function pickRandomTopic(subject: string): ExamTopic {
  const data = getSubjectData(subject);
  return data.topics[Math.floor(Math.random() * data.topics.length)];
}

export function mockGrade(answers: string[]): { grade: number; feedback: string } {
  const totalWords = answers.reduce((sum, a) => sum + a.trim().split(/\s+/).length, 0);
  const avgWords = totalWords / Math.max(answers.length, 1);

  let grade: number;
  if (avgWords >= 60) grade = 6;
  else if (avgWords >= 45) grade = 5;
  else if (avgWords >= 30) grade = 4;
  else if (avgWords >= 18) grade = 3;
  else if (avgWords >= 8) grade = 2;
  else grade = 1;

  const feedbackMap: Record<number, string> = {
    6: "Fremragende prestasjon. Du viste svært god faglig forståelse, brukte korrekt terminologi og ga velstrukturerte svar med gode eksempler.",
    5: "Meget god prestasjon. Du demonstrerte solid faglig kunnskap og klarte å forklare de viktigste begrepene på en tydelig måte.",
    4: "God prestasjon. Du viste forståelse for de sentrale elementene i temaet, men noen svar kunne vært mer utfyllende.",
    3: "Nokså god prestasjon. Du har grunnleggende kunnskap om temaet, men svarene mangler dybde og nøyaktighet på flere punkter.",
    2: "Du viste noe kunnskap, men svarene var ofte for korte og upresise. Det er tydelig at temaet trenger mer øving.",
    1: "Svarene viste svært begrenset forståelse av temaet. Øv mer på dette fagområdet.",
  };

  return { grade, feedback: feedbackMap[grade] };
}
