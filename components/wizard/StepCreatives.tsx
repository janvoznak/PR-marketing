"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Banner, { AgentBanner } from "@/components/Banner";
import { ChannelLogo } from "@/components/Logos";
import { Modal } from "@/components/Modal";
import { Scaled } from "@/components/Panel";
import { agent, buildAds } from "@/lib/data";
import { channelInfo, listingOf, money, offers, type ChannelKey, type Goal, type Planned, type Subject } from "@/lib/campaign";
import type { Landing } from "@/components/wizard/Wizard";

type Texts = { headlines: string[]; descriptions: string[]; primary: string; headline: string; cta: string };

const ctaOptions = ["Zjistit více", "Domluvit prohlídku", "Zobrazit moje nabídky", "Zjistit cenu", "Kontaktovat nás"];

function textsFor(goal: Goal, s: Subject, landing: Landing): Texts {
  const l = listingOf(s);
  const region = s.region ?? "Praha";
  if (goal === "prodej" && l) {
    const ads = buildAds(l);
    return {
      headlines: ads.google.headlines.slice(0, 3),
      descriptions: ads.google.descriptions,
      primary: ads.meta.primary,
      headline: ads.meta.headline,
      cta: landing === "web" ? "Zobrazit moje nabídky" : "Domluvit prohlídku",
    };
  }
  if (goal === "zakazky") {
    const offer = offers.find((o) => o.key === s.offer)?.title ?? "Ocenění zdarma";
    return {
      headlines: [`Prodej nemovitosti, ${region}`, offer, `Makléř ${agent.name}`],
      descriptions: [`${offer}. Ověřený makléř s hodnocením ${agent.rating}/5 od ${agent.reviews} klientů.`, `Zjistěte, za kolik můžete prodat. Nezávazně na ${agent.web}.`],
      primary: `🏡 Uvažujete o prodeji nemovitosti v regionu ${region}?\n\n✔ ${offer}\n✔ ${agent.sold} úspěšných obchodů\n✔ Hodnocení ${agent.rating}/5 od ${agent.reviews} klientů\n\n👉 Zjistěte hodnotu své nemovitosti`,
      headline: offer,
      cta: "Zjistit cenu",
    };
  }
  if (goal === "znacka") {
    const focus = s.segment === "expert" ? "Tipy z praxe pro prodejce a kupující" : s.segment === "region" ? `Jsem makléř pro ${region}` : "Co o mně říkají klienti";
    return {
      headlines: [`Makléř ${region}, Poski REAL`, `${agent.sold} obchodů, hodnocení ${agent.rating}/5`, `${agent.years} let praxe v realitách`],
      descriptions: [`Ověřený makléř s ${agent.reviews} hodnoceními klientů. Podívejte se na reference.`, `Poradím s prodejem i koupí. ${agent.web}`],
      primary: `👋 ${focus}\n\nJsem ${agent.name}. ${agent.years} let pomáhám lidem v regionu ${region} s prodejem a koupí nemovitosti.\n\n✔ ${agent.sold} úspěšných obchodů\n✔ Hodnocení ${agent.rating}/5 (${agent.reviews} klientů)`,
      headline: agent.name,
      cta: "Zjistit více",
    };
  }
  return {
    headlines: [`Realitní makléř, ${region}`, `${agent.sold} úspěšných prodejů`, "Aktuální nabídky online"],
    descriptions: [`Prohlédněte si aktuální nabídky makléře ${agent.name}. Prohlídky ještě tento týden.`, `Ověřený makléř, ${agent.reviews} hodnocení klientů.`],
    primary: `👋 Jsem ${agent.name}, vaše jistota při koupi i prodeji nemovitosti v regionu ${region}.\n\n✔ ${agent.sold} úspěšných obchodů\n✔ Aktuální nabídky na jednom místě\n\n👉 Prohlédněte si moje nabídky`,
    headline: "Moje aktuální nabídky",
    cta: "Zobrazit moje nabídky",
  };
}

const rationale: Record<Planned["role"], string> = {
  Povědomí: "Obrázek a cena zastaví posouvání feedu. Cílem je, aby si lidé nabídku zapamatovali.",
  Zájem: "Text odpovídá tomu, co lidé hledají, proto je krátký a konkrétní, s cenou a lokalitou.",
  Dotlačení: "Lidé už nabídku znají. Reklama je krátká a vede přímo k prohlídce nebo kontaktu.",
};

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={`text-[11px] ${value.length > max ? "font-semibold text-red-600" : "text-gray-400"}`}>{value.length}/{max}</span>;
}

function Field({ label, max, value, onChange, rows }: { label: string; max?: number; value: string; onChange: (v: string) => void; rows?: number }) {
  const cls = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
  return (
    <label className="block">
      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
        {label}
        {max && <Counter value={value} max={max} />}
      </div>
      {rows ? <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={cls} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
    </label>
  );
}

export default function StepCreatives({
  goal,
  subject,
  planned,
  landing,
  created,
  setCreated,
  total,
}: {
  goal: Goal;
  subject: Subject;
  planned: Planned[];
  landing: Landing;
  created: boolean;
  setCreated: (b: boolean) => void;
  total: number;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | ChannelKey>("all");
  const [edited, setEdited] = useState<Record<string, Texts>>({});
  const [format, setFormat] = useState<"feed" | "story">("feed");
  const l = listingOf(subject);
  const base = textsFor(goal, subject, landing);
  const textsOf = (c: Planned) => edited[c.id] ?? base;
  const updateFor = (c: Planned, patch: Partial<Texts>) => setEdited({ ...edited, [c.id]: { ...textsOf(c), ...patch } });

  useEffect(() => {
    if (created) return;
    const id = setTimeout(() => setCreated(true), 1300);
    return () => clearTimeout(id);
  }, [created, setCreated]);

  if (!created) {
    return (
      <section className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
        <h3 className="text-lg font-semibold tracking-tight text-[#14233b]">Vytvářím reklamy ke {planned.length} kampaním…</h3>
        <p className="mt-1 max-w-xl text-sm text-gray-500">Podle schválené strategie připravuji texty a bannery zvlášť pro každou kampaň a platformu. Používám jen údaje z vašeho CRM.</p>
        <ul className="mt-4 space-y-2">
          {planned.slice(0, 5).map((c) => (
            <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-2.5 text-sm">
              <ChannelLogo channel={c.channel} size={22} />
              <span className="font-medium text-gray-900">{c.name}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const banner = (variant: "feed" | "story" | "wide") =>
    goal === "prodej" && l ? <Banner listing={l} variant={variant} toWeb={landing === "web"} /> : <AgentBanner variant={variant} acquisition={goal === "zakazky"} />;

  const used = [...new Set(planned.map((c) => c.channel))] as ChannelKey[];
  const visible = planned.filter((c) => filter === "all" || c.channel === filter);
  const openC = planned.find((c) => c.id === open);
  const close = () => {
    if (open) setSeen(new Set(seen).add(open));
    setOpen(null);
  };

  const detail = (c: Planned) => {
    const t = textsOf(c);
    const isMeta = c.channel === "meta";
    const query = c.name.replace(/^Vyhledávání: /, "");
    return (
      <div>
        <p className="mb-4 text-[13px] text-gray-500">
          <b className="text-gray-700">Proč takhle:</b> {rationale[c.role]}
        </p>
        {!isMeta ? (
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-xs font-medium text-gray-500">Náhled ve vyhledávání Google</div>
              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="mb-4 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-700 ring-1 ring-gray-200">{query}</div>
                <div className="text-xs text-gray-700">
                  <b>Sponzorováno</b> · {agent.web}
                </div>
                <div className="mt-1 text-xl leading-snug text-[#1a0dab]">{t.headlines.filter(Boolean).join(" | ")}</div>
                <div className="mt-1 text-sm text-gray-700">{t.descriptions[0]}</div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500">Nadpisy</div>
                {t.headlines.map((h, i) => (
                  <Field key={i} label={`Nadpis ${i + 1}`} max={30} value={h} onChange={(v) => updateFor(c, { headlines: t.headlines.map((x, j) => (j === i ? v : x)) })} />
                ))}
              </div>
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500">Popisky</div>
                {t.descriptions.map((d, i) => (
                  <Field key={i} label={`Popisek ${i + 1}`} max={90} rows={3} value={d} onChange={(v) => updateFor(c, { descriptions: t.descriptions.map((x, j) => (j === i ? v : x)) })} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(
                [
                  ["feed", "Příspěvek ve feedu"],
                  ["story", "Story"],
                ] as const
              ).map(([k, n]) => (
                <button key={k} onClick={() => setFormat(k)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${format === k ? "bg-brand text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40"}`}>
                  {n}
                </button>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-[340px_1fr]">
              {format === "feed" ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-2.5 p-3">
                    <img src={agent.photo} alt="" className="size-9 rounded-full object-cover object-top" />
                    <div className="text-[13px] leading-tight">
                      <div className="font-semibold text-gray-900">{agent.name} · Poski REAL</div>
                      <div className="text-[11px] text-gray-500">Sponzorováno</div>
                    </div>
                  </div>
                  <div className="whitespace-pre-line px-3 pb-3 text-[13px] leading-snug text-gray-800">{t.primary}</div>
                  <Scaled w={338} ratio={1} dw={360}>{banner("feed")}</Scaled>
                  <div className="flex items-center justify-between gap-3 bg-gray-50 p-3">
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase text-gray-500">{agent.web}</div>
                      <div className="truncate text-sm font-semibold text-gray-900">{t.headline}</div>
                    </div>
                    <span className="shrink-0 rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800">{t.cta}</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center rounded-2xl bg-gray-50 py-5">
                  <Scaled w={200} ratio={9 / 16} dw={250}>{banner("story")}</Scaled>
                </div>
              )}
              <div className="space-y-3">
                <Field label="Hlavní text reklamy" rows={9} value={t.primary} onChange={(v) => updateFor(c, { primary: v })} />
                <Field label="Nadpis" max={40} value={t.headline} onChange={(v) => updateFor(c, { headline: v })} />
                <label className="block">
                  <div className="text-xs font-medium text-gray-600">Tlačítko</div>
                  <select value={t.cta} onChange={(e) => updateFor(c, { cta: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                    {ctaOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[#14233b]">Reklamy ke kampaním</h3>
          <p className="text-sm text-gray-500">Otevřete kampaň, prohlédněte si, jak reklama vypadá, a případně upravte texty.</p>
        </div>
        <div className="text-sm text-gray-600">
          Zkontrolováno <b className="text-gray-900">{seen.size}</b> z {planned.length}
        </div>
      </div>

      {used.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {([["all", "Vše", planned.length], ...used.map((u) => [u, channelInfo[u].name, planned.filter((c) => c.channel === u).length])] as [string, string, number][]).map(([k, n, count]) => (
            <button key={k} onClick={() => setFilter(k as "all" | ChannelKey)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === k ? "bg-brand text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40"}`}>
              {n} · {count}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {visible.map((c) => {
          const t = textsOf(c);
          const done = seen.has(c.id);
          return (
            <button key={c.id} onClick={() => setOpen(c.id)} className="flex flex-col rounded-3xl bg-white p-4 text-left ring-1 ring-black/5 transition hover:ring-brand/50">
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-gray-100">
                  <ChannelLogo channel={c.channel} size={c.channel === "meta" ? 22 : 24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-gray-900">{c.name}</span>
                  <span className="block text-[11px] text-gray-500">{channelInfo[c.channel].name} · {c.role}</span>
                </span>
              </div>

              <div className="mt-3 flex min-h-[92px] items-center gap-3 rounded-2xl bg-gray-50 p-3">
                {c.channel === "meta" ? (
                  <>
                    <div className="shrink-0"><Scaled w={72} ratio={1} dw={360}>{banner("feed")}</Scaled></div>
                    <div className="min-w-0 text-[12px] leading-snug text-gray-700">
                      <div className="line-clamp-3">{t.primary.replace(/\n+/g, " ")}</div>
                    </div>
                  </>
                ) : (
                  <div className="min-w-0 text-[12px] leading-snug">
                    <div className="line-clamp-2 text-[14px] text-[#1a0dab]">{t.headlines.filter(Boolean).join(" | ")}</div>
                    <div className="mt-0.5 line-clamp-2 text-gray-600">{t.descriptions[0]}</div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-[13px]">
                <span className="font-semibold text-gray-900">{money(total * c.weight)}</span>
                {done ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                    <span className="grid size-4 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold">✓</span> Zkontrolováno
                  </span>
                ) : (
                  <span className="font-semibold text-brand">Zobrazit a upravit</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {openC && (
        <Modal title={openC.name} wide onClose={close}>
          {detail(openC)}
        </Modal>
      )}
    </div>
  );
}
