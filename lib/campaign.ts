import { agent, listings, shortPrice, type Listing } from "@/lib/data";

export type Goal = "prodej" | "zakazky" | "znacka" | "web";
export type ChannelKey = "google" | "meta" | "sklik";

export type Subject = {
  listingId?: string;
  region?: string;
  segment?: string;
  offer?: string;
};

export const regions = ["Praha 6", "Praha 1–10", "Praha + 30 km", "Středočeský kraj", "Jihomoravský kraj", "Plzeňský kraj", "Moravskoslezský kraj"];

export const goalInfo: Record<Goal, { title: string; subjectStep: string; intro: string }> = {
  prodej: { title: "Prodat nemovitost", subjectStep: "Nemovitost", intro: "Vyberte nabídku, kterou chcete zpropagovat. Zbytek vám postupně navrhneme a vždy před dalším krokem schválíte." },
  zakazky: { title: "Nabrat nové zakázky", subjectStep: "Zadání", intro: "Řekněte, ve kterém regionu hledáte majitele a co jim nabídnete. Podle toho navrhneme kampaň." },
  znacka: { title: "Podpořit svou značku", subjectStep: "Zaměření", intro: "Vyberte, co chcete o sobě říct. Značku stavíme z vašich skutečných výsledků, ne z obecných frází." },
  web: { title: "Víc návštěv na webu makléře", subjectStep: "Zadání", intro: "Web už funguje. Vyberte, co chcete, aby na něm lidé udělali, a my jim ho ukážeme." },
};

export const segments: Record<Goal, { key: string; title: string; text: string }[]> = {
  prodej: [],
  zakazky: [
    { key: "byty", title: "Majitelé bytů", text: "Nejčastější zakázky, rychlý prodej." },
    { key: "domy", title: "Majitelé domů a vil", text: "Vyšší provize, delší rozhodování." },
    { key: "pozemky", title: "Majitelé pozemků", text: "Užší cílová skupina, nižší konkurence." },
  ],
  znacka: [
    { key: "duvera", title: "Důvěra a reference", text: "Ukážeme vaše hodnocení a výsledky." },
    { key: "expert", title: "Odbornost", text: "Tipy pro prodejce a kupující z vaší praxe." },
    { key: "region", title: "Znalost regionu", text: "Jste ten makléř pro konkrétní lokalitu." },
  ],
  web: [
    { key: "poptavky", title: "Víc poptávek z formuláře", text: "Návštěvník vás kontaktuje." },
    { key: "prohlidky", title: "Víc prohlídek nabídek", text: "Lidé si projdou vaše aktivní nabídky." },
    { key: "znacka", title: "Znalost mého jména", text: "Lidé si vás zapamatují pro budoucí prodej." },
  ],
};

export const offers = [
  { key: "oceneni", title: "Ocenění nemovitosti zdarma", text: "Nejsilnější návnada. Majitel zadá adresu a dostane odhad ceny." },
  { key: "analyza", title: "Analýza trhu v lokalitě", text: "Přehled cen a doby prodeje podobných nemovitostí." },
  { key: "konzultace", title: "Nezávazná konzultace", text: "Krátká schůzka, kde probereme prodej." },
];

export const channelInfo: Record<ChannelKey, { name: string; available: boolean; connected: boolean; role: string }> = {
  google: { name: "Google Ads", available: true, connected: false, role: "Zachytí lidi, kteří už aktivně hledají." },
  meta: { name: "Facebook a Instagram", available: true, connected: false, role: "Osloví lidi, kteří o koupi či prodeji zatím nepřemýšlejí." },
  sklik: { name: "Sklik (Seznam)", available: false, connected: false, role: "Dosah na uživatele Seznamu a Sreality." },
};

export function listingOf(subject: Subject): Listing | undefined {
  return listings.find((l) => l.id === subject.listingId);
}

/** Doporučení kanálů s důvodem, přizpůsobené cíli a nemovitosti. */
export function recommend(goal: Goal, subject: Subject): Record<ChannelKey, { rec: boolean; reason: string }> {
  const l = listingOf(subject);
  if (goal === "prodej" && l) {
    const rent = l.type === "Pronájem";
    return {
      google: { rec: true, reason: rent ? "Lidé hledající pronájem v lokalitě píšou konkrétní dotazy. Zachytíte je ve chvíli, kdy hledají." : `Kupující ${l.premium ? "vily či penthousu" : "bytu"} v lokalitě aktivně hledají. Jsou nejblíž rozhodnutí.` },
      meta: { rec: true, reason: l.premium ? "Cena nad 20 mil. Kč: obrazová reklama a cílení na vyšší příjmové skupiny oslovují i ty, kteří zatím nehledají." : "Obrazová reklama ukáže nabídku lidem, kteří zatím nehledají, ale odpovídají profilu kupujících." },
      sklik: { rec: false, reason: "Hodí se jako doplněk k Googlu. Zatím připravujeme." },
    };
  }
  if (goal === "zakazky") {
    return {
      google: { rec: true, reason: "Majitelé, kteří uvažují o prodeji, často hledají „ocenění bytu“ nebo „prodej nemovitosti“. Přivedeme je na formulář." },
      meta: { rec: true, reason: "Majitelé, kteří o prodeji teprve přemýšlejí. Formulář přímo ve Facebooku snižuje bariéru." },
      sklik: { rec: false, reason: "Hodí se jako doplněk k Googlu. Zatím připravujeme." },
    };
  }
  if (goal === "znacka") {
    return {
      google: { rec: false, reason: "Pro budování značky méně vhodný. Hodí se, jen pokud chcete být vidět při hledání vašeho jména." },
      meta: { rec: true, reason: "Obrazové a příběhové reklamy nejlépe budují důvěru. Můžete ukázat hodnocení a výsledky." },
      sklik: { rec: false, reason: "Hodí se jako doplněk k Googlu. Zatím připravujeme." },
    };
  }
  return {
    google: { rec: true, reason: "Lidé, kteří hledají makléře v regionu, přijdou na váš web s jasným záměrem." },
    meta: { rec: true, reason: "Připomene váš web lidem, kteří ho už navštívili, a osloví podobné publikum." },
    sklik: { rec: false, reason: "Hodí se jako doplněk k Googlu. Zatím připravujeme." },
  };
}

export function defaults(goal: Goal, subject: Subject): { daily: number; days: number } {
  const l = listingOf(subject);
  if (goal === "prodej" && l) return { daily: l.premium ? 450 : l.type === "Pronájem" ? 150 : 250, days: l.premium ? 21 : 14 };
  if (goal === "zakazky") return { daily: 300, days: 30 };
  if (goal === "znacka") return { daily: 150, days: 30 };
  return { daily: 200, days: 30 };
}

export type Planned = {
  id: string;
  channel: ChannelKey;
  name: string;
  role: "Povědomí" | "Zájem" | "Dotlačení";
  audience: string;
  format: string;
  from: number;
  to: number;
  weight: number;
};

const place = (s: Subject) => s.region ?? listingOf(s)?.city.split(" – ")[0] ?? "Praha";

export function campaignsFor(goal: Goal, subject: Subject, chan: Set<ChannelKey>): Planned[] {
  const l = listingOf(subject);
  const p = place(subject);
  const all: Planned[] = [];
  const kind = l ? (l.type === "Pronájem" ? "pronájem" : l.premium ? "vila" : "byt") : "";

  if (goal === "prodej" && l) {
    all.push(
      { id: "m1", channel: "meta", name: "Představení nabídky", role: "Povědomí", audience: l.premium ? "35–64 let, vyšší příjem, zájem o investice a luxusní bydlení, Praha + 40 km" : l.type === "Pronájem" ? "24–40 let, hledají pronájem, Praha" : "28–50 let, rodiny a páry, hledají koupi bytu, Praha a okolí", format: "Obrázková reklama ve feedu a příbězích", from: 0, to: 0.7, weight: 3 },
      { id: "m2", channel: "meta", name: "Připomenutí návštěvníkům", role: "Dotlačení", audience: "Lidé, kteří navštívili váš web nebo detail nabídky, ale nekontaktovali vás", format: "Remarketing", from: 0.35, to: 1, weight: 1.5 },
      { id: "g1", channel: "google", name: `Vyhledávání: ${kind} ${p}`, role: "Zájem", audience: "Lidé, kteří právě hledají v lokalitě", format: "Textová reklama ve vyhledávání", from: 0, to: 1, weight: 3.5 },
      { id: "s1", channel: "sklik", name: "Vyhledávání na Seznamu", role: "Zájem", audience: "Uživatelé Seznamu hledající v lokalitě", format: "Textová reklama", from: 0, to: 1, weight: 2 },
    );
  } else if (goal === "zakazky") {
    all.push(
      { id: "g1", channel: "google", name: `Vyhledávání: prodej a ocenění, ${p}`, role: "Zájem", audience: `Majitelé v regionu ${p}, kteří hledají ocenění nebo prodej`, format: "Textová reklama ve vyhledávání", from: 0, to: 1, weight: 3.5 },
      { id: "m1", channel: "meta", name: "Kolik stojí vaše nemovitost?", role: "Povědomí", audience: `Majitelé 40–70 let v regionu ${p}`, format: "Reklama s formulářem pro ocenění", from: 0, to: 0.75, weight: 3 },
      { id: "m2", channel: "meta", name: "Připomenutí návštěvníkům formuláře", role: "Dotlačení", audience: "Lidé, kteří formulář otevřeli, ale neodeslali", format: "Remarketing", from: 0.3, to: 1, weight: 1.2 },
      { id: "s1", channel: "sklik", name: "Vyhledávání na Seznamu", role: "Zájem", audience: `Majitelé v regionu ${p}`, format: "Textová reklama", from: 0, to: 1, weight: 1.5 },
    );
  } else if (goal === "znacka") {
    all.push(
      { id: "m1", channel: "meta", name: "Představení makléře", role: "Povědomí", audience: `Lidé 30–60 let v regionu ${p}`, format: "Obrázková reklama s vaším příběhem", from: 0, to: 0.7, weight: 3 },
      { id: "m2", channel: "meta", name: "Hodnocení klientů", role: "Dotlačení", audience: "Ti, kdo viděli první reklamu nebo váš profil", format: "Reklama s hodnocením", from: 0.35, to: 1, weight: 2 },
      { id: "g1", channel: "google", name: `Vyhledávání: makléř ${p}`, role: "Zájem", audience: "Lidé, kteří hledají makléře v regionu", format: "Textová reklama ve vyhledávání", from: 0, to: 1, weight: 1.5 },
      { id: "s1", channel: "sklik", name: "Vyhledávání na Seznamu", role: "Zájem", audience: `Uživatelé Seznamu v regionu ${p}`, format: "Textová reklama", from: 0, to: 1, weight: 1 },
    );
  } else {
    all.push(
      { id: "g1", channel: "google", name: `Vyhledávání: realitní makléř ${p}`, role: "Zájem", audience: "Lidé, kteří hledají makléře v regionu", format: "Textová reklama ve vyhledávání", from: 0, to: 1, weight: 3 },
      { id: "m1", channel: "meta", name: "Návštěvy webu", role: "Povědomí", audience: `Lidé 28–55 let v regionu ${p}, podobní vašim klientům`, format: "Obrázková reklama s odkazem na web", from: 0, to: 0.7, weight: 3 },
      { id: "m2", channel: "meta", name: "Připomenutí návštěvníkům", role: "Dotlačení", audience: "Lidé, kteří už byli na vašem webu", format: "Remarketing", from: 0.3, to: 1, weight: 1.5 },
      { id: "s1", channel: "sklik", name: "Vyhledávání na Seznamu", role: "Zájem", audience: `Uživatelé Seznamu v regionu ${p}`, format: "Textová reklama", from: 0, to: 1, weight: 1.5 },
    );
  }
  const chosen = all.filter((c) => chan.has(c.channel));
  const total = chosen.reduce((a, c) => a + c.weight, 0) || 1;
  return chosen.map((c) => ({ ...c, weight: c.weight / total }));
}

export function estimate(goal: Goal, subject: Subject, total: number): { label: string; lo: number; hi: number; assumption: string } {
  const l = listingOf(subject);
  if (goal === "prodej" && l) {
    const [a, b] = l.premium ? [650, 1000] : l.type === "Pronájem" ? [150, 300] : [350, 600];
    return { label: "poptávek", lo: Math.round(total / b), hi: Math.round(total / a), assumption: `Předpokládáme cenu za poptávku ${a}–${b} Kč (průměr oboru pro ${l.premium ? "prémiové nemovitosti" : l.type === "Pronájem" ? "pronájmy" : "byty"}).` };
  }
  if (goal === "zakazky") return { label: "kontaktů majitelů", lo: Math.round(total / 700), hi: Math.round(total / 400), assumption: "Předpokládáme cenu za kontakt majitele 400–700 Kč." };
  if (goal === "znacka") return { label: "tisíc zobrazení", lo: Math.round(total / 110), hi: Math.round(total / 60), assumption: "Předpokládáme cenu 60–110 Kč za tisíc zobrazení." };
  return { label: "návštěv webu", lo: Math.round(total / 8), hi: Math.round(total / 4), assumption: "Předpokládáme cenu za návštěvu 4–8 Kč." };
}

export type Evidence = { label: string; value: string; note: string; source: "Poski REAL CRM" | "Váš web" | "Průměr oboru" | "Vaše zadání" };

export function evidenceFor(goal: Goal, subject: Subject): Evidence[] {
  const l = listingOf(subject);
  if (goal === "prodej" && l) {
    return [
      { label: "Nabídka", value: `${l.disposition}, ${l.area} m², ${shortPrice(l)}`, note: l.premium ? "Prémiový segment: kupujících je méně, ale cílení je přesnější." : "Běžný segment: dostatek kupujících, důležitá je cena a fotky.", source: "Poski REAL CRM" },
      { label: "Doba v nabídce", value: `${l.daysActive} dní`, note: l.daysActive > 30 ? "Nad 30 dní zájem obvykle klesá. Nový impuls pomůže." : "Čerstvá nabídka, nejvyšší zájem bývá prvních 14 dní.", source: "Poski REAL CRM" },
      { label: "Poptávky za 30 dní", value: l.id === "vila-mrchojedy" ? "6, z toho 4 z Prahy 6 a 7" : "4–9", note: "Ukazují, odkud lidé přicházejí. Na tuto lokalitu míříme.", source: "Poski REAL CRM" },
      { label: "Klienti s odpovídající poptávkou", value: l.premium ? "3, shoda 82–96 %" : "2", note: "Osloveni budou e-mailem a SMS zvlášť, mimo placenou reklamu.", source: "Poski REAL CRM" },
      { label: "Návštěvnost webu", value: `${agent.webVisits.toLocaleString("cs-CZ")} za měsíc`, note: "Z tohoto publika vytvoříme remarketing.", source: "Váš web" },
      { label: "Doba prodeje podobných nabídek", value: l.premium ? "kolem 63 dní" : "kolem 38 dní", note: "Orientační průměr. Skutečná doba závisí na ceně a stavu.", source: "Průměr oboru" },
    ];
  }
  if (goal === "zakazky") {
    return [
      { label: "Region", value: subject.region ?? "–", note: "Reklamu zobrazíme jen majitelům v tomto regionu.", source: "Vaše zadání" },
      { label: "Úspěšné obchody", value: `${agent.sold} za ${agent.years} let`, note: "Silný argument v reklamě. Použijeme skutečné číslo.", source: "Poski REAL CRM" },
      { label: "Hodnocení klientů", value: `${agent.rating} z 5 (${agent.reviews} hodnocení)`, note: "Důvěryhodnost pro majitele, kteří vás ještě neznají.", source: "Poski REAL CRM" },
      { label: "Konverze webu", value: "1,3 %", note: "Z 100 návštěv přijde přibližně jedna poptávka. S formulářem ocenění bývá víc.", source: "Váš web" },
      { label: "Doba prodeje v regionu", value: "kolem 54 dní", note: "Argument pro rychlý prodej, použijeme ho opatrně.", source: "Průměr oboru" },
    ];
  }
  if (goal === "znacka") {
    return [
      { label: "Obchody", value: `${agent.sold}`, note: "Skutečné číslo z vašeho CRM, nic nezveličujeme.", source: "Poski REAL CRM" },
      { label: "Hodnocení", value: `${agent.rating} z 5`, note: `${agent.reviews} hodnocení klientů.`, source: "Poski REAL CRM" },
      { label: "Praxe", value: `${agent.years} let`, note: "Stálé jméno v regionu.", source: "Poski REAL CRM" },
      { label: "Region", value: subject.region ?? "–", note: "Lidé, kteří vás uvidí, žijí v tomto regionu.", source: "Vaše zadání" },
    ];
  }
  return [
    { label: "Návštěvnost webu", value: `${agent.webVisits.toLocaleString("cs-CZ")} za měsíc`, note: "Základ pro remarketing a podobná publika.", source: "Váš web" },
    { label: "Poptávky z webu", value: `${agent.webLeads} za měsíc`, note: "Konverze přibližně 1,3 %.", source: "Váš web" },
    { label: "Aktivní nabídky na webu", value: `${listings.length}`, note: "Návštěvník uvidí aktuální nabídky, ne prázdnou stránku.", source: "Poski REAL CRM" },
    { label: "Region", value: subject.region ?? "–", note: "Reklama míří na lidi v tomto regionu.", source: "Vaše zadání" },
  ];
}

export function audienceFor(goal: Goal, subject: Subject): { title: string; why: string[] } {
  const l = listingOf(subject);
  if (goal === "prodej" && l) {
    return l.premium
      ? { title: "Kupující vyšší střední třídy, 35–64 let, Praha a okolí 40 km", why: ["Ceny nad 20 mil. Kč kupují převážně lidé s příjmem a majetkem, kteří už nemovitost vlastní.", "Vaše dosavadní poptávky u této nabídky mají podobný profil (zdroj: CRM).", "Úzké cílení šetří rozpočet. Neplatíte za lidi, kteří si nemovitost nemohou dovolit."] }
      : l.type === "Pronájem"
        ? { title: "Lidé 24–40 let, kteří hledají pronájem v Praze", why: ["Pronájmy hledají především mladí profesionálové.", "Poptávka je vysoká (7 za 30 dní), proto stačí menší rozpočet.", "Krátká kampaň na 14 dní je pro pronájem dostatečná."] }
        : { title: "Rodiny a páry 28–50 let, hledají koupi bytu v Praze", why: ["Bytů tohoto typu se nejvíc kupuje v této věkové skupině.", "Poptávky z CRM odpovídají tomuto profilu.", "Vzdálenost k metru a rekonstrukce jsou argumenty, které použijeme v textech."] };
  }
  if (goal === "zakazky") return { title: `Majitelé nemovitostí v regionu ${subject.region ?? ""}`, why: ["Na reklamu reagují lidé, kteří o prodeji přemýšlejí do 12 měsíců.", "Návnada „ocenění zdarma“ snižuje bariéru a dává vám důvod zavolat.", "Reklama bude mluvit o skutečných číslech z vašeho CRM, ne o slibech."] };
  if (goal === "znacka") return { title: `Lidé 30–60 let v regionu ${subject.region ?? ""}`, why: ["Značka se staví opakovaným zobrazením, proto nasazujeme dvě fáze.", "Hodnocení a obchody jsou skutečné, vycházejí z vašeho CRM.", "Cílem není okamžitá poptávka, ale že si vás lidé vybavíte, až budou prodávat."] };
  return { title: `Lidé 28–55 let v regionu ${subject.region ?? ""}`, why: ["Podobní vašim dosavadním klientům (zdroj: CRM).", "Lidé, kteří už web viděli, dostanou připomenutí. Mají nejvyšší šanci zavolat.", "Web ukazuje aktuální nabídky, proto reklama nevede na prázdnou stránku."] };
}

export const checkpoints = [
  { day: "Den 3", text: "Zkontrolujeme, zda se reklamy zobrazují a jestli nepřekračují rozpočet." },
  { day: "Den 7", text: "Přesuneme rozpočet ke kampani, která přináší víc poptávek za nižší cenu." },
  { day: "Konec", text: "Pošleme vyhodnocení: kolik poptávek, za kolik, co fungovalo a co zkusit příště." },
];

export const preflight = [
  "Údaje v reklamě (cena, plocha, lokalita) odpovídají nabídce v CRM.",
  "Žádné nepodložené sliby, použijeme jen čísla, která jsou ve vašich datech.",
  "Reklamy odpovídají pravidlům platforem pro nemovitosti.",
  "Rozpočet nepřekročí částku, kterou schválíte, a hradíte ho ze svého účtu.",
];

export const money = (n: number) => `${Math.round(n).toLocaleString("cs-CZ")} Kč`;

export const regionNote: Record<string, string> = {
  "Praha 6": "Tady máte nejvíc obchodů (22 ze 40) a nejlepší hodnocení.",
  "Praha 1–10": "Širší dosah, ale vyšší cena za zobrazení.",
  "Praha + 30 km": "Vhodné, pokud prodáváte i v okolí Prahy.",
  "Středočeský kraj": "Mimo oblast vašich dosavadních obchodů, reklama bude méně důvěryhodná.",
  "Jihomoravský kraj": "Mimo oblast vašich dosavadních obchodů, reklama bude méně důvěryhodná.",
  "Plzeňský kraj": "Mimo oblast vašich dosavadních obchodů, reklama bude méně důvěryhodná.",
  "Moravskoslezský kraj": "Mimo oblast vašich dosavadních obchodů, reklama bude méně důvěryhodná.",
};

/** Co AI předvybere a proč. Makléř to jen zkontroluje. */
export function suggest(goal: Goal): { listingId?: string; region?: string; segment?: string; offer?: string; reasons: { listing: string; region: string; segment: string; offer: string } } {
  const pick = listings.filter((l) => l.premium).sort((a, b) => b.daysActive - a.daysActive)[0];
  const seg = { zakazky: "byty", znacka: "duvera", web: "poptavky", prodej: undefined }[goal];
  return {
    listingId: goal === "prodej" ? pick.id : undefined,
    region: goal === "prodej" ? undefined : "Praha 6",
    segment: seg,
    offer: goal === "zakazky" ? "oceneni" : undefined,
    reasons: {
      listing: `Prémiová nabídka, ${pick.daysActive} dní bez rezervace a zatím bez reklamy.`,
      region: regionNote["Praha 6"],
      segment:
        goal === "zakazky"
          ? "Byty tvoří 70 % vašich obchodů a prodávají se nejrychleji."
          : goal === "znacka"
            ? `Máte hodnocení ${agent.rating} z 5 od ${agent.reviews} klientů, to je vaše nejsilnější karta.`
            : "Web má 1 840 návštěv měsíčně, ale jen 1,3 % z nich vás kontaktuje. Tady je největší prostor.",
      offer: "Nejsilnější nabídka pro majitele, kteří se teprve rozhodují. Dává vám důvod zavolat.",
    },
  };
}

export function subjectValid(goal: Goal, s: Subject): boolean {
  if (goal === "prodej") return !!s.listingId;
  if (goal === "zakazky") return !!(s.region && s.segment && s.offer);
  return !!(s.region && s.segment);
}

export function subjectSummary(goal: Goal, s: Subject): string {
  if (goal === "prodej") return "";
  const parts: string[] = [];
  if (s.region) parts.push(s.region);
  const seg = segments[goal].find((x) => x.key === s.segment);
  if (seg) parts.push(seg.title);
  const off = offers.find((x) => x.key === s.offer);
  if (goal === "zakazky" && off) parts.push(off.title);
  return parts.join(" · ");
}
