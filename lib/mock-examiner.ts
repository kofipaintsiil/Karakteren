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
          "Hva er big bang-teorien og hva er observasjonsgrunnlaget for den?",
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
          "Hva er forskjellen mellom fornybare og ikke-fornybare energikilder, og hva er kvantemekanikk sin rolle i moderne energiteknologi?",
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
          "Hva er relativitetsteorien, og hva sier spesiell relativitetsteori om rom og tid?",
        ],
        tooShort: "Kan du utdype? Prøv å knytte svaret ditt til konkrete eksempler.",
        closing: "Takk for svarene dine. Jeg vurderer nå.",
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
          "Hva er forskjellen mellom mettet og umettet karbonforbindelser, og hva kjennetegner alkaner, alkener og alkyner?",
          "Forklar reaksjonstypene addisjon og substitusjon med et eksempel for hver.",
          "Hva er funksjonelle grupper, og gi eksempler på alkohol, karboksylsyre og ester.",
          "Hva er grønn kjemi, og hva betyr det for bærekraftig produksjon og nedbrytning av stoffer?",
        ],
        tooShort: "Prøv å gå dypere — bruk fagbegreper og eksempler på faktiske forbindelser.",
        closing: "Bra. Jeg setter nå karakter basert på det du har presentert.",
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
          "Hva er forskjellen mellom BNP og levestandard, og hva er HPI?",
          "Hva er globalisering, og drøft positive og negative konsekvenser av den.",
          "Hva er næringsstruktur, og hvordan har arbeidslivet i Norge endret seg de siste tiårene?",
          "Drøft sammenhengen mellom teknologisk innovasjon og endringer i arbeidsmarkedet.",
        ],
        tooShort: "Kan du gi et mer detaljert svar? Bruk fagbegreper og eksempler.",
        closing: "Takk. Jeg vurderer nå din samfunnsfaglige forståelse.",
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
          "Hva er Taylorrækker, og hva brukes de til i praksis?",
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
    ],
  },
};

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
