export type Listing = {
  id: string;
  title: string;
  street: string;
  city: string;
  type: "Prodej" | "Pronájem";
  price: number;
  area: number;
  disposition: string;
  highlights: string[];
  hue: [string, string];
  photo: string;
  premium: boolean;
  daysActive: number;
};

export const agent = {
  name: "Vladimír Vaněk",
  initials: "VV",
  phone: "+420 777 123 456",
  email: "vladimir.vanek@poski.com",
  photo: "/img/makler.jpg",
  web: "vladimirvanek.poski.com",
  webVisits: 1840,
  webLeads: 23,
  branch: "Poski reality s.r.o.",
  region: "Praha a okolí",
  sold: 40,
  years: 9,
  revenue: "1 539 743 Kč",
  rating: 4.9,
  reviews: 38,
};

export const listings: Listing[] = [
  {
    id: "vila-mrchojedy",
    title: "Luxusní rodinná vila se zahradou a bazénem",
    street: "Na Vyhlídce 12",
    city: "Praha 6 – Ořechovka",
    type: "Prodej",
    price: 38900000,
    area: 412,
    disposition: "7+kk",
    highlights: ["Vyhřívaný bazén", "Pozemek 1 120 m²", "Dvojgaráž", "Smart home", "Klidná vilová čtvrť"],
    hue: ["#0b4fc4", "#38bdf8"],
    photo: "/img/vila.jpg",
    premium: true,
    daysActive: 41,
  },
  {
    id: "penthouse-vinohrady",
    title: "Designový penthouse s terasou a výhledem na Prahu",
    street: "Francouzská 8",
    city: "Praha 2 – Vinohrady",
    type: "Prodej",
    price: 24500000,
    area: 187,
    disposition: "5+kk",
    highlights: ["Terasa 64 m²", "Panoramatický výhled", "2× garážové stání", "Klimatizace"],
    hue: ["#7c3aed", "#f472b6"],
    photo: "/img/penthouse.jpg",
    premium: true,
    daysActive: 18,
  },
  {
    id: "byt-karlin",
    title: "Světlý byt po rekonstrukci v centru Karlína",
    street: "Sokolovská 140",
    city: "Praha 8 – Karlín",
    type: "Prodej",
    price: 8490000,
    area: 74,
    disposition: "3+kk",
    highlights: ["Balkon", "Nová kuchyň", "Metro 3 min", "Sklep"],
    hue: ["#059669", "#a3e635"],
    photo: "/img/byt.jpg",
    premium: false,
    daysActive: 9,
  },
  {
    id: "pronajem-smichov",
    title: "Moderní 2+kk v novostavbě na Smíchově",
    street: "Radlická 21",
    city: "Praha 5 – Smíchov",
    type: "Pronájem",
    price: 29500,
    area: 58,
    disposition: "2+kk",
    highlights: ["Zařízeno", "Parkování", "Ihned volné"],
    hue: ["#ea580c", "#fbbf24"],
    photo: "/img/pronajem.jpg",
    premium: false,
    daysActive: 4,
  },
];

export const formatPrice = (l: Listing) =>
  l.type === "Pronájem"
    ? `${l.price.toLocaleString("cs-CZ")} Kč / měs.`
    : `${l.price.toLocaleString("cs-CZ")} Kč`;

export const shortPrice = (l: Listing) =>
  l.type === "Pronájem"
    ? `${(l.price / 1000).toFixed(1).replace(".", ",")} tis. Kč/měs.`
    : `${(l.price / 1_000_000).toFixed(1).replace(".", ",")} mil. Kč`;

export type Channel = "Google Ads" | "Meta" | "Instagram" | "Sreality";

export const bannerFormats = [
  { key: "feed", label: "Facebook / Instagram feed", size: "1080 × 1080", ratio: "aspect-square" },
  { key: "story", label: "Story / Reels", size: "1080 × 1920", ratio: "aspect-[9/16]" },
  { key: "wide", label: "Google Display – obdélník", size: "1200 × 628", ratio: "aspect-[1200/628]" },
] as const;

export function buildAds(l: Listing) {
  const rent = l.type === "Pronájem";
  return {
    google: {
      headlines: [
        `${l.disposition} ${rent ? "k pronájmu" : "na prodej"} – ${l.city.split(" – ")[1] ?? l.city}`,
        `${l.area} m² ${rent ? "ihned volné" : "– prohlídky tento týden"}`,
        rent ? `Pronájem od ${shortPrice(l)}` : `Cena ${shortPrice(l)}`,
        `Makléř ${agent.name} – Poski REAL`,
      ],
      descriptions: [
        `${l.title}. ${l.highlights.slice(0, 3).join(", ")}. Domluvte si nezávaznou prohlídku.`,
        `Ověřený makléř s ${agent.sold} úspěšnými obchody. Zavolejte ${agent.phone}.`,
      ],
    },
    meta: {
      primary: rent
        ? `✨ Hledáte nový domov? ${l.disposition} v lokalitě ${l.city} je připraveno k nastěhování.\n\n${l.highlights.map((h) => `✔ ${h}`).join("\n")}\n\n📞 Prohlídka na zavolání: ${agent.phone}`
        : `🏡 ${l.title}\n\n${l.area} m² | ${l.disposition} | ${l.city}\n\n${l.highlights.map((h) => `✔ ${h}`).join("\n")}\n\n💰 ${formatPrice(l)}\n📞 ${agent.name}, ${agent.phone}`,
      headline: `${l.disposition} · ${l.area} m² · ${shortPrice(l)}`,
      cta: "Domluvit prohlídku",
    },
    instagram: {
      caption: `${l.title} ✨\n📍 ${l.city}\n\n${l.highlights.slice(0, 4).join(" • ")}\n\nProhlídky domluvíte v DM nebo na ${agent.phone}.`,
      hashtags: ["#poskireal", "#reality", "#praha", rent ? "#pronajem" : "#nemovitosti", "#bydleni", l.premium ? "#luxusnibydleni" : "#novydomov"],
    },
    audience: l.premium
      ? { range: "35–64 let", detail: "Vyšší příjem, zájem o investice a luxusní bydlení, Praha + 40 km", budget: "450 Kč / den", duration: "21 dní", reach: "≈ 62 000 osob" }
      : rent
        ? { range: "24–40 let", detail: "Hledají pronájem, mladí profesionálové, Praha", budget: "150 Kč / den", duration: "14 dní", reach: "≈ 28 000 osob" }
        : { range: "28–50 let", detail: "Hledají koupi bytu, rodiny a páry, Praha a okolí", budget: "250 Kč / den", duration: "14 dní", reach: "≈ 41 000 osob" },
  };
}

export const campaigns = [
  { name: "Vila Ořechovka – Meta", status: "Běží", spend: "5 820 Kč", leads: 11, ctr: "2,8 %" },
  { name: "Byt Karlín – Google", status: "Pozastaveno", spend: "1 940 Kč", leads: 4, ctr: "3,4 %" },
];

export const promoTargets = [
  { key: "web", label: "Web makléře", desc: `Reklama vede na ${agent.web}, kde má klient všechny vaše nabídky a kontakt.`, recommended: true },
  { key: "listing", label: "Detail inzerátu", desc: "Reklama vede přímo na jednu nabídku na Poski.com / portálech.", recommended: false },
] as const;


export const channelStats = [
  { channel: "Meta (FB + IG)", spend: 7240, leads: 14, color: "#4f46e5" },
  { channel: "Google Ads", spend: 5180, leads: 9, color: "#0b4fc4" },
  { channel: "Web makléře (organicky)", spend: 0, leads: 23, color: "#059669" },
  { channel: "E-mail klientům", spend: 0, leads: 6, color: "#f59e0b" },
];

export const visitsTrend = [38, 44, 41, 52, 60, 55, 71, 66, 80, 76, 92, 88, 101, 97];

export const matchedBuyers = [
  { who: "Klient J. N.", note: "Hledá vilu, Praha 6/7, do 40 mil.", match: 96 },
  { who: "Klient M. K.", note: "Rodinný dům se zahradou, Praha západ", match: 91 },
  { who: "Klient P. D.", note: "Investice, luxusní nemovitost", match: 84 },
  { who: "Klient L. S.", note: "Vila s bazénem, do 45 mil.", match: 82 },
  { who: "Klient T. H.", note: "Dům 6+kk, Praha 6", match: 77 },
];
