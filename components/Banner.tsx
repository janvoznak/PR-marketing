import { Globe, Home, Phone } from "lucide-react";
import { agent, formatPrice, shortPrice, type Listing } from "@/lib/data";

type Variant = "feed" | "story" | "wide";

/* eslint-disable @next/next/no-img-element */

/** Šablona banneru: Poski brand + fotka nabídky + makléř (foto, jméno, telefon). */
export default function Banner({
  listing,
  variant,
  toWeb = false,
}: {
  listing: Listing;
  variant: Variant;
  toWeb?: boolean;
}) {
  const cta = toWeb ? agent.web : "Domluvit prohlídku";

  if (variant === "wide") {
    return (
      <div className="relative flex h-full w-full overflow-hidden rounded-lg bg-gray-800 text-white">
        <img src={listing.photo} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div className="relative flex w-3/5 flex-col justify-between p-[5%]">
          <Logo small />
          <div>
            <div className="text-[11px] font-semibold uppercase opacity-85">
              {listing.type} · {listing.disposition} · {listing.area} m²
            </div>
            <div className="mt-1 text-lg font-extrabold leading-tight">{listing.title}</div>
            <div className="mt-2 inline-block rounded bg-white px-2 py-0.5 text-sm font-extrabold text-brand">
              {shortPrice(listing)}
            </div>
          </div>
        </div>
        <div className="absolute bottom-[8%] right-[4%] flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-[10px] font-bold text-brand">
          <img src={agent.photo} alt="" className="size-7 rounded-full object-cover object-top" />
          {cta}
        </div>
      </div>
    );
  }

  const story = variant === "story";
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg bg-gray-800 p-[6%] text-white">
      <img src={listing.photo} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/35" />
      <div className="relative">
        <Logo />
      </div>
      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
          {listing.type} · {listing.city}
        </div>
        <div className={`mt-1 font-extrabold leading-tight ${story ? "text-2xl" : "text-xl"}`}>{listing.title}</div>
        <div className="mt-1 text-xs opacity-90">
          {listing.disposition} · {listing.area} m²
        </div>
        <div className="mt-3 inline-block rounded-md bg-white px-3 py-1 text-base font-extrabold text-brand">
          {formatPrice(listing)}
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/95 p-2 text-gray-800">
          <img src={agent.photo} alt="" className="size-11 shrink-0 rounded-full object-cover object-top" />
          <div className="min-w-0 text-[11px] leading-tight">
            <div className="font-bold">{agent.name}</div>
            {toWeb ? (
              <div className="flex items-center gap-1 font-semibold text-brand">
                <Globe size={10} /> {agent.web}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-500">
                <Phone size={10} /> {agent.phone}
              </div>
            )}
          </div>
          {story && (
            <div className="ml-auto rounded-full bg-brand px-2 py-1 text-[10px] font-bold text-white">Swipe up</div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Banner propagující makléře a jeho web (bez konkrétní nemovitosti). */
export function AgentBanner({ variant, acquisition = false }: { variant: Variant; acquisition?: boolean }) {
  const headline = acquisition ? "Chcete prodat nemovitost? Vyplatí se vám to." : "Váš makléř pro Prahu a okolí";
  const sub = acquisition
    ? `Ocenění zdarma a prodej do 60 dní. ${agent.sold} obchodů.`
    : `${agent.sold} úspěšných obchodů · hodnocení ${agent.rating}/5`;

  if (variant === "wide") {
    return (
      <div className="relative flex h-full w-full overflow-hidden rounded-lg bg-gradient-to-r from-brand-dark to-brand text-white">
        <div className="flex w-3/5 flex-col justify-between p-[5%]">
          <Logo small />
          <div>
            <div className="text-lg font-extrabold leading-tight">{headline}</div>
            <div className="mt-1 text-[11px] opacity-90">{sub}</div>
            <div className="mt-2 inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-extrabold text-brand">
              <Globe size={11} /> {agent.web}
            </div>
          </div>
        </div>
        <img src={agent.photo} alt="" className="absolute bottom-0 right-0 h-full w-2/5 object-cover object-top" />
      </div>
    );
  }
  const story = variant === "story";
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg bg-brand p-[6%] text-white">
      <img src={agent.photo} alt="" className="absolute inset-0 size-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/25 to-transparent" />
      <div className="relative">
        <Logo />
      </div>
      <div className="relative">
        <div className={`font-extrabold leading-tight ${story ? "text-2xl" : "text-xl"}`}>{headline}</div>
        <div className="mt-1 text-xs opacity-90">{sub}</div>
        <div className="mt-1 text-sm font-bold">{agent.name}</div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-extrabold text-brand">
          <Globe size={13} /> {agent.web}
        </div>
      </div>
    </div>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`grid place-items-center rounded-md bg-white text-brand ${small ? "size-6" : "size-8"}`}>
        <Home size={small ? 14 : 18} />
      </div>
      <div className="leading-none">
        <div className="text-[8px] font-medium opacity-85">Poski</div>
        <div className={`font-extrabold ${small ? "text-sm" : "text-base"}`}>REAL</div>
      </div>
    </div>
  );
}
